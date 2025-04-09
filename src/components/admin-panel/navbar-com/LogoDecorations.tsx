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

      <div
        className="w-full md:w-3/4 bg-white absolute top-1/2 -translate-y-1/2 
          left-0 md:left-10 rounded-xl p-2 sm:p-3 md:p-4 
          px-3 sm:px-6 md:px-8 lg:px-12"
      >
        <div className="w-fit relative">
          <LogoSection />

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
  );
}
