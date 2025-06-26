"use client";

import React, { Fragment, useCallback, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { cn, formatProgress, validateImageUrl } from "@/lib/utils";
import { toast } from 'react-toastify';
import { useLessonLike } from "@/hooks/client/useLesson";

interface LessonCardProps {
  classId: number | string;
  unitId: number | string;
  lessonId: number | string;
  schoolWeekId: number | string;
  lessonName: string;
  classRoomName: string;
  unitName: string;
  imageUrl: string;
  schoolWeek: number | string;
  progress: number;
  numLiked: number;
  horizontal?: boolean;
  className?: string;
  onClick?: () => void;
  isLocked: boolean;
  delay?: number;
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

const ProgressIndicator = ({ progress, delay }: { progress: number , delay: number }) => {
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
          "flex items-center gap-2 justify-around",
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

function LessonCard({
  unitName,
  imageUrl,
  schoolWeek,
  classRoomName,
  lessonName,
  progress,
  numLiked,
  horizontal = false,
  className,
  isLocked,
  delay = 0,
  lessonId,
  onClick
}: LessonCardProps) {
  const router = useRouter();
  const {mutate: likeAction } = useLessonLike()

  const handleChooseCourse = useCallback(() => {
    if (isLocked) {
      toast.warning("Hãy hoàn thành bài học trước!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }
    
    if (onClick) {
      onClick();
    }
  }, [isLocked, onClick]);

  const cardClasses = useMemo(() => 
    cn(
      "px-2 sm:px-3 py-3 sm:py-4 bg-white rounded-xl sm:rounded-2xl flex flex-col gap-2 sm:gap-3 shadow-course-inset border relative overflow-hidden transition-all duration-200",
      isLocked ? "opacity-60 cursor-not-allowed bg-[#d9d9d9]" : "cursor-pointer hover:shadow-lg",
      horizontal && "flex-col sm:flex-row gap-3 sm:gap-5",
      className
    ),
    [isLocked, horizontal, className]
  );

  const handleLessonLike = async () => {

    await likeAction({
      lessonId: lessonId,
      action: numLiked === 0 ? "like" : "unlike"
    }, {
      onSuccess: () => {
        router.refresh()
      }
    })
  }

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
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: delay + 0.2 }}
          className="text-base sm:text-lg font-bold line-clamp-2"
        >
          {unitName}
        </motion.h2>

        <motion.div
          variants={ANIMATIONS.imageVariants}
          className="relative w-full aspect-[16/9] border border-gray-200 rounded-xl"
        >
          <Image
            src={validateImageUrl(imageUrl)}
            alt={unitName}
            fill
            className={cn(
              "rounded-xl object-cover",
              isLocked && "opacity-50"
            )}
            unoptimized
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

      <div className={cn("flex flex-col", horizontal === true ? "flex-1" : "")}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.3 }}
          className="text-[#736E6E] text-xs sm:text-sm flex justify-between gap-2"
        >
          <span className="course-week">{`Tuần học ${String(schoolWeek)}`}</span>
          <span className="course-category">{classRoomName}</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + 0.4 }}
          className={cn(
            "text-xl font-bold h-14 line-clamp-2",
            horizontal === true ? "flex-1" : ""
          )}
        >
          {lessonName}
        </motion.h2>

        <div className="flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + 0.5 }}
            className={cn(
              "border-4",
              progress == 0 ? "border-[#333333]/20" : "",
              progress > 0 && progress < 100 ? "border-[#e25762]/50" : "",
              progress == 1 ? "border-[#3EC474]" : "",
              horizontal ? "w-1/3" : "w-2/3",
              "rounded-tr-lg p-1 flex justify-around items-center"
            )}
          >
            <ProgressIndicator progress={Number(formatProgress(progress))} delay={delay} />
            {progress > 0 && progress < 1 && (
              <p className="text-center px-2">{formatProgress(progress)}%</p>
            )}
            {progress === 1 && (
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
            className="flex items-center gap-1"
            onClick={handleLessonLike}
          >
            <Image src="/modal/heart.png" alt="likes" width={28} height={34} />
            <span className="text-sm text-gray-500">{numLiked}</span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default LessonCard;
