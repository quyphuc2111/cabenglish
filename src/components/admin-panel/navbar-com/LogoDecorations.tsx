"use client";
import OptimizeImage from "../../common/optimize-image";
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
    <div
      className={`w-full py-3 h-full rounded-xl ${foregroundThemeClasses[currentTheme]} md:rounded-bl-md shadow-[0px_4px_6px_0px_rgba(0,0,0,0.25)] border border-[#c9d1c1] flex items-center justify-center `}
    >
      <div className="w-[100%] h-full flex justify-center items-center md:w-3/4 bg-white  md:left-10 top-1 xl:top-3 rounded-xl p-1 sm:p-2 xl:p-2 xl:sm:p-3 xl:md:py-2 px-2 sm:px-4 xl:px-3 xl:sm:px-6 xl:md:px-8 md:translate-x-0">
        <div className="w-fit relative">
          <LogoSection />
        </div>

        <div className="absolute top-0 right-0 bottom-0 rounded-r-xl overflow-hidden hidden md:block xl:hidden 2xl:visible">
          <OptimizeImage
            src="/assets/image/navbar/bkt_jsc_texture.webp"
            width={60}
            height={48}
            alt="bkt_jsc_texture"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRg..."
            priority
            className="xl:w-[80px] xl:h-[68px]"
          />
        </div>
      </div>
    </div>
  );
}
