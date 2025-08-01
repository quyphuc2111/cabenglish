"use client";

import React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import BackIcon from "@/components/icon/back-icon";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ScrollArea } from "../ui/scroll-area";

interface ClassroomWrapperProps {
  children: React.ReactNode;
  className?: string;
}

const containerVariants = {
  hidden: {
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.2
    }
  }
};

const backButtonVariants = {
  hidden: {
    x: -20,
    opacity: 0
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.3
    }
  }
};

const contentVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4
    }
  }
};

const starVariants = {
  hidden: {
    scale: 0,
    rotate: -180
  },
  visible: (i: number) => ({
    scale: 1,
    rotate: 0,
    transition: {
      delay: i * 0.2,
      type: "spring",
      stiffness: 260,
      damping: 20
    }
  }),
  hover: {
    scale: 1.2,
    rotate: 15,
    transition: {
      duration: 0.3
    }
  }
};

function ClassroomWrapper(props: ClassroomWrapperProps) {
  const { children, className } = props;
  const router = useRouter();

  return (
  
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={backButtonVariants}
          className="flex items-center gap-3 cursor-pointer group w-fit"
          onClick={() => router.push("/lop-hoc")}
          whileHover={{
            x: 5,
            transition: { duration: 0.2 }
          }}
          whileTap={{
            scale: 0.95,
            transition: { duration: 0.2 }
          }}
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            <BackIcon width={30} height={30} />
          </motion.div>
          <p className="text-xl font-semibold text-[#555] group-hover:text-[#4079CE] transition-colors duration-200">
            Quay lại
          </p>
        </motion.div>

        <motion.div
          variants={contentVariants}
          className={cn(
            "bg-white px-3 lg:px-7 py-3 lg:py-5 my-4 relative ",
            className
          )}
          {...props}
        >
          <div className=" gap-10 absolute top-0 right-[1vw] hidden lg:flex">
            {[0, 1].map((i) => (
              <motion.div
                key={i}
                variants={starVariants}
                custom={i}
                whileHover="hover"
                className="w-8 h-8 lg:w-12 lg:h-12"
              >
                <Image
                  src="/assets/image/star.png"
                  alt="favourite"
                  width={50}
                  height={50}
                />
              </motion.div>
            ))}
          </div>
         
          {children}
        </motion.div>
      </motion.div>
  );
}

export default ClassroomWrapper;
