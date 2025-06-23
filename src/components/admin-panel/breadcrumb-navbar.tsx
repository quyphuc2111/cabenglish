"use client";
import { SheetMenu } from "@/components/admin-panel/sheet-menu";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Switch } from "../ui/switch";
import { motion } from "framer-motion";
import { navbarAnimations } from "@/constants/animation-variants";
import { useModal } from "@/hooks/useModalStore";
import { useUserTheme, useUserMode } from "@/store/useUserStore";
import i18next from "i18next";
import { useTranslation } from "@/hooks/useTranslation";
import { useSession } from "next-auth/react";
// import { useTeachingModeStore } from "@/store/useTeachingModeStore";

interface BreadcrumbNavbarProps {
  title: string;
  type?: string;
}

const foregroundThemeClasses = {
  "theme-gold": "bg-theme-gold-foreground",
  "theme-blue": "bg-theme-blue-foreground",
  "theme-pink": "bg-theme-pink-foreground",
  "theme-red": "bg-theme-red-foreground"
};

export function BreadcrumbNavbar({ title, type }: BreadcrumbNavbarProps) {
  // backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0
  const [lastSlug, setLastSlug] = useState<string | any>("");
  const [isChecked, setIsChecked] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const { data: session } = useSession();

  const currentTheme = session?.user.theme ?? "theme-red";
  const { onOpen } = useModal();
  const router = useRouter();
  const currentTeachingMode = session?.user.mode === "default" ? "defaultMode" : "freeMode";

  const { t } = useTranslation("", "common");

  useEffect(() => {
    const url = window.location.href;
    const parts = url.split("/");
    const slug = parts.pop() || parts.pop();

    setLastSlug(slug);
  }, []);

  const handleBack = () => {
    router.push("/lop-hoc");
  };

  const handleClick = () => {
    setIsChecked((prev) => !prev);
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    // Chỉ xử lý click khi không click vào Switch
    if (!(e.target as HTMLElement).closest(".switch-component")) {
      handleClick();
    }
  };

  const handleChangeTheme = () => {
    onOpen("changeTheme");
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

  return (
    <motion.header
      className="z-10 w-full"
      variants={navbarAnimations.container}
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-center justify-between">
        <SheetMenu />
        <motion.div
          className={`w-4/6 3xl:w-2/3 max-h-24 h-24 ${foregroundThemeClasses[currentTheme]} rounded-bl-md shadow-[0px_4px_6px_0px_rgba(0,0,0,0.25)] border border-[#c9d1c1] relative`}
          variants={navbarAnimations.item}
        >
          <motion.div
            className="absolute -top-2 -left-4 -rotate-12"
            variants={navbarAnimations.floating}
            initial="initial"
            animate="animate"
          >
            <Image src="/navbar/lixi.png" width={40} height={40} alt="lesson" />
          </motion.div>

          <div className="w-3/4 bg-white absolute top-1/2 -translate-y-1/2 left-10  rounded-xl p-2 px-12">
            <div className="w-fit relative">
              {/* <LogoSection /> */}
              <div className="flex gap-5">
                <div
                  onClick={handleBack}
                  className=" cursor-pointer flex items-center gap-3 bg-white shadow-lg border border-[#c9d1c1] rounded-xl p-2 hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="relative w-10- h-10 flex-shrink-0">
                    <Image
                      src="/book_multi.png"
                      width={40}
                      height={40}
                      alt="book_multi"
                      className="object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-[#555] text-xl font-bold group-hover:text-[#4079CE] transition-colors duration-300">
                      Lớp học
                    </p>
                    <div className="h-0.5 w-0 bg-[#4079CE] group-hover:w-full transition-all duration-300" />
                  </div>
                </div>
                {title != "Lớp học" && (
                  <div className="cursor-pointer flex items-center gap-3 bg-white shadow-lg border border-[#c9d1c1] rounded-xl p-2 hover:shadow-xl transition-all duration-300 group">
                    <div className="relative w-10- h-10 flex-shrink-0">
                      <Image
                        src="/book_multi.png"
                        width={40}
                        height={40}
                        alt="book_multi"
                        className="object-contain group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex flex-col">
                      <p className="text-[#555] text-xl font-bold group-hover:text-[#4079CE] transition-colors duration-300">
                        {title}
                      </p>
                      <div className="h-0.5 w-0 bg-[#4079CE] group-hover:w-full transition-all duration-300" />
                    </div>
                  </div>
                )}
              </div>
              <motion.div
                className="absolute top-1 -left-8 -rotate-12"
                // variants={rotatingVariants}
                initial="initial"
                animate="animate"
              >
                <Image
                  src="/navbar/hoa.gif"
                  width={30}
                  height={30}
                  alt="lesson"
                />
              </motion.div>

              {/* <div className="absolute -top-3 -right-12 rotate-12">
                <Image
                  src="/navbar/banhchung.png"
                  width={40}
                  height={30}
                  alt="lesson"
                />
              </div> */}

              <div className="absolute right-1/2 rotate-12">
                <Image
                  src="/navbar/kilan.png"
                  width={50}
                  height={50}
                  alt="lesson"
                />
              </div>
            </div>

            <motion.div
              className="absolute top-0 right-[42%] hidden 3xl:block"
              // variants={bellVariants}
              initial="initial"
              animate="animate"
            >
              <Image
                src="/navbar/chuong_rung.gif"
                width={33}
                height={30}
                alt="lesson"
              />
            </motion.div>
            <div className="absolute top-0 right-[32%] hidden 3xl:block">
              <Image
                src="/navbar/chuong_rung.gif"
                width={33}
                height={30}
                alt="lesson"
              />
            </div>
            <div className="absolute top-0 right-[22%] ">
              <Image
                src="/navbar/chuong_rung.gif"
                width={33}
                height={30}
                alt="lesson"
              />
            </div>
            <div className="absolute bottom-0 right-[13%]">
              <Image
                src="/navbar/langbac.png"
                width={40}
                height={30}
                alt="lesson"
              />
            </div>

            <div className="absolute top-0 right-0 bottom-0 rounded-r-xl overflow-hidden">
              <Image
                src="/navbar/bkt_jsc_texture.png"
                width={75}
                height={60}
                alt="lesson"
                className="h-full object-cover"
              />
            </div>

            <motion.div
              className="absolute right-[42%]"
              //  variants={fishVariants}
              initial="initial"
              animate="animate"
            >
              <Image
                src="/navbar/ca-left.png"
                width={40}
                height={40}
                alt="ca-left"
              />
            </motion.div>

            <div className="absolute right-[37%] -bottom-4 hidden 3xl:block">
              <Image
                src="/navbar/ca-right.png"
                width={40}
                height={40}
                alt="lesson"
              />
            </div>

            <div className="absolute right-[25%] -bottom-6">
              <Image
                src="/navbar/banhtet.png"
                width={50}
                height={60}
                alt="lesson"
              />
            </div>

            <motion.div
              className="absolute -right-12 top-0 -rotate-6"
              // animate={{
              //   rotate: [-6, -3, -6],
              //   scale: [1, 1.05, 1],
              //   transition: {
              //     duration: 2,
              //     repeat: Infinity,
              //     ease: "easeInOut"
              //   }
              // }}
            >
              <Image
                src="/navbar/hoadao.png"
                width={50}
                height={60}
                alt="lesson"
              />
            </motion.div>
          </div>

          <motion.div
            className="absolute right-[11%] -bottom-2"
            //  animate={{
            //    y: [-2, 2, -2],
            //    transition: {
            //      duration: 1.5,
            //      repeat: Infinity,
            //      ease: "easeInOut",
            //      delay: 0.2
            //    }
            //  }}
          >
            <Image
              src="/navbar/nguoi1.png"
              width={40}
              height={40}
              alt="lesson"
            />
          </motion.div>

          <div className="absolute right-[6%] -bottom-2 ">
            <Image
              src="/navbar/nguoi2.png"
              width={40}
              height={40}
              alt="lesson"
            />
          </div>

          <div className="absolute right-[1%] -bottom-2 ">
            <Image
              src="/navbar/nguoi3.png"
              width={40}
              height={40}
              alt="lesson"
            />
          </div>

          <motion.div
            className="absolute right-[12%] -top-4"
            variants={navbarAnimations.firework}
            initial="initial"
            animate="animate"
          >
            <Image
              src="/navbar/phaohoa1.png"
              width={35}
              height={35}
              alt="lesson"
            />
          </motion.div>

          <motion.div
            variants={navbarAnimations.firework}
            initial="initial"
            animate="animate"
            className="absolute right-[2%] -top-4 "
          >
            <Image
              src="/navbar/phaohoa1.png"
              width={35}
              height={35}
              alt="lesson"
            />
          </motion.div>

          {/* <div className="absolute right-[10%] top-[25%] ">
            <Image
              src="/navbar/hoa_do.png"
              width={25}
              height={25}
              alt="lesson"
            />
          </div> */}

          <div className="absolute right-[6%] top-0 ">
            <Image
              src="/navbar/hoa_do.png"
              width={25}
              height={25}
              alt="lesson"
            />
          </div>

          <div className="absolute right-[2%] top-[20%] ">
            <Image
              src="/navbar/phaohoa2.png"
              width={40}
              height={40}
              alt="lesson"
            />
          </div>

          <div className="absolute -right-6 top-0 -rotate-12">
            <Image
              src="/navbar/phaono.png"
              width={40}
              height={40}
              alt="lesson"
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
              <p
                className="font-medium text-gray-700 text-sm 
                whitespace-nowrap overflow-hidden text-ellipsis"
              >
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
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRg..."
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

          <motion.div
            className="border border-gray-200 rounded-lg flex items-center justify-between
              bg-[#E25762]/90 w-full h-10 sm:h-12 md:h-14 xl:h-12
              px-3 sm:px-4 md:px-5 
              shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer
              hover:bg-[#E25762]"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onOpen("logout")}
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
        </motion.div>
      </div>
    </motion.header>
  );
}
