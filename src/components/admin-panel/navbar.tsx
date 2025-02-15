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

interface NavbarProps {
  title: string;
  type?: string;
}

type CourseNameMap = {
  [key: string]: string;
};

const courseName: CourseNameMap = {
  "tieng-anh-lop-1": "Tiếng anh lớp 1",
  "tieng-anh-lop-2": "Tiếng anh lớp 2",
  "tieng-anh-lop-3": "Tiếng anh lớp 3",
  "tieng-anh-lop-4": "Tiếng anh lớp 4",
  "tieng-anh-lop-5": "Tiếng anh lớp 5"
};

export function Navbar({ title, type }: NavbarProps) {
  // backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0
  const [lastSlug, setLastSlug] = useState<string | any>("");
  const router = useRouter();

  useEffect(() => {
    const url = window.location.href;
    const parts = url.split("/");
    const slug = parts.pop() || parts.pop();

    setLastSlug(slug);
  }, []);

  const handleBack = () => {
    router.push("/main/khoa-hoc");
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  const floatingVariants = {
    initial: { y: 0 },
    animate: {
      y: [-5, 5, -5],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const rotatingVariants = {
    initial: { rotate: 0 },
    animate: {
      rotate: [0, -10, 10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // const bellVariants = {
  //   initial: { rotate: 0 },
  //   animate: {
  //     rotate: [-15, 15, -15, 15, -15, 0],
  //     transition: {
  //       duration: 2,
  //       repeat: Infinity,
  //       repeatDelay: 1
  //     }
  //   }
  // };

  const fireworkVariants = {
    initial: { scale: 0.8, opacity: 0.5 },
    animate: {
      scale: [0.8, 1.2, 0.8],
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeOut"
      }
    }
  };

  const fishVariants = {
    initial: { x: 0 },
    animate: {
      x: [-10, 10, -10],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  return (
    <motion.header
      className="z-10 w-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-center">
        <SheetMenu />
        <motion.div
          className="w-3/4 max-h-24 h-24 bg-[#f547a4]/50 rounded-bl-md shadow-[0px_4px_6px_0px_rgba(0,0,0,0.25)] border border-[#c9d1c1] relative"
          variants={itemVariants}
        >
          <motion.div
            className="absolute -top-2 -left-4 -rotate-12"
            variants={floatingVariants}
            initial="initial"
            animate="animate"
          >
            <Image src="/navbar/lixi.png" width={40} height={40} alt="lesson" />
          </motion.div>

          <div className="w-3/4 bg-white absolute top-1/2 -translate-y-1/2 left-10  rounded-xl p-4 px-12">
            <div className="w-fit relative">
              <div>
                <span className="text-[#726e6e] text-[21px] font-extrabold tracking-[4.20px]">
                  SMART KID
                </span>
                <span className="text-[#726e6e] text-[21px] font-black tracking-[4.20px]">
                  {" "}
                </span>
                <span className="text-[#c35690] text-[21px] font-black tracking-[4.20px]">
                  2025
                </span>
              </div>
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
            variants={fireworkVariants}
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
            variants={fireworkVariants}
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

        <motion.div className="ml-10 flex gap-5" variants={itemVariants}>
          <motion.div
            className="border-[#61685B] border rounded-md flex items-center bg-white px-2 gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Image
              src="/navbar/vietnam_flag.png"
              width={50}
              height={48}
              alt="vietnam_flag"
            />
            <Switch id="change_language" />
          </motion.div>

          <motion.div
            className="border-[#61685B] border rounded-md flex items-center bg-white px-2 gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Image
              src="/navbar/color.png"
              width={35}
              height={35}
              alt="vietnam_flag"
            />
            <p className="font-bold">Chủ đề</p>
          </motion.div>  
        </motion.div>
       
      </div>
    </motion.header>
  );
}
