"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import OptimizeImage from "../../common/optimize-image";
import { navbarAnimations } from "@/constants/animation-variants";
import { LogoSection } from "../navbar/logo-section";

interface LogoDecorationsProps {
  currentTheme: string;
}

const foregroundThemeClasses: Record<string, string> = {
  "theme-gold": "bg-theme-gold-foreground",
  "theme-blue": "bg-theme-blue-foreground",
  "theme-pink": "bg-theme-pink-foreground",
  "theme-red": "bg-theme-red-foreground"
};

export function LogoDecorations({ currentTheme }: LogoDecorationsProps) {
  return (
    <motion.div
      className={`w-full 3xl:w-5/6 rounded-xl max-h-24 h-20 sm:h-24 ${foregroundThemeClasses[currentTheme]} md:rounded-bl-md shadow-[0px_4px_6px_0px_rgba(0,0,0,0.25)] border border-[#c9d1c1] relative `}
      variants={navbarAnimations.item}
    >
      <div className="w-[85%] flex justify-center md:block md:w-3/4 bg-white absolute md:left-10 top-3 rounded-xl p-2 sm:p-3 md:p-4 px-3 sm:px-6 md:px-8  md:translate-x-0">
        <div className="w-fit relative">
          <LogoSection />
        </div>

        <div className="absolute top-0 right-0 bottom-0 rounded-r-xl overflow-hidden hidden md:block">
          <OptimizeImage
            src="/assets/image/navbar/bkt_jsc_texture.webp"
            width={80}
            height={68}
            alt="bkt_jsc_texture"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRg..."
            priority
          />
        </div>
      </div>
    </motion.div>
  );
}
