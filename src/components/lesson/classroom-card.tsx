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
        "bg-[#db8ab5]/50 rounded-tr-md px-2 py-1 h-full",
        progress === 0 && "bg-[#e25762]"
      )}
    >
      <div
        className={cn(
          "flex items-center gap-2",
          progress === 0 && "justify-center"
        )}
      >
        {progress === 0 ? (
          <p className="text-center text-white">Chưa học</p>
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
                width={13}
                height={19}
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
      "px-3 py-4 bg-white rounded-2xl flex flex-col gap-2 shadow-course-inset border relative overflow-hidden h-[400px]",
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
      <div>

        <motion.div
          variants={ANIMATIONS.imageVariants}
          className="relative w-full aspect-[16/9]"
        >
          <Image
            src={`/modal/course1.png`}
            alt={classname}
            fill
            className={cn(
              "rounded-xl object-cover",
              isLocked && "opacity-50"
            )}
          />

          {isLocked  && (
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

      <div className={cn("flex flex-col gap-3 flex-grow")}>
      <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + 0.4 }}
          className={cn(
            "text-xl font-bold text-[#58B882]",
          )}
        >
          {classname}
        </motion.h2>
      <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + 0.4 }}
          className="text-base text-gray-600 line-clamp-3 flex-grow"
          title={description}
        >
          {description}
        </motion.p>

       

        <div className="flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + 0.5 }}
            className={cn(
              "border-4",
              progress == 0 ? "border-[#333333]/20" : "",
              progress > 0 && progress < 100 ? "border-[#e25762]/50" : "",
              progress == 100 ? "border-[#3EC474]" : "",
              "rounded-tr-lg p-1 flex justify-around items-center w-1/2"
            )}
          >
            <ProgressIndicator progress={progress} delay={delay} />
            {progress > 0 && progress < 100 && (
              <p className="text-center px-2">{formatProgress(progress)}%</p>
            )}
            {progress === 100 && (
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
            className={cn("flex items-center gap-1 cursor-pointer")}
            onClick={handleLikeClick}
          >
            <div className="transition-opacity duration-200 hover:opacity-100">
              <Image 
                src={"/modal/heart.png"} 
                alt="likes" 
                width={28} 
                height={34}
                className={cn(
                  "transition-opacity duration-200",
                  !isLiked && "opacity-60"
                )}
              />
            </div>
            <span className={cn(
              "text-sm transition-colors duration-200",
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
