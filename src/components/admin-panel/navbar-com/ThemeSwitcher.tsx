"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { useUserInfo } from "@/hooks/useUserInfo";

interface ThemeSwitcherProps {
  onChangeTheme: () => void;
  t: (key: string) => string;
  userId?: string;
}

export function ThemeSwitcher({ onChangeTheme, t, userId }: ThemeSwitcherProps) {
  const { data: userInfo, isLoading, error } = useUserInfo(userId);

  const themeColors = {
    'theme-gold': '#FFD700',
    'theme-blue': '#3B82F6', 
    'theme-pink': '#EC4899',
    'theme-red': '#EF4444'
  } as const;

  const currentTheme = userInfo?.theme || "theme-red";

  if (error) {
    console.error("Error fetching user theme:", error);
  }

  return (
    <motion.div
      className="border border-gray-200 rounded-lg flex items-center justify-between
        bg-white w-full h-10 sm:h-12 md:h-14 xl:h-12
        px-3 sm:px-4 md:px-5 
        shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onChangeTheme}
    >
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-nowrap">
        <Image
          src="/assets/image/navbar/color.webp"
          width={24}
          height={24}
          alt="color_icon"
          className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 
            object-contain flex-shrink-0 hover:opacity-90 transition-opacity"
          priority
          quality={90}
        />
        <p
          className="font-medium text-gray-700 text-sm 
            whitespace-nowrap overflow-hidden text-ellipsis"
        >
          {t("changeTheme")}
        </p>
      </div>
      
      
    </motion.div>
  );
}
