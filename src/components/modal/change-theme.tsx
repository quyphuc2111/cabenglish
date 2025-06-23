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
  // const currentTheme = useUserTheme();
  const { updateUser } = useUserStore();


  const { data: session, update } = useSession();
  const currentTheme = session?.user.theme ?? "theme-red";

  const [selectedTheme, setSelectedTheme] = React.useState<ThemeType>(
    currentTheme as ThemeType
  );

  const { mutate: updateUserInfo, isPending } = useUpdateUserInfo();
  const router = useRouter();

  const handleChangeTheme = async () => {
    try {
      updateUserInfo({
        userId: session?.user.userId as string,
        userInfo: {
          theme: selectedTheme,
          email: session?.user.email as string,
          language: session?.user.language as string,
          mode: session?.user.mode as string,
        }
      }, {
        onSuccess: async () => {
          await update({
            user: {
              ...session?.user,
              theme: selectedTheme
            }
          });
          onClose();
        },
        onError: (error) => {
          console.error("Lỗi khi cập nhật theme:", error);
        }
      });
    } catch (error) {
      console.error("Lỗi khi cập nhật theme:", error);
    }
  };

  return (
    <Dialog open={isOpen && type === "changeTheme"} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl !rounded-3xl overflow-hidden !fixed !top-1/2 !left-1/2 !-translate-x-1/2 !-translate-y-1/2 !z-50">
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
                className="bg-white rounded-lg p-6 shadow-lg flex flex-col items-center gap-4"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
              >
                <motion.div
                  className="w-8 h-8 border-4 border-[#17B155] border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <p className="text-gray-700 font-medium">Đang cập nhật theme...</p>
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
                className="flex items-center gap-5 w-full"
                initial={{ x: -50 }}
                animate={{ x: 0 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                <div className="w-[66px] h-[41px] flex items-center">
                  <Image
                    src="/bkt_logo.png"
                    width={171}
                    height={54}
                    alt="color_icon"
                    className="object-cover"
                    priority
                  />
                </div>
                <h2 className="flex items-center">Smart Kid</h2>
              </motion.div>
            </DialogTitle>
          </DialogHeader>

          <motion.div
            className="flex flex-col items-center gap-7"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex gap-3 items-center">
              <p className="font-semibold">Thay đổi màu nền Smart Kid</p>
              <motion.div
                initial={{ rotate: -180, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <Image
                  src="/navbar/color.png"
                  width={25}
                  height={25}
                  alt="color_icon"
                />
              </motion.div>
            </div>

            <div className="flex gap-20">
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
                    scale: 1.2,
                    rotate: 360,
                    transition: { duration: 0.5 }
                  }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => !isPending && setSelectedTheme(theme.id as ThemeType)}
                  className={`cursor-pointer relative ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <StarIcon width={58} height={58} color={theme.color} />
                  {selectedTheme === theme.id && (
                    <motion.div
                      className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full"
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
            className="flex justify-center mt-20 -mb-5"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="w-1/2 border p-2 rounded relative">
              <div className="flex items-center justify-center gap-2">
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
                >
                  <StarIcon
                    width={40}
                    height={40}
                    color={
                      THEME_OPTIONS.find((t) => t.id === selectedTheme)?.color
                    }
                  />
                </motion.div>
                <div className="flex items-center gap-3">
                  <motion.div
                    className={`${THEME_CLASSES[selectedTheme]} h-10 w-48 rounded relative overflow-hidden`}
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
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                      </motion.div>
                    )}
                  </motion.div>
                  <Button
                    onClick={handleChangeTheme}
                    disabled={isPending}
                    className="bg-[#17B155] hover:bg-[#17B155]/80 min-w-[80px] relative"
                  >
                    {isPending ? (
                      <motion.div
                        className="flex items-center gap-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <motion.div
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        <span>Đang lưu...</span>
                      </motion.div>
                    ) : (
                      "Thay đổi"
                    )}
                  </Button>
                </div>
              </div>

              <Image
              src="/modal/kilan.png"
              width={40}
              height={37}
              alt="kilan"
              className="absolute -top-10 left-[15%] transform scale-x-[-1]"
            />
              <Image
              src="/modal/kilan.png"
              width={40}
              height={37}
              alt="kilan"
               className="absolute -top-10 right-[20%]"
            />
            </div>
          </motion.div>
          <div className="flex w-full justify-between">
            <Image
              src="/navbar/nguoi1.png"
              width={80}
              height={80}
              alt="color_icon"
            />
            <Image
              src="/navbar/nguoi1.png"
              width={80}
              height={80}
              alt="color_icon"
            />
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

export default ChangeTheme;
