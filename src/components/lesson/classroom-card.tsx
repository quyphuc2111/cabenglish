"use client";

import React, { Fragment, useCallback, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { cn, formatProgress } from "@/lib/utils";

interface ClassroomCardProps {
    class_id: number;
    classname: string;
    description: string;
    numliked: number;
    imageurl: string;
    progress: number;
    order: number;

    className?: string;
    onClick?: () => void;
    isLocked?: boolean;
    delay?: number;
    onLikeClick?: () => void;
    isLiked?: boolean;
}

const ANIMATIONS = {
  cardVariants: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    },
    hover: {
      scale: 1.01,
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.97 }
  },
  imageVariants: {
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 }
    }
  },
  progressVariants: {
    hidden: { width: 0 },
    visible: {
      width: "100%",
      transition: { duration: 0.8, ease: "easeOut" }
    }
  }
} as const;

const ProgressIndicator = ({ progress, delay }: { progress: number, delay: number }) => {
  const flowerCount = Math.ceil(progress / 25);
  
  return (
    <motion.div
      variants={ANIMATIONS.progressVariants}
      initial="hidden"
      animate="visible" 
      className={cn(
        "bg-[#db8ab5]/50 rounded-tr-md px-1 sm:px-2 py-1 h-full",
        progress === 0 && "bg-[#e25762]"
      )}
    >
      <div
        className={cn(
          "flex items-center gap-1 sm:gap-2",
          progress === 0 && "justify-center"
        )}
      >
        {progress === 0 ? (
          <p className="text-center text-white text-xs sm:text-sm">Chưa học</p>
        ) : (
          [...Array(flowerCount)].map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, rotate: -180 }}
              animate={{ opacity: 1, rotate: 0 }}
              transition={{ delay: delay + 0.6 + index * 0.1 }}
            >
              <Image
                src="/flower.png"
                alt="flower"
                width={10}
                height={15}
                className="w-[10px] h-[15px] sm:w-[13px] sm:h-[19px]"
              />
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

function ClassroomCard({
  class_id,
  classname,
  description,
  numliked,
  imageurl,
  progress,
  order,
  className,
  isLocked,
  delay = 0,
  onClick,
  onLikeClick,
  isLiked
}: ClassroomCardProps) {
  const router = useRouter();

  const handleChooseCourse = useCallback(() => {
    if (!isLocked && onClick) {
      onClick();
    }
  }, [isLocked, onClick]);

  const handleLikeClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (onLikeClick) {
      onLikeClick();
    }
  }, [onLikeClick]);

  const cardClasses = useMemo(() => 
    cn(
      "px-2 sm:px-3 py-3 sm:py-4 bg-white rounded-2xl flex flex-col gap-2 sm:gap-3 lg:gap-4 shadow-course-inset border relative overflow-hidden",
      "h-[320px] sm:h-[350px]  lg:h-[420px] xl:h-[450px] 2xl:h-[480px]",
      isLocked ? "opacity-60 cursor-not-allowed bg-[#d9d9d9]" : "cursor-pointer",
      className
    ),
    [isLocked, className]
  );

  return (
    <motion.div
      variants={ANIMATIONS.cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={isLocked ? undefined : "hover"}
      whileTap={isLocked ? undefined : "tap"}
      transition={{ delay }}
      onClick={handleChooseCourse}
      className={cardClasses}
    >
      <div className="flex-shrink-0">
        <motion.div
          variants={ANIMATIONS.imageVariants}
          className="relative w-full aspect-[16/5]  md:aspect-[16/7] lg:aspect-[16/9]"
        >
          <Image
            src={imageurl}
            alt={classname}
            fill
            className={cn(
              "rounded-xl object-cover",
              isLocked && "opacity-50"
            )}
            unoptimized
          />

          {isLocked && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Image 
              src="/assets/image/lock_course.png" 
              alt="locked"
              width={30}
              height={30}
              className="sm:w-[40px] sm:h-[40px]"
            />
          </div>
        )}
        </motion.div>
      </div>

      <div className="flex flex-col flex-grow overflow-hidden">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + 0.4 }}
          className={cn(
            "text-base sm:text-lg md:text-xl font-bold text-[#58B882] line-clamp-2 mb-1",
          )}
        >
          {classname}
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + 0.4 }}
          className="flex-grow overflow-hidden mb-1"
        >
          <p 
            className="text-sm sm:text-base text-gray-600 line-clamp-2 sm:line-clamp-2 md:line-clamp-3 lg:line-clamp-3 overflow-hidden"
            title={description}
          >
            {description}
          </p>
        </motion.div>

        <div className="flex justify-between items-center mt-auto pt-2 flex-shrink-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + 0.5 }}
            className={cn(
              "border-2 sm:border-4",
              progress == 0 ? "border-[#333333]/20" : "",
              progress > 0 && progress < 100 ? "border-[#e25762]/50" : "",
              progress == 100 ? "border-[#3EC474]" : "",
              "rounded-tr-lg p-1 flex justify-around items-center w-1/2"
            )}
          >
            <ProgressIndicator progress={progress} delay={delay} />
            {progress > 0 && progress < 100 && (
              <p className="text-center px-1 sm:px-2 text-xs sm:text-sm">{formatProgress(progress)}%</p>
            )}
            {progress === 100 && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: delay + 0.8 }}
                className="ml-1 sm:ml-2"
              >
                <Image
                  src="/check_course.png"
                  alt="check"
                  width={16}
                  height={20}
                  className="w-[16px] h-[20px] sm:w-[21px] sm:h-[25px]"
                />
              </motion.div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + 0.9 }}
            className={cn("flex items-center gap-1 cursor-pointer")}
            onClick={handleLikeClick}
          >
            <div className="transition-opacity duration-200 hover:opacity-100">
              <Image 
                src={"/modal/heart.png"} 
                alt="likes" 
                width={22}
                height={28}
                className={cn(
                  "transition-opacity duration-200 h-[28px] w-[28px]",
                  !isLiked && "opacity-60"
                )}
              />
            </div>
            <span className={cn(
              "text-xs sm:text-sm transition-colors duration-200",
              isLiked ? "text-gray-500" : "text-gray-400"
            )}>
              {numliked}
            </span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default ClassroomCard;
