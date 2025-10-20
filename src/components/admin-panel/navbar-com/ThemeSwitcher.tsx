"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { useUserInfo } from "@/hooks/useUserInfo";

interface ThemeSwitcherProps {
  onChangeTheme: () => void;
  t: (key: string) => string;
  userId?: string;
}

export function ThemeSwitcher({
  onChangeTheme,
  t,
  userId
}: ThemeSwitcherProps) {
  const { data: userInfo, isLoading, error } = useUserInfo(userId);

  // ✅ Sửa màu sắc theme để khớp với Tailwind config
  const themeColors = {
    "theme-gold": "#ECC98D",
    "theme-blue": "#A7C6F5",
    "theme-pink": "#ea69ae",
    "theme-red": "#E25762"
  } as const;

  const themeClasses = {
    "theme-gold": "bg-theme-gold-primary",
    "theme-blue": "bg-theme-blue-primary",
    "theme-pink": "bg-theme-pink-primary",
    "theme-red": "bg-theme-red-primary"
  } as const;

  // ✅ Ưu tiên theme từ data-theme attribute (đã set từ server)
  const dataTheme = typeof document !== 'undefined' 
    ? document.body.getAttribute('data-theme') 
    : null;
  const currentTheme = dataTheme || userInfo?.theme || "theme-red";
  const currentColor = themeColors[currentTheme as keyof typeof themeColors];
  const currentClass = themeClasses[currentTheme as keyof typeof themeClasses];

  if (error) {
    console.error("Error fetching user theme:", error);
  }

  return (
    <motion.div
      className="border border-gray-200 rounded-lg flex items-center justify-between
        bg-white w-full h-12 sm:h-12 md:h-14 xl:h-12
        px-3 sm:px-4 md:px-2 2xl:px-5
        shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer
        transform-gpu will-change-transform backface-visibility-hidden gap-2"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25,
        duration: 0.15
      }}
      onClick={onChangeTheme}
    >
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-nowrap">
        <Image
          src="/assets/image/navbar/color.webp"
          width={32}
          height={32}
          alt="color_icon"
          className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8
            object-contain flex-shrink-0 hover:opacity-90 transition-opacity
            transform-gpu will-change-transform"
          priority
          quality={100}
          unoptimized={false}
        />
        <p
          className="font-medium text-gray-700 text-sm
            whitespace-nowrap overflow-hidden text-ellipsis
            transform-gpu will-change-transform"
        >
          {t("changeTheme")}
        </p>
      </div>

    </motion.div>
  );
}
