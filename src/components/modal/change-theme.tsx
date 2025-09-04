"use client";

import React from "react";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "../ui/dialog";
import { useModal } from "@/hooks/useModalStore";
import { useUserTheme, useUserStore } from "@/store/useUserStore";
import Image from "next/image";
import StarIcon from "../icon/star";
import { Button } from "../ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useUpdateUserInfo } from "@/hooks/client/useUser";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useUserInfo } from "@/hooks/useUserInfo";
import {
  measureThemeSwitch,
  measureThemeSwitchEnd,
  checkPerformanceIssues
} from "@/utils/theme-performance";

const THEME_OPTIONS = [
  { id: "theme-gold", color: "#ECC98D" },
  { id: "theme-blue", color: "#A7C6F5" },
  { id: "theme-pink", color: "#ea69ae" },
  { id: "theme-red", color: "#E25762" }
];

const THEME_CLASSES = {
  "theme-gold": "bg-[#ECC98D]",
  "theme-blue": "bg-[#A7C6F5]",
  "theme-pink": "bg-[#ea69ae]",
  "theme-red": "bg-[#E25762]"
};

type ThemeType = "theme-gold" | "theme-blue" | "theme-pink" | "theme-red";

function ChangeTheme() {
  const { isOpen, onClose, type } = useModal();

  const { data: session, update } = useSession();
  const { data: userInfo } = useUserInfo(session?.user?.userId);
  const currentTheme = userInfo?.theme ?? "theme-red";

  const [selectedTheme, setSelectedTheme] = React.useState<ThemeType>(
    (currentTheme as ThemeType) || "theme-red"
  );

  React.useEffect(() => {
    if (userInfo?.theme) {
      setSelectedTheme(userInfo.theme as ThemeType);
    }
  }, [userInfo?.theme]);

  const { mutate: updateUserInfo, isPending } = useUpdateUserInfo();

  const handleChangeTheme = async () => {
    // ✅ Kiểm tra nếu theme không thay đổi thì không cần update
    if (selectedTheme === currentTheme) {
      onClose();
      return;
    }

    // ✅ Start performance measurement
    measureThemeSwitch();

    try {
      updateUserInfo(
        {
          userId: session?.user.userId as string,
          userInfo: {
            theme: selectedTheme,
            email: session?.user.email || "",
            language: session?.user.language || "",
            mode: session?.user.mode || "",
            is_firstlogin: session?.user.is_firstlogin || false
          }
        },
        {
          onSuccess: async () => {
            try {
              // ✅ Update session với theme mới
              await update({
                user: {
                  ...session?.user,
                  theme: selectedTheme
                }
              });

              // ✅ End performance measurement
              const metric = measureThemeSwitchEnd();

              // ✅ Check for performance issues
              checkPerformanceIssues();

              // ✅ Đóng modal sau khi update thành công
              onClose();

              // ✅ Optional: Show success feedback
              console.log(
                "Theme updated successfully:",
                selectedTheme,
                `(${metric?.duration?.toFixed(2)}ms)`
              );
            } catch (sessionError) {
              console.error("Lỗi khi cập nhật session:", sessionError);
              measureThemeSwitchEnd(); // End measurement even on error
              // Vẫn đóng modal vì theme đã được lưu vào database
              onClose();
            }
          },
          onError: (error) => {
            console.error("Lỗi khi cập nhật theme:", error);
            measureThemeSwitchEnd(); // End measurement on error
            // ✅ Reset về theme cũ nếu có lỗi
            setSelectedTheme(currentTheme as ThemeType);
            // ✅ Optional: Show error toast
            alert("Có lỗi xảy ra khi thay đổi theme. Vui lòng thử lại.");
          }
        }
      );
    } catch (error) {
      console.error("Lỗi khi cập nhật theme:", error);
      measureThemeSwitchEnd(); // End measurement on error
      // ✅ Reset về theme cũ nếu có lỗi
      setSelectedTheme(currentTheme as ThemeType);
      alert("Có lỗi xảy ra khi thay đổi theme. Vui lòng thử lại.");
    }
  };

  return (
    <Dialog open={isOpen && type === "changeTheme"} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-3xl sm:max-w-3xl !rounded-3xl overflow-hidden !fixed !top-1/2 !left-1/2 !-translate-x-1/2 !-translate-y-1/2 !z-50 max-h-[90vh] overflow-y-auto">
        {/* Loading Overlay */}
        <AnimatePresence>
          {isPending && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center rounded-3xl"
            >
              <motion.div
                className="bg-white rounded-lg p-4 sm:p-6 shadow-lg flex flex-col items-center gap-3 sm:gap-4 mx-4"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
              >
                <motion.div
                  className="w-6 h-6 sm:w-8 sm:h-8 border-4 border-[#17B155] border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <p className="text-gray-700 font-medium text-sm sm:text-base text-center">
                  Đang cập nhật theme...
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <DialogHeader>
            <DialogTitle>
              <motion.div
                className="flex items-center gap-3 sm:gap-5 w-full justify-center sm:justify-start"
                initial={{ x: -50 }}
                animate={{ x: 0 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                <div className="w-[50px] h-[31px] sm:w-[66px] sm:h-[41px] flex items-center">
                  <Image
                    src="/bkt_logo.png"
                    width={171}
                    height={54}
                    alt="color_icon"
                    className="object-cover"
                    priority
                  />
                </div>
                <h2 className="flex items-center text-lg sm:text-xl">SmartKid</h2>
              </motion.div>
            </DialogTitle>
          </DialogHeader>

          <motion.div
            className="flex flex-col items-center gap-4 sm:gap-7 px-2 sm:px-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex gap-2 sm:gap-3 items-center flex-wrap justify-center">
              <p className="font-semibold text-sm sm:text-base text-center">Thay đổi màu nền SmartKid</p>
              <motion.div
                initial={{ rotate: -180, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <Image
                  src="/navbar/color.png"
                  width={20}
                  height={20}
                  alt="color_icon"
                  className="sm:w-[25px] sm:h-[25px]"
                />
              </motion.div>
            </div>

            <div className="flex gap-8 sm:gap-12 md:gap-20 flex-wrap justify-center">
              {THEME_OPTIONS.map((theme, index) => (
                <motion.div
                  key={theme.id}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    delay: 0.1 * index,
                    type: "spring",
                    stiffness: 260,
                    damping: 20
                  }}
                  whileHover={{
                    scale: 1.1,
                    rotate: 180,
                    transition: { duration: 0.3 }
                  }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() =>
                    !isPending && setSelectedTheme(theme.id as ThemeType)
                  }
                  className={`cursor-pointer relative touch-manipulation ${
                    isPending ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <div className="w-[45px] h-[45px] sm:w-[58px] sm:h-[58px] flex items-center justify-center">
                    <StarIcon
                      width={45}
                      height={45}
                      color={theme.color}
                    />
                  </div>
                  {selectedTheme === theme.id && (
                    <motion.div
                      className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-white"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500 }}
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="flex justify-center mt-8 sm:mt-20 -mb-3 sm:-mb-5 px-2"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="w-full sm:w-3/4 md:w-1/2 border p-3 sm:p-2 rounded relative">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-2">
                <motion.div
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    repeatDelay: 1
                  }}
                  className="flex-shrink-0"
                >
                  <StarIcon
                    width={32}
                    height={32}
                    color={
                      THEME_OPTIONS.find((t) => t.id === selectedTheme)
                        ?.color || "#E25762"
                    }
                  />
                </motion.div>
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
                  <motion.div
                    className={`${THEME_CLASSES[selectedTheme]} h-8 sm:h-10 w-full sm:w-48 rounded relative overflow-hidden`}
                    layoutId="themeColor"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  >
                    {isPending && (
                      <motion.div
                        className="absolute inset-0 bg-white/30 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <motion.div
                          className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear"
                          }}
                        />
                      </motion.div>
                    )}
                  </motion.div>
                  <Button
                    onClick={handleChangeTheme}
                    disabled={isPending}
                    className="bg-[#17B155] hover:bg-[#17B155]/80 min-w-[80px] w-full sm:w-auto text-sm sm:text-base py-2 sm:py-3 relative touch-manipulation"
                  >
                    {isPending ? (
                      <motion.div
                        className="flex items-center gap-2 justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <motion.div
                          className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear"
                          }}
                        />
                        <span className="text-sm sm:text-base">Đang lưu...</span>
                      </motion.div>
                    ) : (
                      "Thay đổi"
                    )}
                  </Button>
                </div>
              </div>

              <Image
                src="/modal/kilan.png"
                width={30}
                height={28}
                alt="kilan"
                className="absolute -top-6 sm:-top-10 left-[15%] transform scale-x-[-1] w-[30px] h-[28px] sm:w-[40px] sm:h-[37px]"
              />
              <Image
                src="/modal/kilan.png"
                width={30}
                height={28}
                alt="kilan"
                className="absolute -top-6 sm:-top-10 right-[20%] w-[30px] h-[28px] sm:w-[40px] sm:h-[37px]"
              />
            </div>
          </motion.div>
          <div className="flex w-full justify-between px-2 sm:px-0 mt-6 lg:mt-0">
            <Image
              src="/navbar/nguoi1.png"
              width={60}
              height={60}
              alt="color_icon"
              className="w-[60px] h-[60px] sm:w-[80px] sm:h-[80px]"
            />
            <Image
              src="/navbar/nguoi1.png"
              width={60}
              height={60}
              alt="color_icon"
              className="w-[60px] h-[60px] sm:w-[80px] sm:h-[80px]"
            />
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

export default ChangeTheme;
