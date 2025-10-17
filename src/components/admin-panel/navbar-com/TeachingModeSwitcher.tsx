"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { useUserInfo } from "@/hooks/useUserInfo";

interface TeachingModeSwitcherProps {
  t: (key: string) => string;
  onClick: () => void;
  userId?: string;
}

export function TeachingModeSwitcher({
  t,
  onClick,
  userId
}: TeachingModeSwitcherProps) {
  const { data: userInfo, isLoading, error } = useUserInfo(userId);

  const currentTeachingMode =
    userInfo?.mode === "default" ? "defaultMode" : "freeMode";

  if (error) {
    console.error("Error fetching user mode:", error);
  }

  return (
    <motion.div
      className="border border-gray-200 rounded-lg flex items-center justify-center md:justify-between
        bg-white w-full h-12 sm:h-12 md:h-14 xl:h-12
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
      onClick={onClick}
    >
      {isLoading ? (
        <div className="flex items-center gap-2 sm:gap-3 flex-nowrap">
          <div className="w-6 h-5 sm:w-7 sm:h-6 md:w-9 md:h-8 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>
      ) : currentTeachingMode === "defaultMode" ? (
        <div className="flex items-center gap-2 sm:gap-3 flex-nowrap">
          <Image
            src="/bkt_logo.png"
            width={40}
            height={32}
            alt="bkt_logo"
            className="object-contain w-6 h-5 sm:w-8 sm:h-6 md:w-10 md:h-8
              flex-shrink-0 hover:opacity-90 transition-opacity
              transform-gpu will-change-transform"
            quality={100}
            priority
            unoptimized={false}
          />
          <p
            className="font-medium text-gray-700 text-sm
              whitespace-nowrap overflow-hidden text-ellipsis
              transform-gpu will-change-transform"
          >
            {t("defaultMode")}
          </p>
        </div>
      ) : (
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-nowrap">
          <Image
            src="/assets/image/modal/freemode.webp"
            width={36}
            height={32}
            alt="freemode"
            className="object-contain w-6 h-5 sm:w-7 sm:h-6 md:w-9 md:h-8
              flex-shrink-0 hover:opacity-90 transition-opacity
              transform-gpu will-change-transform"
            quality={100}
            priority
            unoptimized={false}
          />
          <p
            className="font-medium text-gray-700 text-sm
              whitespace-nowrap overflow-hidden text-ellipsis
              transform-gpu will-change-transform"
          >
            {t("freeMode")}
          </p>
        </div>
      )}
    </motion.div>
  );
}
