"use client";
import Image from "next/image";
import { motion } from "framer-motion";

interface LogoutButtonProps {
  onLogout: () => void;
  t: (key: string) => string;
}

export function LogoutButton({ onLogout, t }: LogoutButtonProps) {
  return (
    <motion.div
      className="border border-gray-200 rounded-lg flex items-center justify-end
        bg-[#E25762]/90 w-full h-10 sm:h-12 md:h-14 xl:h-12
        px-3 sm:px-4 md:pr-3 
        shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer
        hover:bg-[#E25762] transform-gpu will-change-transform backface-visibility-hidden order-6"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25,
        duration: 0.15
      }}
      onClick={onLogout}
    >
      <div className="flex items-center gap-2 sm:gap-1 md:gap-2 flex-nowrap w-full">
        <Image
          src="/assets/image/navbar/logout_icon.webp"
          width={28}
          height={28}
          alt="logout_icon"
          className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7
            object-contain flex-shrink-0 
            group-hover:rotate-12 transition-all duration-300
            transform-gpu will-change-transform"
          priority
          quality={100}
          unoptimized={false}
        />
        <p
          className="font-medium group-hover:text-red-500 text-white
            text-sm md:text-sm
            whitespace-nowrap overflow-hidden text-ellipsis
            transition-colors duration-200 transform-gpu will-change-transform"
        >
          {t("logout")}
        </p>
      </div>
    </motion.div>
  );
}
