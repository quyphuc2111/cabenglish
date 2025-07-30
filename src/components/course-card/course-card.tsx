"use client"

import React, { Fragment } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CourseCardProps {
  courseTitle: string;
  courseImage: string;
  courseWeek: string;
  courseCategory: string;
  courseName: string;
  courseProgress: number;
  courseLike: number;
  className?: string;
  delay?: number;
  disabled?: boolean;
  courseStatus: string;
  horizontal?: boolean;
  onClick?: () => void;
}

const cardVariants = {
  hidden: { 
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  },
  hover: {
    scale: 1.01,
    transition: {
      duration: 0.2
    }
  },
  tap: {
    scale: 0.97
  }
};

const imageVariants = {
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.2
    }
  }
};

const progressVariants = {
  hidden: { width: 0 },
  visible: { 
    width: "100%",
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

function CourseCard({
  courseTitle,
  courseImage,
  courseWeek,
  courseCategory,
  courseName,
  courseProgress,
  courseLike,
  className,
  delay = 0,
  disabled = false,
  courseStatus,
  horizontal = false,
  onClick
}: CourseCardProps) {
  const router = useRouter();

  const handleChooseCourse = () => {
    if (onClick) {
      onClick();
    } else if (!disabled && courseStatus !== "not_started") {
      // router.push(`/main/khoa-hoc/${courseName}`);
    }
  };

  const getFlowerCount = (progress: number) => {
    return Math.ceil(progress / 25);
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={disabled ? undefined : "hover"}
      whileTap={disabled ? undefined : "tap"}
      transition={{ delay }}
      onClick={handleChooseCourse}
      className={cn(
        "px-3 py-4 bg-white rounded-2xl flex flex-col gap-2 shadow-course-inset border relative overflow-hidden",
        courseStatus === "not_started" ? "opacity-60 cursor-not-allowed bg-[#d9d9d9]" : "cursor-pointer",
        horizontal === true ? "flex-row gap-5" : "",
        className
      )}
    >
     <div>
     <motion.h2 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: delay + 0.2 }}
        className={`text-lg font-bold `}
      > 
        {courseTitle}
      </motion.h2>

      <motion.div
        variants={imageVariants}
        className="relative w-full aspect-[16/9]"
      >
        <Image
          src={courseImage}
          alt={courseTitle}
          unoptimized
          fill
          className={cn(
            "rounded-xl object-cover",
            courseStatus === "not_started" && "opacity-50"
          )}
        />
        
        {courseStatus === "not_started" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Image 
              src="/assets/image/lock_course.png" 
              alt="locked"
              width={40}
              height={40}
            />
          </div>
        )}
      </motion.div>
     </div>

    <div className={cn("flex flex-col", horizontal === true ? "flex-1" : "")}>
    <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.3 }}
        className="text-[#736E6E] text-sm flex justify-between"
      >
        <span className="course-week">{courseWeek}</span>
        <span className="course-category">{courseCategory}</span>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delay + 0.4 }}
        className={cn("text-xl font-bold", horizontal === true ? "flex-1" : "")}
      >
        {courseName}
      </motion.h2>

      <div className="flex justify-between items-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: delay + 0.5 }}
          className={`border-4 ${courseStatus == "not_started" ? "border-[#333333]/20" : "border-[#3EC474]"}  ${horizontal ? 'w-1/3' : 'w-2/3'} rounded-tr-lg p-1 flex justify-around items-center`}
        >
          <motion.div 
            variants={progressVariants}
            initial="hidden"
            animate="visible"
            className="bg-[#db8ab5]/50 rounded-tr-md px-2 py-1 w-2/3"
          >
           {
            courseStatus === "started" ? (
              <div className="flex items-center justify-between">
              {[...Array(getFlowerCount(courseProgress))].map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, rotate: -180 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  transition={{ delay: delay + 0.6 + index * 0.1 }}
                >
                  <Image src="/flower.png" alt="flower" width={11} height={17} />
                </motion.div>
              ))}
            </div>
            ) : (
              <p className="text-center text-white">Chưa học</p>
            )
           }
          </motion.div>
        {
          courseProgress === 100 && courseStatus !== "not_started" && (
            <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + 0.8 }}
            className="ml-2"
          >
            <Image src="/check_course.png" alt="check" width={21} height={25} />
          </motion.div>
          )
        }
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: delay + 0.9 }}
          className="flex items-center gap-1"
        >
          <Image src="/modal/heart.png" alt="likes" width={28} height={34} />
          <span className="text-sm text-gray-500">{courseLike}</span>
        </motion.div>
      </div>
    </div>
    </motion.div>
  );
}

export default CourseCard;
