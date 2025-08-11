"use client";
import Image from "next/image";
import { Switch } from "../../ui/switch";
import { motion } from "framer-motion";
import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import i18next from "i18next";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { useUserInfo } from "@/hooks/useUserInfo";
import { useUpdateUserInfo } from "@/hooks/client/useUser";
import { useBroadcastSync } from "@/hooks/useBroadcastSync";

interface LanguageSwitcherProps {
  t: (key: string) => string;
  userId?: string;
}

export function LanguageSwitcher({ t, userId }: LanguageSwitcherProps) {
  const [isChecked, setIsChecked] = useState(false);
  const { data: userInfo, isLoading, error } = useUserInfo(userId);
  const { mutate: updateUserInfo, isPending } = useUpdateUserInfo();
  const { broadcastUpdate } = useBroadcastSync();
  const router = useRouter();
  const { data: session, update } = useSession();
  const isChangingRef = useRef(false);

  // Xác định ngôn ngữ hiện tại từ nhiều nguồn
  const getCurrentLanguage = useCallback(() => {
    // Ưu tiên: userInfo > URL params > default
    if (userInfo?.language) {
      return userInfo.language;
    }

    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      return searchParams.get("lang") || "vi";
    }

    return "vi";
  }, [userInfo?.language]);

  // Sync UI state với actual language
  useEffect(() => {
    const currentLang = getCurrentLanguage();
    const shouldBeChecked = currentLang === "en";

    if (isChecked !== shouldBeChecked) {
      setIsChecked(shouldBeChecked);
    }

    // Đảm bảo i18next sync với language hiện tại
    if (i18next.resolvedLanguage !== currentLang) {
      i18next.changeLanguage(currentLang);
    }
  }, [userInfo?.language, isLoading, userId, isChecked, getCurrentLanguage]);

  // Xử lý error case
  useEffect(() => {
    if (error) {
      console.error("Error fetching user language:", error);
      // Fallback về URL params hoặc default
      const currentLang = getCurrentLanguage();
      setIsChecked(currentLang === "en");
      i18next.changeLanguage(currentLang);
    }
  }, [error, getCurrentLanguage]);

  const handleLanguageChange = async () => {
    if (isChangingRef.current || isPending) return;
    isChangingRef.current = true;

    try {
      const currentLang = getCurrentLanguage();
      const newLang = currentLang === "vi" ? "en" : "vi";
      const newCheckedState = newLang === "en";

      // Cập nhật UI state ngay lập tức để responsive
      setIsChecked(newCheckedState);

      // Cập nhật i18next ngay lập tức
      await i18next.changeLanguage(newLang);

      // Cập nhật URL
      const currentPath = window.location.pathname;
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.set("lang", newLang);
      const newUrl = `${currentPath}?${searchParams.toString()}`;

      // Cập nhật user info nếu có user
      if (userId && session?.user) {
        updateUserInfo(
          {
            userId: userId,
            userInfo: {
              email: userInfo?.email || "",
              language: newLang,
              theme: userInfo?.theme || "",
              mode: userInfo?.mode || "",
              is_firstlogin: userInfo?.is_firstlogin || false
            }
          },
          {
            onSuccess: async () => {
              // Broadcast update để sync với các tab khác
              broadcastUpdate(userId);

              // Update session để sync
              await update({
                ...session,
                user: {
                  ...session.user,
                  language: newLang
                }
              });

              toast.success(
                `Đã chuyển sang ngôn ngữ ${
                  newLang === "en" ? "tiếng Anh" : "tiếng Việt"
                }!`,
                {
                  position: "top-right",
                  autoClose: 2000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true
                }
              );
            },
            onError: (error) => {
              console.error(
                "Không thể cập nhật ngôn ngữ cho người dùng:",
                error
              );
              // Revert UI state nếu có lỗi
              setIsChecked(currentLang === "en");
              i18next.changeLanguage(currentLang);
              toast.error("Có lỗi xảy ra khi chuyển ngôn ngữ");
            }
          }
        );
      }

      // Navigate với URL mới
      router.push(newUrl);
    } catch (error) {
      console.error("Error changing language:", error);
      // Revert state nếu có lỗi
      const currentLang = getCurrentLanguage();
      setIsChecked(currentLang === "en");
      toast.error("Có lỗi xảy ra khi chuyển ngôn ngữ");
    } finally {
      // Reset flag sau một khoảng thời gian ngắn
      setTimeout(() => {
        isChangingRef.current = false;
      }, 500);
    }
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    if (!(e.target as HTMLElement).closest(".switch-component")) {
      handleLanguageChange();
    }
  };

  return (
    <motion.div
      className="relative flex items-center w-full"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25,
        duration: 0.15
      }}
      onClick={handleContainerClick}
    >
      <div
        className="flex items-center justify-start gap-3 w-full
        bg-white px-3 sm:px-4 md:pr-5 
        h-10 sm:h-12 md:h-14 xl:h-12
        shadow-sm hover:shadow-md transition-all duration-200 
        border border-gray-200 rounded-lg
        transform-gpu will-change-transform backface-visibility-hidden"
      >
        {isLoading ? (
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-gray-200 rounded-sm animate-pulse"></div>
            <div className="w-10 h-5 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        ) : (
          <>
            <Image
              src={
                isChecked
                  ? "/assets/image/navbar/american_flag.webp"
                  : "/assets/image/navbar/vietnam_flag.webp"
              }
              width={40}
              height={40}
              alt={isChecked ? "american_flag" : "vietnam_flag"}
              className="rounded-sm w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 
                object-cover flex-shrink-0 transform-gpu will-change-transform"
              priority
              quality={100}
              unoptimized={false}
            />
            <Switch
              id="change_language"
              className="data-[state=checked]:bg-blue-600 scale-75 sm:scale-90 md:scale-100 switch-component"
              checked={isChecked}
              onCheckedChange={handleLanguageChange}
              disabled={isLoading || isPending}
            />
          </>
        )}
      </div>
    </motion.div>
  );
}
