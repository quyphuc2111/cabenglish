"use client";
import Image from "next/image";
import { motion } from "framer-motion";

interface TeachingModeSwitcherProps {
  currentTeachingMode: string | undefined;
  t: (key: string) => string;
  onClick: () => void;
}

export function TeachingModeSwitcher({
  currentTeachingMode,
  t,
  onClick
}: TeachingModeSwitcherProps) {

  
  return (
    <motion.div
      className="border border-gray-200 rounded-lg flex items-center justify-center md:justify-between
        bg-white w-full h-10 sm:h-12 md:h-14 xl:h-12
        px-3 sm:px-4 md:px-5
        shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      {currentTeachingMode === "defaultMode" ? (
        <div className="flex items-center gap-2 sm:gap-3 flex-nowrap">
          <Image
            src="/assets/image/modal/bkt_logo.webp"
            width={32}
            height={24}
            alt="bkt_logo"
            className="object-contain  h-full sm:w-8 sm:h-6 md:w-10 md:h-8
              flex-shrink-0 hover:opacity-90 transition-opacity"
            quality={100}
            priority
          />
          <p
            className="font-medium text-gray-700 text-sm
              whitespace-nowrap overflow-hidden text-ellipsis"
          >
            {t("defaultMode")}
          </p>
        </div>
      ) : (
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-nowrap">
          <Image
            src="/assets/image/modal/freemode.webp"
            width={28}
            height={24}
            alt="freemode"
            className="object-contain w-6 h-5 sm:w-7 sm:h-6 md:w-9 md:h-8
              flex-shrink-0 hover:opacity-90 transition-opacity"
            priority
          />
          <p
            className="font-medium text-gray-700 text-sm
              whitespace-nowrap overflow-hidden text-ellipsis"
          >
            {t("freeMode")}
          </p>
        </div>
      )}
    </motion.div>
  );
}
