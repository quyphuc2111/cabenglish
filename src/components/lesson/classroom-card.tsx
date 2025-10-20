"use client";

import React, { Fragment, useCallback, useMemo, useState } from "react";
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

// Format number for display (10000 -> 10k, 1500 -> 1.5k)
const formatLikeCount = (count: number): string => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
  }
  if (count >= 10000) {
    return `${(count / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  }
  return count.toString();
};

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
  const [floatingHearts, setFloatingHearts] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const handleChooseCourse = useCallback(() => {
    if (!isLocked && onClick) {
      onClick();
    }
  }, [isLocked, onClick]);

  const handleLikeClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    // Tạo floating heart tại vị trí click
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const heartId = Date.now() + Math.random();
    
    setFloatingHearts(prev => [...prev, { id: heartId, x, y }]);
    
    // Xóa heart sau animation (1s)
    setTimeout(() => {
      setFloatingHearts(prev => prev.filter(h => h.id !== heartId));
    }, 1000);

    // Gọi callback để update like
    if (onLikeClick) {
      onLikeClick();
    }
  }, [onLikeClick]);

  const cardClasses = useMemo(() => 
    cn(
      "px-2 sm:px-3 py-3 sm:py-4 bg-white rounded-2xl flex flex-col gap-2 sm:gap-3 lg:gap-4 shadow-course-inset border relative",
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

      <div className="flex flex-col flex-grow">
        <div className="overflow-hidden flex-grow">
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
            className="mb-1"
          >
            <p 
              className="text-sm sm:text-base text-gray-600 line-clamp-2 sm:line-clamp-2 md:line-clamp-3 lg:line-clamp-3"
              title={description}
            >
              {description}
            </p>
          </motion.div>
        </div>

        <div className="flex justify-between items-center mt-auto pt-2 flex-shrink-0 relative z-10">
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

          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + 0.9 }}
            className={cn(
              "classroom-like-button relative flex items-center gap-1 sm:gap-1.5 p-1.5 sm:p-2 rounded-lg group overflow-visible hover:bg-pink-50 cursor-pointer"
            )}
            onClick={handleLikeClick}
            type="button"
            aria-label="Like this classroom"
            title={`${numliked.toLocaleString()} lượt thích`}
          >
            {/* Floating Hearts Container */}
            {floatingHearts.map(heart => (
              <div
                key={heart.id}
                className="floating-heart absolute pointer-events-none"
                style={{
                  left: `${heart.x}px`,
                  top: `${heart.y}px`,
                  width: '28px',
                  height: '28px'
                }}
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  className="fill-red-500 text-red-500 drop-shadow-lg"
                >
                  <path
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                  />
                </svg>
              </div>
            ))}

            {/* Background glow effect */}
            <div
              className={cn(
                "absolute inset-0 rounded-lg bg-gradient-to-r from-pink-400 to-red-400 opacity-0 blur-sm",
                numliked > 0 && "opacity-20"
              )}
            ></div>

            {/* Heart icon */}
            <div className="relative w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className={cn(
                  "heart-svg w-[20px] h-[20px] sm:w-[24px] sm:h-[24px]",
                  numliked > 0
                    ? "fill-red-500 text-red-500 drop-shadow-lg"
                    : "fill-none text-gray-400 group-hover:text-red-400 group-hover:fill-red-100"
                )}
              >
                <path
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                />
              </svg>
              
              {/* Pulse effect khi có like */}
              {numliked > 0 && (
                <div className="absolute inset-0 border-red-400 rounded-full opacity-20" />
              )}
            </div>

            {/* Like count */}
            <span
              className={cn(
                "text-xs sm:text-sm font-medium",
                numliked > 0
                  ? "text-red-500 font-semibold"
                  : "text-gray-500 group-hover:text-red-400"
              )}
            >
              {formatLikeCount(numliked)}
            </span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default ClassroomCard;

// CSS cho floating heart animation
const classroomCardStyles = `
  /* Floating heart animation - FORCE ENABLE for performance-mode */
  @keyframes floatUp {
    0% {
      opacity: 1;
      transform: translateY(0) rotate(0deg) scale(1);
    }
    50% {
      opacity: 1;
      transform: translateY(-40px) rotate(15deg) scale(1.2);
    }
    100% {
      opacity: 0;
      transform: translateY(-80px) rotate(-15deg) scale(0.8);
    }
  }

  /* Override performance-mode for floating hearts */
  .floating-heart {
    z-index: 9999;
    user-select: none;
    filter: drop-shadow(0 4px 12px rgba(255, 105, 180, 0.7));
    pointer-events: none;
    animation: floatUp 1s ease-out forwards !important;
    transition: none !important;
    will-change: transform, opacity;
  }
  
  /* Force animation to work even in performance-mode */
  .performance-mode .floating-heart {
    animation: floatUp 1s ease-out forwards !important;
  }

  /* Classroom like button */
  .classroom-like-button {
    position: relative;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    transition: all 0.2s ease;
  }

  .classroom-like-button:not(:disabled):active {
    transform: scale(0.95);
  }

  .classroom-like-button:disabled {
    cursor: not-allowed;
  }

  /* Heart SVG animation */
  .heart-svg {
    transition: all 0.2s ease;
  }

  .classroom-like-button:not(:disabled):hover .heart-svg {
    transform: scale(1.1);
  }

  /* Mobile optimizations */
  @media (max-width: 640px) {
    .classroom-like-button {
      padding: 6px;
    }
    
    .floating-heart {
      width: 24px !important;
      height: 24px !important;
    }
  }
`;

// Inject styles
if (typeof document !== "undefined") {
  const styleElement = document.createElement("style");
  styleElement.textContent = classroomCardStyles;
  if (!document.head.querySelector("style[data-classroom-effects]")) {
    styleElement.setAttribute("data-classroom-effects", "true");
    document.head.appendChild(styleElement);
  }
}
