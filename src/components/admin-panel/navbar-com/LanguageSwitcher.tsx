"use client";
import Image from "next/image";
import { Switch } from "../../ui/switch";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import i18next from "i18next";

interface LanguageSwitcherProps {
  t: (key: string) => string;
}

export function LanguageSwitcher({ t }: LanguageSwitcherProps) {
  const [isChecked, setIsChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const currentLang = searchParams.get("lang");
    setIsChecked(currentLang === "en");
    if (currentLang) {
      i18next.changeLanguage(currentLang);
    }
  }, []);

  const handleLanguageChange = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const currentLang = searchParams.get("lang");
    const newLang = currentLang === "en" ? "vi" : "en";
    const currentPath = window.location.pathname;
    const newUrl = `${currentPath}?lang=${newLang}`;
    i18next.changeLanguage(newLang);
    router.push(newUrl);
    router.refresh();
    setIsChecked(!isChecked);
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    if (!(e.target as HTMLElement).closest(".switch-component")) {
      handleLanguageChange();
    }
  };

  return (
    <motion.div
      className="relative flex items-center w-full"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleContainerClick}
    >
      <div
        className="flex items-center justify-between w-full
        bg-white px-3 sm:px-4 md:px-5 
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
