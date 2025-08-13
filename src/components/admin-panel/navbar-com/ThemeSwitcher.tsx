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

  const currentTheme = userInfo?.theme || "theme-red";
  const currentColor = themeColors[currentTheme as keyof typeof themeColors];
  const currentClass = themeClasses[currentTheme as keyof typeof themeClasses];

  if (error) {
    console.error("Error fetching user theme:", error);
  }

  return (
    <motion.div
      className="border border-gray-200 rounded-lg flex items-center justify-between
        bg-white w-full h-10 sm:h-12 md:h-14 xl:h-12
        px-3 sm:px-4 md:px-5
        shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer
        transform-gpu will-change-transform backface-visibility-hidden"
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

      {/* ✅ Thêm indicator hiển thị theme hiện tại */}
      <div className="flex items-center gap-2">
        {isLoading ? (
          <motion.div
            className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        ) : (
          <motion.div
            className={`w-6 h-6 rounded-full border-2 border-white shadow-sm ${currentClass}`}
            style={{ backgroundColor: currentColor }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            key={currentTheme} // ✅ Key để trigger animation khi theme thay đổi
          />
        )}
      </div>
    </motion.div>
  );
}
