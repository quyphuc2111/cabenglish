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
import { useNavbarLogic } from "@/hooks/useNavbarLogic";
import { useModal } from "@/hooks/useModalStore";
import { useThemeStore } from "@/store/useThemeStore";
import useLocalStorage from "@/hooks/use-local-storage";
import { useTeachingModeStore } from "@/store/useTeachingModeStore";

interface NavbarProps {
  title: string;
  type?: string;
}

interface CourseNameMap {
  [key: string]: string;
}

const courseName: CourseNameMap = {
  "tieng-anh-lop-1": "Tiếng anh lớp 1",
  "tieng-anh-lop-2": "Tiếng anh lớp 2",
  "tieng-anh-lop-3": "Tiếng anh lớp 3",
  "tieng-anh-lop-4": "Tiếng anh lớp 4",
  "tieng-anh-lop-5": "Tiếng anh lớp 5"
};

const foregroundThemeClasses = {
  'theme-gold': 'bg-theme-gold-foreground',
  'theme-blue': 'bg-theme-blue-foreground',
  'theme-pink': 'bg-theme-pink-foreground',
  'theme-red': 'bg-theme-red-foreground'
};

const themeSecondaryClasses = {
  'theme-gold': 'bg-theme-gold-secondary',
  'theme-blue': 'bg-theme-blue-secondary',
  'theme-pink': 'bg-theme-pink-secondary',
  'theme-red': 'bg-theme-red-secondary'
};

export function Navbar({ title, type }: NavbarProps) {
  // backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0
  const [lastSlug, setLastSlug] = useState<string | any>("");
  const [isChecked, setIsChecked] = useState(false);

 const { currentTheme } = useThemeStore();
  const { onOpen } = useModal();
  const router = useRouter();
  const {currentTeachingMode} = useTeachingModeStore();

  useEffect(() => {
    const url = window.location.href;
    const parts = url.split("/");
    const slug = parts.pop() || parts.pop();

    setLastSlug(slug);
  }, []);


  const handleBack = () => {
    router.push("/main/khoa-hoc");
  };

  const handleClick = () => {
    setIsChecked((prev) => !prev);
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    // Chỉ xử lý click khi không click vào Switch
    if (!(e.target as HTMLElement).closest('.switch-component')) {
      handleClick();
    }
  };

  const handleChangeTheme = () => {
    onOpen("changeTheme")
  
  }

  // console.log(teachingMode);

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
          className={`w-3/4 max-h-24 h-24 ${foregroundThemeClasses[currentTheme]} rounded-bl-md shadow-[0px_4px_6px_0px_rgba(0,0,0,0.25)] border border-[#c9d1c1] relative`}
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

          <div className="w-3/4 bg-white absolute top-1/2 -translate-y-1/2 left-10  rounded-xl p-4 px-12">
            <div className="w-fit relative">
              {/* <div>
                <span className="text-[#726e6e] text-[21px] font-extrabold tracking-[4.20px]">
                  SMART KID
                </span>
                <span className="text-[#726e6e] text-[21px] font-black tracking-[4.20px]">
                  {" "}
                </span>
                <span className="text-[#c35690] text-[21px] font-black tracking-[4.20px]">
                  2025
                </span>
              </div> */}
              <LogoSection />
              <motion.div
                className="absolute -top-3 -left-8 -rotate-12"
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

              <div className="absolute -top-3 -right-12 rotate-12">
                <Image
                  src="/navbar/banhchung.png"
                  width={40}
                  height={30}
                  alt="lesson"
                />
              </div>

              <div className="absolute right-0 rotate-12">
                <Image
                  src="/navbar/kilan.png"
                  width={50}
                  height={50}
                  alt="lesson"
                />
              </div>
            </div>

            <motion.div
              className="absolute top-0 right-[42%]"
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
            <div className="absolute top-0 right-[32%] ">
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
                alt="lesson"
              />
            </motion.div>

            <div className="absolute right-[37%] -bottom-4">
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

          <div className="absolute right-[10%] top-[25%] ">
            <Image
              src="/navbar/hoa_do.png"
              width={25}
              height={25}
              alt="lesson"
            />
          </div>

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

        <motion.div className=" flex gap-5" variants={navbarAnimations.item}>
          <motion.div
            className="border-[#61685B] border rounded-md flex items-center bg-white px-2 gap-2 h-12"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleContainerClick}
          >
            {isChecked ? (
              <div className="w-12 h-12">
                <Image
                  src="/navbar/american_flag.png"
                  width={512}
                  height={512}
                  alt="american_flag"
                  quality={100}
                  className="object-contain"
                />
              </div>
            ) : (
              <div className="w-12 h-12">
                <Image
                  src="/navbar/vietnam_flag.png"
                  width={512}
                  height={512}
                  alt="vietnam_flag"
                  quality={100}
                  className="object-contain"
                />
              </div>
            )}

            <Switch
              id="change_language"
              className="switch-component"
              checked={isChecked}
              onCheckedChange={handleClick}
            />
          </motion.div>

          <div className="flex flex-col gap-3">
            <motion.div
              className="border-[#61685B] border rounded-md flex items-center bg-white px-2 gap-2 h-12 w-full"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleChangeTheme}
            >
              <Image
                src="/navbar/color.png"
                width={35}
                height={35}
                alt="color_icon"
              />
              <p className="font-bold text-center w-full">Chủ đề</p>
            </motion.div>

            <motion.div
              className="border-[#61685B] border rounded-md flex items-center bg-white gap-2 h-8 pr-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/che-do-giang-day")}
            >
              {currentTeachingMode === "defaultMode" ? (
                <>
                  <Image
                    src="/bkt_logo.png"
                    width={124}
                    height={68}
                    alt="bkt_logo"
                    className="h-full w-14"
                    quality={100}
                  />
                  <p className="font-medium w-fit">Mặc định</p>
                </>
              ) : (
                <>
                  <Image
                    src="/modal/freemode.png"
                    width={40}
                    height={40}
                    alt="bkt_logo"
                    className="h-full w-10 pl-3"
                    quality={100}
                  />
                  <p className="font-medium w-fit">Tự do</p>
                </>
              )}

{/* <>
                  <Image
                    src="/bkt_logo.png"
                    width={124}
                    height={68}
                    alt="bkt_logo"
                    className="h-full w-14"
                    quality={100}
                  />
                  <p className="font-medium w-fit">Mặc định</p>
                </> */}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
}
