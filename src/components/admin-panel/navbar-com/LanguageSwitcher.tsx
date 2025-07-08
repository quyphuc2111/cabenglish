"use client";
import Image from "next/image";
import { Switch } from "../../ui/switch";
import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import i18next from "i18next";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

interface LanguageSwitcherProps {
  t: (key: string) => string;
  initialLanguage?: string;
  userId?: string;
  updateUserInfo?: ({language}: {language: string}) => Promise<any>;
}

export function LanguageSwitcher({ t, initialLanguage, userId, updateUserInfo }: LanguageSwitcherProps) {
  const [isChecked, setIsChecked] = useState(false);
  const router = useRouter();
  const { data: session, update } = useSession();
  const isChangingRef = useRef(false);

  useEffect(() => {
    // Ưu tiên sử dụng initialLanguage từ session nếu có
    if (initialLanguage) {
      setIsChecked(initialLanguage === "en");
      i18next.changeLanguage(initialLanguage);
    } else {
      // Fallback vào URL params nếu không có session
      const searchParams = new URLSearchParams(window.location.search);
      const currentLang = searchParams.get("lang");
      setIsChecked(currentLang === "en");
      if (currentLang) {
        i18next.changeLanguage(currentLang);
      }
    }
  }, [initialLanguage]);

  const handleLanguageChange = async () => {
    // Ngăn xử lý trùng lặp
    if (isChangingRef.current) return;
    isChangingRef.current = true;
    
    try {
      // Đảo ngược trạng thái checked và cập nhật ngôn ngữ tương ứng
      const newCheckedState = !isChecked;
      const newLang = newCheckedState ? "en" : "vi";
      
      // Cập nhật ngôn ngữ trong database nếu có userId và updateUserInfo
      if (userId && updateUserInfo) {
        try {
          const result = await updateUserInfo({ language: newLang });
          
          if (result && result.success) {
            // Cập nhật session sau khi đã cập nhật thành công trong database
            await update({
              user: {
                ...session?.user,
                language: newLang
              }
            });
            
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
          } else {
            toast.error(result?.error || "Có lỗi xảy ra khi chuyển ngôn ngữ");
          }
        } catch (error) {
          console.error("Không thể cập nhật ngôn ngữ cho người dùng:", error);
          toast.error("Có lỗi xảy ra khi chuyển ngôn ngữ");
        }
      }
      
      // Cập nhật URL và giao diện
      const currentPath = window.location.pathname;
      const newUrl = `${currentPath}?lang=${newLang}`;
      i18next.changeLanguage(newLang);
      router.push(newUrl);
      router.refresh();
      setIsChecked(newCheckedState);
    } finally {
      // Đảm bảo luôn reset flag sau khi xử lý xong
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

  console.log("session", session)

  return (
    <motion.div
      className="relative flex items-center w-full"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleContainerClick}
    >
      <div
        className="flex items-center justify-start gap-3 w-full
        bg-white px-3 sm:px-4 md:pr-5 
        h-10 sm:h-12 md:h-14 xl:h-12
        shadow-sm hover:shadow-md transition-all duration-200 
        border border-gray-200 rounded-lg"
      >
        <Image
          src={
            isChecked
              ? "/assets/image/navbar/american_flag.webp"
              : "/assets/image/navbar/vietnam_flag.webp"
          }
          width={28}
          height={28}
          alt={isChecked ? "american_flag" : "vietnam_flag"}
          className="rounded-sm w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 
            object-contain flex-shrink-0"
          priority
          quality={90}
        />
        <Switch
          id="change_language"
          className="data-[state=checked]:bg-blue-600 scale-75 sm:scale-90 md:scale-100 switch-component"
          checked={isChecked}
          onCheckedChange={handleLanguageChange}
        />
      </div>
    </motion.div>
  );
}
