"use client";
import Image from "next/image";
import { motion } from "framer-motion";

interface LogoutButtonProps {
  onLogout: () => void;
}

export function LogoutButton({ onLogout }: LogoutButtonProps) {
  return (
    <motion.div
      className="border border-gray-200 rounded-lg flex items-center justify-between
        bg-[#E25762]/90 w-full h-10 sm:h-12 md:h-14 xl:h-12
        px-3 sm:px-4 md:px-5 
        shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer
        hover:bg-[#E25762]"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onLogout}
    >
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-nowrap w-full justify-center">
        <Image
          src="/assets/image/navbar/logout_icon.webp"
          width={24}
          height={24}
          alt="logout_icon"
          className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7
            object-contain flex-shrink-0 
            group-hover:rotate-12 transition-all duration-300"
          priority
        />
        <p
          className="font-medium group-hover:text-red-500 text-white
            text-sm md:text-base
            whitespace-nowrap overflow-hidden text-ellipsis
            transition-colors duration-200"
        >
          Đăng xuất
        </p>
      </div>
    </motion.div>
  );
}
