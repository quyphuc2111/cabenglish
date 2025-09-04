"use client";
import { SheetMenu } from "@/components/admin-panel/sheet-menu";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { navbarAnimations } from "@/constants/animation-variants";
import { useModal } from "@/hooks/useModalStore";
import { useTranslation } from "@/hooks/useTranslation";
import { useSession } from "next-auth/react";
import { NavbarControls } from "./navbar-com/NavbarControls";
import { useUserInfo } from "@/hooks/useUserInfo";

interface BreadcrumbNavbarProps {
  title: string;
  type?: string;
}

const foregroundThemeClasses: Record<string, string> = {
  "theme-gold": "bg-theme-gold-foreground",
  "theme-blue": "bg-theme-blue-foreground",
  "theme-pink": "bg-theme-pink-foreground",
  "theme-red": "bg-theme-red-foreground"
};

export function BreadcrumbNavbar({ title, type }: BreadcrumbNavbarProps) {
  const [lastSlug, setLastSlug] = useState<string | any>("");

  const { data: session } = useSession();
  const { data: userInfo } = useUserInfo(session?.user?.userId);
  const currentTheme = userInfo?.theme ?? "theme-red";
  const { onOpen } = useModal();
  const router = useRouter();

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

  const handleChangeTheme = () => {
    onOpen("changeTheme");
  };

  const handleLogout = async () => {
    onOpen("logout");
  };

  return (
    <motion.header
      className="z-10 w-full"
      variants={navbarAnimations.container}
      initial="hidden"
      animate="visible"
    >
      <div className="flex flex-col lg:flex-row gap-5 items-start lg:items-center justify-between">
        <SheetMenu />
        <motion.div
          className={`w-full xl:w-2/3 2xl:w-2/3 3xl:w-3/5 max-h-24 h-16 lg:h-24 ${foregroundThemeClasses[currentTheme]} rounded-xl  lg:rounded-bl-md lg:shadow-[0px_4px_6px_0px_rgba(0,0,0,0.25)] border border-[#c9d1c1] relative`}
          variants={navbarAnimations.item}
        >
          {/* <motion.div
            className="absolute -top-2 -left-4 -rotate-12 hidden xl:block"
            variants={navbarAnimations.floating}
            initial="initial"
            animate="animate"
          >
            <Image src="/navbar/lixi.png" width={40} height={40} alt="lesson" />
          </motion.div> */}

          <div className="w-full lg:w-3/4 lg:bg-white absolute top-1/2 -translate-y-1/2 left-0 lg:left-10  rounded-xl p-2 lg:px-4 xl:px-12">
            <div className="w-fit relative">
              <div className="flex gap-5">
                <div
                  onClick={handleBack}
                  className=" cursor-pointer flex items-center gap-3 bg-white shadow-lg border border-[#c9d1c1] rounded-xl p-2 hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="relative w-6 h-6 lg:w-10 lg:h-10 flex-shrink-0">
                    <Image
                      src="/menu-icon/lophoc_icon.png"
                      width={40}
                      height={40}
                      alt="book_multi"
                      className="object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-[#555] text-base lg:text-xl font-bold group-hover:text-[#4079CE] transition-colors duration-300 line-clamp-1 max-w-[100px] lg:max-w-[250px]">
                      Lớp học
                    </p>
                    <div className="h-0.5 w-0 bg-[#4079CE] group-hover:w-full transition-all duration-300" />
                  </div>
                </div>
                {title != "Lớp học" && (
                  <div className="cursor-pointer flex items-center gap-3 bg-white shadow-lg border border-[#c9d1c1] rounded-xl p-2 hover:shadow-xl transition-all duration-300 group">
                    <div className="relative w-6 h-6 lg:w-10 lg:h-10 flex-shrink-0">
                      <Image
                        src="/book_multi.png"
                        width={40}
                        height={40}
                        alt="book_multi"
                        className="object-contain group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex flex-col">
                      <p className="text-[#555] text-base lg:text-xl font-bold group-hover:text-[#4079CE] transition-colors duration-300 line-clamp-1 max-w-[100px] lg:max-w-[250px]">
                        {title}
                      </p>
                      <div className="h-0.5 w-0 bg-[#4079CE] group-hover:w-full transition-all duration-300" />
                    </div>
                  </div>
                )}
              </div>
              {/* <motion.div
                className="absolute top-1 -left-8 -rotate-12 hidden xl:block"
                initial="initial"
                animate="animate"
              >
                <Image
                  src="/navbar/hoa.gif"
                  width={30}
                  height={30}
                  alt="lesson"
                />
              </motion.div> */}

              {/* <div className="absolute right-1/2 rotate-12 hidden xl:block">
                <Image
                  src="/navbar/kilan.png"
                  width={50}
                  height={50}
                  alt="lesson"
                />
              </div> */}
            </div>

            {/* <motion.div
              className="absolute top-0 right-[42%] hidden 3xl:block"
              initial="initial"
              animate="animate"
            >
              <Image
                src="/navbar/chuong_rung.gif"
                width={33}
                height={30}
                alt="lesson"
              />
            </motion.div> */}
            {/* <div className="absolute top-0 right-[32%] hidden 3xl:block">
              <Image
                src="/navbar/chuong_rung.gif"
                width={33}
                height={30}
                alt="lesson"
              />
            </div>
            <div className="absolute top-0 right-[22%] hidden lg:block">
              <Image
                src="/navbar/chuong_rung.gif"
                width={33}
                height={30}
                alt="lesson"
              />
            </div> */}
            <div className="absolute bottom-0 right-[13%] hidden lg:block">
              <Image
                src="/navbar/langbac.png"
                width={40}
                height={30}
                alt="lesson"
              />
            </div>

            <div className="absolute top-0 right-0 bottom-0 rounded-r-xl overflow-hidden hidden lg:block">
              <Image
                src="/navbar/bkt_jsc_texture.png"
                width={75}
                height={60}
                alt="lesson"
                className="h-full object-cover"
              />
            </div>

            <motion.div
              className="absolute right-[42% hidden "
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

            {/* <div className="absolute right-[25%] -bottom-6 hidden lg:block">
              <Image
                src="/navbar/banhtet.png"
                width={50}
                height={60}
                alt="lesson"
              />
            </div> */}

            <motion.div className="absolute -right-12 top-0 -rotate-6 hidden lg:block">
              <Image
                src="/navbar/hoadao.png"
                width={50}
                height={60}
                alt="lesson"
              />
            </motion.div>
          </div>

          <motion.div className="absolute right-[11%] -bottom-2 hidden lg:block">
            <Image
              src="/navbar/nguoi1.png"
              width={40}
              height={40}
              alt="lesson"
            />
          </motion.div>

          <div className="absolute right-[6%] -bottom-2 hidden lg:block">
            <Image
              src="/navbar/nguoi2.png"
              width={40}
              height={40}
              alt="lesson"
            />
          </div>

          <div className="absolute right-[1%] -bottom-2 hidden lg:block">
            <Image
              src="/navbar/nguoi3.png"
              width={40}
              height={40}
              alt="lesson"
            />
          </div>

          {/* <motion.div
            className="absolute right-[12%] -top-4 hidden lg:block"
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
            className="absolute right-[2%] -top-4 hidden lg:block"
          >
            <Image
              src="/navbar/phaohoa1.png"
              width={35}
              height={35}
              alt="lesson"
            />
          </motion.div> */}

          <div className="absolute right-[6%] top-0 hidden lg:block">
            <Image
              src="/navbar/hoa_do.png"
              width={25}
              height={25}
              alt="lesson"
            />
          </div>

          <div className="absolute right-[2%] top-[20%] hidden xl:block">
            <Image
              src="/navbar/phaohoa2.png"
              width={40}
              height={40}
              alt="lesson"
            />
          </div>

          <div className="absolute -right-6 top-0 -rotate-12 hidden xl:block">
            <Image
              src="/navbar/phaono.png"
              width={40}
              height={40}
              alt="lesson"
            />
          </div>
        </motion.div>

        <NavbarControls
          t={t}
          onChangeTheme={handleChangeTheme}
          onLogout={handleLogout}
          userId={session?.user.userId}
        />
      </div>
    </motion.header>
  );
}
