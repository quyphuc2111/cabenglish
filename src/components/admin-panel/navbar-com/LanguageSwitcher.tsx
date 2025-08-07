"use client";
import Image from "next/image";
import { Switch } from "../../ui/switch";
import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
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

  useEffect(() => {
    if (userInfo?.language) {
      const userLanguage = userInfo.language;
      setIsChecked(userLanguage === "en");
      i18next.changeLanguage(userLanguage);
    } else if (!isLoading && !userId) {

      const searchParams = new URLSearchParams(window.location.search);
      const currentLang = searchParams.get("lang") || "vi";
      setIsChecked(currentLang === "en");
      i18next.changeLanguage(currentLang);
    }
  }, [userInfo, isLoading, userId]);

  useEffect(() => {
    if (error) {
      console.error("Error fetching user language:", error);

      const searchParams = new URLSearchParams(window.location.search);
      const currentLang = searchParams.get("lang") || "vi";
      setIsChecked(currentLang === "en");
      i18next.changeLanguage(currentLang);
    }
  }, [error]);

  const handleLanguageChange = async () => {

    if (isChangingRef.current) return;
    isChangingRef.current = true;
    
    try {

      const newCheckedState = !isChecked;
      const newLang = newCheckedState ? "en" : "vi";
      

      if (userId && session?.user) {
        updateUserInfo({
          userId: userId,
          userInfo: {
            email: userInfo?.email || "",
            language: newLang,
            theme: userInfo?.theme || "",
            mode: userInfo?.mode || "",
            is_firstlogin: userInfo?.is_firstlogin || false,
          }
        }, {
          onSuccess: async () => {

            broadcastUpdate(userId);
            
            toast.success(
              `Đã chuyển sang ngôn ngữ ${newLang === "en" ? "tiếng Anh" : "tiếng Việt"}!`,
              {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true
              }
            );
          },
          onError: (error) => {
            console.error("Không thể cập nhật ngôn ngữ cho người dùng:", error);
            toast.error("Có lỗi xảy ra khi chuyển ngôn ngữ");
          }
        });
      }
      

      const currentPath = window.location.pathname;
      const newUrl = `${currentPath}?lang=${newLang}`;
      i18next.changeLanguage(newLang);
      router.push(newUrl);
      router.refresh();
      setIsChecked(newCheckedState);
    } finally {

      setTimeout(() => {
        isChangingRef.current = false;
      }, 300);
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
