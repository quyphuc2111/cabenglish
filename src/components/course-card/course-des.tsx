"use client"

import React, { Fragment } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CourseCardProps {
  courseImage: string;
  courseName: string;
  courseDescription: string;
  courseProgress: number;
  courseLike: number;
  className?: string;
  delay?: number;
  disabled?: boolean;
  courseStatus: "not_started" | "started" | "completed";
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

function CourseDesCard({
  courseImage,
  courseName,
  courseProgress,
  courseLike,
  courseDescription,
  className,
  delay = 0,
  disabled = false,
  courseStatus,
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
        "relative overflow-hidden rounded-2xl bg-white p-4 shadow-course-inset border",
        courseStatus === "not_started" ? "opacity-60 cursor-not-allowed bg-[#d9d9d9]" : "cursor-pointer",
        className
      )}
    >
      <motion.div
        variants={imageVariants}
        className="relative aspect-video w-full overflow-hidden rounded-xl"
      >
        <Image
          src={courseImage}
          alt={courseName}
          fill
          className={cn(
            "object-cover transition-all duration-300",
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
              className="animate-pulse"
            />
          </div>
        )}
      </motion.div>

      <div className="mt-4 space-y-3">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + 0.4 }}
          className="text-xl font-bold text-gray-800"
        >
          {courseName}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + 0.4 }}
          className="text-base text-gray-600 line-clamp-10"
        >
          {courseDescription}
        </motion.p>

        <div className="flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + 0.5 }}
            className="flex w-1/2 items-center rounded-tr-lg border-4 border-[#3EC474] p-2"
          >
            <motion.div 
              variants={progressVariants}
              initial="hidden"
              animate="visible"
              className="w-2/3 rounded-tr-md bg-[#db8ab5]/50 px-2 py-1"
            >
              {courseStatus === "started" ? (
                <div className="flex items-center justify-between">
                  {[...Array(getFlowerCount(courseProgress))].map((_, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, rotate: -180 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      transition={{ delay: delay + 0.6 + index * 0.1 }}
                    >
                      <Image 
                        src="/flower.png" 
                        alt="flower" 
                        width={11} 
                        height={17}
                        className="transform hover:scale-110 transition-transform" 
                      />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-white font-medium">Chưa học</p>
              )}
            </motion.div>

            {courseProgress === 100 && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: delay + 0.8 }}
                className="ml-2"
              >
                <Image 
                  src="/check_course.png" 
                  alt="check" 
                  width={21} 
                  height={25}
                  
                />
              </motion.div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + 0.9 }}
            className="flex items-center gap-2"
          >
            <Image 
              src="/modal/heart.png" 
              alt="likes" 
              width={28} 
              height={34}
              className="transform hover:scale-110 transition-transform" 
            />
            <span className="text-sm font-medium text-gray-500">{courseLike}</span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default CourseDesCard;
