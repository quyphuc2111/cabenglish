"use client";
import { ModeToggle } from "@/components/mode-toggle";
import { UserNav } from "@/components/admin-panel/user-nav";
import { SheetMenu } from "@/components/admin-panel/sheet-menu";
import { Button } from "../ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Switch } from "../ui/switch";
import { motion } from "framer-motion";
import { navbarAnimations } from "@/constants/animation-variants";
import { LogoSection } from "./navbar/logo-section";
import { LanguageSwitcher } from "./navbar/language-switcher";
import { useModal } from "@/hooks/useModalStore";
import { useUserTheme, useUserMode } from "@/store/useUserStore";
import { useTranslation } from "@/hooks/useTranslation";
import i18next from "i18next";
import OptimizeImage from "../common/optimize-image";
// import { useTeachingModeStore } from "@/store/useTeachingModeStore";

interface NavbarProps {
  title: string;
  type?: string;
}

interface CourseNameMap {
  [key: string]: string;
}

// const courseName: CourseNameMap = {
//   "tieng-anh-lop-1": "Tiếng anh lớp 1",
//   "tieng-anh-lop-2": "Tiếng anh lớp 2",
//   "tieng-anh-lop-3": "Tiếng anh lớp 3",
//   "tieng-anh-lop-4": "Tiếng anh lớp 4",
//   "tieng-anh-lop-5": "Tiếng anh lớp 5"
// };

const foregroundThemeClasses = {
  "theme-gold": "bg-theme-gold-foreground",
  "theme-blue": "bg-theme-blue-foreground",
  "theme-pink": "bg-theme-pink-foreground",
  "theme-red": "bg-theme-red-foreground"
};

// const themeSecondaryClasses = {
//   "theme-gold": "bg-theme-gold-secondary",
//   "theme-blue": "bg-theme-blue-secondary",
//   "theme-pink": "bg-theme-pink-secondary",
//   "theme-red": "bg-theme-red-secondary"
// };

export function Navbar({ title, type }: NavbarProps) {
  // backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0
  // const [lastSlug, setLastSlug] = useState<string | any>("");
  const [isChecked, setIsChecked] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const { t } = useTranslation("", "common");

  const currentTheme = useUserTheme();
  const { onOpen } = useModal();
  const router = useRouter();
  const currentTeachingMode = useUserMode();

  // Thêm useEffect để kiểm tra query parameter hiện tại
  useEffect(() => {
    // Lấy ngôn ngữ hiện tại từ URL
    const searchParams = new URLSearchParams(window.location.search);
    const currentLang = searchParams.get("lang");

    // Cập nhật trạng thái switch
    setIsChecked(currentLang === "en");

    // Đồng bộ ngôn ngữ với i18next
    if (currentLang) {
      i18next.changeLanguage(currentLang);
    }
  }, []);

  const handleBack = () => {
    router.push("/main/khoa-hoc");
  };

  const handleLanguageChange = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const currentLang = searchParams.get("lang");

    // Toggle ngôn ngữ
    const newLang = currentLang === "en" ? "vi" : "en";

    // Cập nhật URL với query parameter mới
    const currentPath = window.location.pathname;
    const newUrl = `${currentPath}?lang=${newLang}`;

    // Thay đổi ngôn ngữ trong i18next
    i18next.changeLanguage(newLang);

    // Hard reload trang để áp dụng ngôn ngữ mới
    // window.location.href = newUrl;
    router.push(newUrl);
    router.refresh();

    setIsChecked(!isChecked);
  };

  // Thay thế handleClick và handleContainerClick cũ
  const handleContainerClick = (e: React.MouseEvent) => {
    if (!(e.target as HTMLElement).closest(".switch-component")) {
      handleLanguageChange();
    }
  };

  const handleChangeTheme = () => {
    onOpen("changeTheme");
  };

  return (
    <motion.header
      className="z-10 w-full max-w-[1920px] mx-auto "
      variants={navbarAnimations.container}
      initial="hidden"
      animate="visible"
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 lg:gap-10">
        <SheetMenu />
        <motion.div
          className={`w-full md:w-2/3 max-h-24 h-20 sm:h-24 ${foregroundThemeClasses[currentTheme]} 
            rounded-bl-md shadow-[0px_4px_6px_0px_rgba(0,0,0,0.25)] border border-[#c9d1c1] relative`}
          variants={navbarAnimations.item}
        >
          <motion.div
            className="absolute -top-2 -left-4 -rotate-12 hidden md:block"
            variants={navbarAnimations.floating}
            initial="initial"
            animate="animate"
          >
            <OptimizeImage
              src="/assets/image/navbar/lixi.webp"
              width={40}
              height={40}
              alt="lixi"
              priority
            />
          </motion.div>

          <div className="w-full md:w-3/4 bg-white absolute top-1/2 -translate-y-1/2 
              left-0 md:left-10 rounded-xl p-2 sm:p-3 md:p-4 
              px-3 sm:px-6 md:px-8 lg:px-12">
            <div className="w-fit relative">
              <LogoSection />
              {/* Phần decorative elements */}
              <motion.div
                className="absolute -top-3 -left-8 -rotate-12 hidden md:block"
                initial="initial"
                animate="animate"
              >
                <Image src="/navbar/hoa.gif" width={30} height={30} alt="hoa" />
              </motion.div>

              <div className="absolute -top-3 -right-12 rotate-12 hidden md:block">
                <OptimizeImage
                  src="/assets/image/navbar/banhchung.webp"
                  width={40}
                  height={40}
                  alt="banhchung"
                  priority
                />
              </div>

              <div className="absolute right-0 rotate-12 hidden md:block">
                <OptimizeImage
                  src="/assets/image/navbar/kilan.webp"
                  width={50}
                  height={50}
                  alt="kilan"
                  priority
                />
              </div>
            </div>

            <motion.div
              className="absolute top-0 right-[42%] hidden md:block"
              initial="initial"
              animate="animate"
            >
              <Image
                src="/navbar/chuong_rung.gif"
                width={33}
                height={30}
                alt="chuong_rung"
              />
            </motion.div>
            <div className="absolute top-0 right-[32%] hidden md:block">
              <Image
                src="/navbar/chuong_rung.gif"
                width={33}
                height={30}
                alt="chuong_rung"
              />
            </div>
            <div className="absolute top-0 right-[22%] hidden md:block">
              <Image
                src="/navbar/chuong_rung.gif"
                width={33}
                height={30}
                alt="chuong_rung"
              />
            </div>
            <div className="absolute bottom-0 right-[13%] hidden md:block">
              <OptimizeImage
                src="/assets/image/navbar/langbac.webp"
                width={40}
                height={40}
                alt="langbac"
                priority
              />
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

            <motion.div
              className="absolute right-[42%] hidden md:block"
              initial="initial"
              animate="animate"
            >
              <OptimizeImage
                src="/assets/image/navbar/ca-left.webp"
                width={40}
                height={40}
                alt="ca-left"
                priority
              />
            </motion.div>

            <div className="absolute right-[37%] -bottom-4 hidden md:block">
              <OptimizeImage
                src="/assets/image/navbar/ca-right.webp"
                width={40}
                height={40}
                alt="ca-right"
                priority
              />
            </div>

            <div className="absolute right-[25%] -bottom-6 hidden md:block">
              <OptimizeImage
                src="/assets/image/navbar/banhtet.webp"
                width={40}
                height={40}
                alt="banhtet"
                priority
              />
            </div>

            <motion.div className="absolute -right-12 top-0 -rotate-6 hidden md:block">
              <OptimizeImage
                src="/assets/image/navbar/hoadao.webp"
                width={50}
                height={60}
                alt="hoadao"
                priority
              />
            </motion.div>
          </div>

          <motion.div className="absolute right-[11%] -bottom-2 hidden md:block">
            <OptimizeImage
              src="/assets/image/navbar/nguoi1.webp"
              width={40}
              height={40}
              alt="nguoi1"
              priority
            />
          </motion.div>

          <div className="absolute right-[6%] -bottom-2 hidden md:block ">
            <OptimizeImage
              src="/assets/image/navbar/nguoi2.webp"
              width={40}
              height={40}
              alt="nguoi2"
              priority
            />
          </div>

          <div className="absolute right-[1%] -bottom-2 hidden md:block ">
            <OptimizeImage
              src="/assets/image/navbar/nguoi3.webp"
              width={40}
              height={40}
              alt="nguoi3"
              priority
            />
          </div>

          <motion.div
            className="absolute right-[12%] -top-4 hidden md:block"
            variants={navbarAnimations.firework}
            initial="initial"
            animate="animate"
          >
            <OptimizeImage
              src="/assets/image/navbar/phaohoa1.webp"
              width={35}
              height={35}
              alt="phaohoa1"
              priority
            />
          </motion.div>

          <motion.div
            variants={navbarAnimations.firework}
            initial="initial"
            animate="animate"
            className="absolute right-[2%] -top-4 hidden md:block "
          >
            <OptimizeImage
              src="/assets/image/navbar/phaohoa1.webp"
              width={35}
              height={35}
              alt="phaohoa1"
              priority
            />
          </motion.div>

          <div className="absolute right-[10%] top-[25%] hidden md:block ">
            <OptimizeImage
              src="/assets/image/navbar/hoa_do.webp"
              width={25}
              height={25}
              alt="hoa_do"
              priority
            />
          </div>

          <div className="absolute right-[6%] top-0 hidden md:block">
            <OptimizeImage
              src="/assets/image/navbar/hoa_do.webp"
              width={25}
              height={25}
              alt="hoa_do"
              priority
            />
          </div>

          <div className="absolute right-[2%] top-[20%] hidden md:block">
            <OptimizeImage
              src="/assets/image/navbar/phaohoa2.webp"
              width={40}
              height={40}
              alt="phaohoa2"
              priority
            />
          </div>

          <div className="absolute -right-6 top-0 -rotate-12 hidden md:block">
            <OptimizeImage
              src="/assets/image/navbar/phaono.webp"
              width={40}
              height={40}
              alt="phaono"
              priority
            />
          </div>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 gap-2 sm:gap-3 
            w-full md:w-auto items-center"
          variants={navbarAnimations.item}
        >
          {/* Language Switcher */}
          <motion.div
            className="relative flex items-center w-full"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleContainerClick}
          >
            <div className="flex items-center justify-between w-full
              bg-white px-3 sm:px-4 md:px-5 
              h-10 sm:h-12 md:h-14 xl:h-12
              shadow-sm hover:shadow-md transition-all duration-200 
              border border-gray-200 rounded-lg"
            >
              <Image
                src={isChecked ? "/assets/image/navbar/american_flag.webp" : "/assets/image/navbar/vietnam_flag.webp"}
                width={28}
                height={28}
                alt={isChecked ? "american_flag" : "vietnam_flag"}
                className="rounded-sm w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 
                  object-contain flex-shrink-0"
                priority
                quality={90}
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRg..."
              />
              <Switch
                id="change_language"
                className="data-[state=checked]:bg-blue-600 scale-75 sm:scale-90 md:scale-100"
                checked={isChecked}
                onCheckedChange={handleLanguageChange}
              />
            </div>
          </motion.div>

          {/* Theme Switcher */}
          <motion.div
            className="border border-gray-200 rounded-lg flex items-center justify-between
              bg-white w-full h-10 sm:h-12 md:h-14 xl:h-12
              px-3 sm:px-4 md:px-5 
              shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleChangeTheme}
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
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRg..."
              />
              <p className="font-medium text-gray-700 text-sm 
                whitespace-nowrap overflow-hidden text-ellipsis">
                {t("changeTheme")}
              </p>
            </div>
          </motion.div>

          {/* Teaching Mode Selector */}
          <motion.div
            className="border border-gray-200 rounded-lg flex items-center justify-between
              bg-white w-full h-10 sm:h-12 md:h-14 xl:h-12
              px-3 sm:px-4 md:px-5
              shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/che-do-giang-day")}
          >
            {currentTeachingMode === "defaultMode" ? (
              <div className="flex items-center gap-2 sm:gap-3 flex-nowrap">
                <Image
                  src="/assets/image/modal/bkt_logo.webp"
                  width={32}
                  height={24}
                  alt="bkt_logo"
                  className="object-contain w-full h-full sm:w-8 sm:h-6 md:w-10 md:h-8
                    flex-shrink-0 hover:opacity-90 transition-opacity"
                  quality={100}
                  priority
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRg..."
                />
                <p className="font-medium text-gray-700 text-sm
                  whitespace-nowrap overflow-hidden text-ellipsis">
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
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRg..."
                />
                <p className="font-medium text-gray-700 text-sm
                  whitespace-nowrap overflow-hidden text-ellipsis">
                  {t("freeMode")}
                </p>
              </div>
            )}
          </motion.div>

          <motion.div
            className="border border-gray-200 rounded-lg flex items-center justify-between
              bg-[#E25762]/90 w-full h-10 sm:h-12 md:h-14 xl:h-12
              px-3 sm:px-4 md:px-5 
              shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer
              hover:bg-[#E25762]"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleChangeTheme}
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
                quality={90}
              />
              <p className="font-medium group-hover:text-red-500 text-white
                text-sm md:text-base
                whitespace-nowrap overflow-hidden text-ellipsis
                transition-colors duration-200">
                Đăng xuất
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.header>
  );
}
