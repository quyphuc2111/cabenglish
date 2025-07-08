"use client";

import React, { Fragment, useCallback, useMemo, useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
  onLikeUpdate?: (lessonId: number, newLikeCount: number) => void; 
  isLocked: boolean;
  delay?: number;
  removingLessons?: Set<number>;
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
              className="progress-flower"
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
  onClick,
  onLikeUpdate,
  removingLessons
}: LessonCardProps) {
  const router = useRouter();
  const {mutate: likeAction } = useLessonLike();
  const [isLiking, setIsLiking] = useState(false);
  const lastActionTimeRef = useRef(0);
  
  // State để track optimistic update
  const [optimisticLikeCount, setOptimisticLikeCount] = useState(numLiked);
  const [showLikeAnimation, setShowLikeAnimation] = useState(false);

  // Update optimistic state khi props thay đổi
  useEffect(() => {
    setOptimisticLikeCount(numLiked);
  }, [numLiked]);

  // Check nếu lesson đang trong quá trình removing
  const isRemoving = removingLessons?.has(lessonId as number) || false;

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

  // Simplified animation variants để tránh unit conversion issues
  const cardAnimationVariants = {
    hidden: {
      opacity: 0,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    removing: {
      opacity: 0,
      scale: 0.85,
      transition: {
        duration: 0.8,
        ease: "easeInOut"
      }
    },
    hover: {
      scale: 1.02,
      transition: { 
        duration: 0.3
      }
    },
    tap: { 
      scale: 0.98,
      transition: { duration: 0.1 }
    }
  };

  const cardClasses = useMemo(() => 
    cn(
      "lesson-card px-2 sm:px-3 py-3 sm:py-4 bg-white rounded-xl sm:rounded-2xl flex flex-col gap-2 sm:gap-3 shadow-course-inset border relative overflow-hidden",
      "transition-all duration-300 ease-out",
      isLocked ? "opacity-60 cursor-not-allowed bg-[#d9d9d9]" : "cursor-pointer hover:shadow-lg",
      horizontal && "flex-col sm:flex-row gap-3 sm:gap-5",
      isRemoving && "lesson-card-removing pointer-events-none z-10", // Higher z-index khi removing
      className
    ),
    [isLocked, horizontal, className, isRemoving]
  );

  const handleLessonLike = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    // Debounce để tránh multiple rapid clicks
    const now = Date.now();
    if (now - lastActionTimeRef.current < 1000) {
      return; // Ignore clicks within 1 second
    }
    lastActionTimeRef.current = now;

    // Prevent double clicks
    if (isLiking) {
      return;
    }

    setIsLiking(true);

    const willLike = optimisticLikeCount === 0;
    const toastId = `like-action-${lessonId}-${now}`;
    
    // Optimistic update - cập nhật UI ngay lập tức
    const newLikeCount = willLike ? 1 : 0;
    setOptimisticLikeCount(newLikeCount);
    
    // Trigger like animation
    if (willLike) {
      setShowLikeAnimation(true);
      setTimeout(() => setShowLikeAnimation(false), 2000);
    }
    
    try {
      // Dismiss any existing toasts first
      toast.dismiss();

      likeAction({
        lessonId: String(lessonId),
        action: willLike ? "like" : "unlike"
      }, {
        onSuccess: () => {
          setIsLiking(false);
          
          // Gọi callback để update parent state
          if (onLikeUpdate) {
            onLikeUpdate(lessonId as number, newLikeCount);
          }
          
          // Show success toast
          toast.success(
            willLike 
              ? `Đã thích bài học "${lessonName}"! 💖` 
              : `Đã bỏ thích bài học "${lessonName}"`, 
            {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: true,
              toastId: toastId,
            }
          );
          
          // Sử dụng callback mechanism thay vì router.refresh() để mượt hơn
          // setTimeout(() => {
          //   router.refresh();
          // }, 500);
        },
        onError: (error) => {
          setIsLiking(false);
          
          // Revert optimistic update khi có lỗi
          setOptimisticLikeCount(numLiked);
          
          console.error('Like action failed:', error);
          
          toast.error("Có lỗi xảy ra khi thực hiện thao tác!", {
            position: "top-right",
            autoClose: 3000,
            toastId: `error-${toastId}`,
          });
        }
      });
    } catch (error) {
      setIsLiking(false);
      
      // Revert optimistic update khi có lỗi
      setOptimisticLikeCount(numLiked);
      
      console.error('Like action error:', error);
      
      toast.error("Có lỗi xảy ra khi thực hiện thao tác!", {
        position: "top-right",
        autoClose: 3000,
        toastId: `catch-error-${toastId}`,
      });
    }
  }, [likeAction, lessonId, optimisticLikeCount, lessonName, router, isLiking, numLiked, onLikeUpdate]);

  return (
    <motion.div
      variants={cardAnimationVariants}
      initial="hidden"
      animate={isRemoving ? "removing" : "visible"}
      whileHover={isLocked || isRemoving ? undefined : "hover"}
      whileTap={isLocked || isRemoving ? undefined : "tap"}
      transition={{ delay: isRemoving ? 0 : delay }} 
      onClick={handleChooseCourse}
      className={cardClasses}
    >
      {/* Removing Effects Overlay */}
      <AnimatePresence>
        {isRemoving && (
          <>
            {/* Background blur overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/60 backdrop-blur-sm rounded-xl z-20"
              transition={{ duration: 0.3 }}
            />
            
            {/* Simple fade out text - CSS animation */}
            <div className="absolute inset-0 flex items-center justify-center text-gray-500 font-medium text-sm z-30">
              <div className="removing-text-animation">
                Đã bỏ thích
              </div>
            </div>
            
            {/* Simple particles - CSS animation */}
            <div className="absolute inset-0 pointer-events-none z-25 overflow-hidden rounded-xl">
              <div className="sparkles-container">
                {[...Array(8)].map((_, i) => (
                  <div 
                    key={`sparkle-${i}`}
                    className="sparkle-particle"
                    style={{
                      left: `${20 + (i * 10)}%`,
                      top: `${30 + (i % 2) * 20}%`,
                      animationDelay: `${i * 0.1}s`
                    }}
                  >
                    ✨
                  </div>
                ))}
              </div>
              
              <div className="hearts-container">
                {[...Array(4)].map((_, i) => (
                  <div 
                    key={`heart-${i}`}
                    className="heart-particle"
                    style={{
                      left: `${50 + (i * 5)}%`,
                      top: `70%`,
                      animationDelay: `${0.2 + i * 0.1}s`
                    }}
                  >
                    💔
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </AnimatePresence>

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

          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + 0.9 }}
            className={cn(
              "like-button relative flex items-center gap-1 p-2 rounded-lg transition-all duration-300 -m-2 group ",
              isLiking 
                ? "cursor-not-allowed opacity-50" 
                : "hover:bg-pink-50 active:scale-95",
              optimisticLikeCount > 0 && "like-button-loved"
            )}
            onClick={handleLessonLike}
            type="button"
            disabled={isLiking}
            aria-label={`${optimisticLikeCount === 0 ? 'Like' : 'Unlike'} this lesson`}
            whileHover={!isLiking ? { scale: 1.05 } : {}}
            whileTap={!isLiking ? { scale: 0.95 } : {}}
          >
            {/* Background glow effect */}
            <div className={cn(
              "absolute inset-0 rounded-lg bg-gradient-to-r from-pink-400 to-red-400 opacity-0 blur-sm transition-opacity duration-300",
              optimisticLikeCount > 0 && "opacity-20"
            )}></div>
            
            {/* Heart container */}
            <div className="relative w-7 h-8 flex items-center justify-center">
              {isLiking ? (
                // Loading animation với floating hearts
                <div className="relative">
                  <div className="w-6 h-6 border-2 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
                  {/* Floating mini hearts */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      animate={{ 
                        y: [-2, -8, -2],
                        opacity: [0.5, 1, 0.5],
                        scale: [0.8, 1, 0.8]
                      }}
                      transition={{ 
                        duration: 1.5, 
                        repeat: Infinity,
                        delay: 0 
                      }}
                      className="absolute text-pink-400 text-xs"
                    >
                      💖
                    </motion.div>
                  </div>
                </div>
              ) : (
                // Heart icon with animations
                <div className="relative">
                  {/* Main heart */}
                  <motion.div
                    animate={optimisticLikeCount > 0 ? {
                      scale: [1, 1.2, 1],
                    } : {}}
                    transition={{ duration: 0.6 }}
                    className="relative"
                  >
                    {/* SVG Heart thay vì Image */}
                                         <svg
                       width="24"
                       height="24"
                       viewBox="0 0 24 24"
                       className={cn(
                         "heart-svg transition-all duration-300",
                         optimisticLikeCount > 0 
                           ? "fill-red-500 text-red-500 drop-shadow-lg" 
                           : "fill-none text-gray-400 hover:text-red-400 hover:fill-red-100"
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
                  </motion.div>

                  {/* Pulse effect khi liked */}
                  {optimisticLikeCount > 0 && (
                    <motion.div
                      initial={{ scale: 0, opacity: 1 }}
                      animate={{ scale: 2, opacity: 0 }}
                      transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 2 }}
                      className="absolute inset-0 border-2 border-red-400 rounded-full"
                    />
                  )}

                  {/* Floating particles khi hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{
                          y: [0, -12, -20],
                          opacity: [0, 1, 0],
                          scale: [0.5, 1, 0.5],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                        className="absolute text-xs"
                        style={{
                          left: `${20 + i * 15}%`,
                          top: '50%',
                        }}
                      >
                        {['❤️', '💕', '💖'][i]}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Like count với animation */}
            <motion.span
              key={optimisticLikeCount} // Key để trigger animation khi count thay đổi
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 0.3 }}
              className={cn(
                "text-sm font-medium transition-all duration-300",
                isLiking 
                  ? "text-gray-400" 
                  : optimisticLikeCount > 0 
                    ? "text-red-500 font-semibold" 
                    : "text-gray-500 group-hover:text-red-400"
              )}
            >
              {optimisticLikeCount}
            </motion.span>

            {/* Success animation khi like thành công */}
            {optimisticLikeCount > 0 && (
              <motion.div
                initial={{ scale: 0, rotate: 0 }}
                animate={{ scale: [0, 1.5, 0], rotate: [0, 180, 360] }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="absolute -top-2 -right-2 text-xs"
              >
                ✨
              </motion.div>
            )}
          </motion.button>

          {/* Floating hearts animation khi like thành công */}
          {showLikeAnimation && (
            <div className="floating-hearts absolute inset-0 pointer-events-none overflow-hidden z-10">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={`floating-heart-${i}`}
                  initial={{ 
                    x: `${50 + (Math.random() - 0.5) * 40}%`,
                    y: '100%',
                    scale: 0,
                    opacity: 0,
                    rotate: 0
                  }}
                  animate={{ 
                    y: '-30%',
                    scale: [0, 1.5, 0.7, 0],
                    opacity: [0, 1, 0.8, 0],
                    rotate: [0, 180, 360],
                    x: `${50 + (Math.random() - 0.5) * 100}%`
                  }}
                  transition={{ 
                    duration: 2.5,
                    delay: i * 0.15,
                    ease: [0.4, 0.0, 0.2, 1]
                  }}
                  className="heart-particle absolute text-red-500 select-none"
                  style={{
                    fontSize: `${10 + Math.random() * 6}px`,
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                  }}
                >
                  {['❤️', '💕', '💖', '💝', '💗', '💓', '💞', '💟'][i]}
                </motion.div>
              ))}
              
              {/* Additional sparkle effects */}
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={`sparkle-${i}`}
                  initial={{ 
                    x: `${40 + Math.random() * 20}%`,
                    y: '80%',
                    scale: 0,
                    opacity: 0
                  }}
                  animate={{ 
                    y: '-10%',
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                    rotate: 360
                  }}
                  transition={{ 
                    duration: 1.5,
                    delay: 0.5 + i * 0.1,
                    ease: "easeOut"
                  }}
                  className="absolute text-yellow-400 select-none"
                  style={{
                    fontSize: '10px',
                  }}
                >
                  ✨
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default LessonCard;

// Custom CSS cho like effects và removing animations
const likeButtonStyles = `
  @keyframes heartBeat {
    0% { transform: scale(1); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
  }

  @keyframes floatingHeart {
    0% { 
      transform: translateY(0) scale(0) rotate(0deg);
      opacity: 0;
    }
    20% { 
      opacity: 1;
      transform: translateY(-10px) scale(1) rotate(72deg);
    }
    100% { 
      transform: translateY(-50px) scale(0.5) rotate(360deg);
      opacity: 0;
    }
  }

  @keyframes pulseGlow {
    0%, 100% { 
      box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4);
    }
    50% { 
      box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
    }
  }

  @keyframes gentleFloat {
    0%, 100% { 
      transform: translateY(0) scale(1);
    }
    50% { 
      transform: translateY(-5px) scale(1.01);
    }
  }

  /* Removing state animations */
  @keyframes sparkleFloat {
    0% {
      opacity: 0;
      transform: scale(0) rotate(0deg) translateY(0);
    }
    20% {
      opacity: 1;
      transform: scale(1) rotate(180deg) translateY(-10px);
    }
    100% {
      opacity: 0;
      transform: scale(0.5) rotate(360deg) translateY(-40px);
    }
  }

  @keyframes heartFly {
    0% {
      opacity: 1;
      transform: scale(1) rotate(0deg) translateY(0);
    }
    50% {
      opacity: 0.8;
      transform: scale(0.8) rotate(180deg) translateY(-20px);
    }
    100% {
      opacity: 0;
      transform: scale(0.3) rotate(360deg) translateY(-60px);
    }
  }

  @keyframes removingText {
    0% {
      opacity: 0;
      transform: scale(0.8) translateY(10px);
    }
    30% {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
    70% {
      opacity: 1;
      transform: scale(1.05) translateY(0);
    }
    100% {
      opacity: 0;
      transform: scale(1.1) translateY(-20px);
    }
  }

  .removing-text-animation {
    animation: removingText 1.5s ease-out forwards;
  }

  .sparkle-particle {
    position: absolute;
    font-size: 10px;
    color: #fbbf24;
    animation: sparkleFloat 1.5s ease-out forwards;
    pointer-events: none;
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
  }

  .heart-particle {
    position: absolute;
    font-size: 8px;
    animation: heartFly 1.2s ease-out forwards;
    pointer-events: none;
    filter: drop-shadow(0 1px 2px rgba(0,0,0,0.1));
  }

  .like-button-loved {
    animation: heartBeat 0.6s ease-in-out;
  }

  .like-button-loved::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 8px;
    animation: pulseGlow 2s infinite;
  }

  /* Particle system for hearts */
  .heart-particle {
    animation: floatingHeart 2s ease-out forwards;
  }

  /* Enhanced card hover effects */
  .lesson-card {
    transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
  }

  .lesson-card:hover {
    animation: gentleFloat 2s ease-in-out infinite;
  }

  .lesson-card:hover .like-button:not(.like-button-loved) .heart-svg {
    filter: drop-shadow(0 0 8px rgba(239, 68, 68, 0.3));
    transform: scale(1.1);
  }

  /* Removing state effects */
  .lesson-card-removing {
    animation: fadeOutUp 0.8s cubic-bezier(0.4, 0.0, 0.2, 1) forwards;
    filter: blur(1px);
  }

  @keyframes fadeOutUp {
    0% {
      opacity: 1;
      transform: translateY(0) scale(1) rotateX(0deg);
      filter: blur(0px);
    }
    50% {
      opacity: 0.7;
      transform: translateY(-15px) scale(0.95) rotateX(-5deg);
      filter: blur(0.5px);
    }
    100% {
      opacity: 0;
      transform: translateY(-30px) scale(0.85) rotateX(-15deg);
      filter: blur(2px);
    }
  }

  /* Progress indicator enhancement */
  .progress-flower {
    transition: all 0.3s ease;
  }

  .progress-flower:hover {
    transform: scale(1.1) rotate(10deg);
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
  }

  /* Mobile optimizations */
  @media (max-width: 768px) {
    .like-button {
      padding: 8px;
      margin: -8px;
    }
    
    .floating-hearts {
      transform: scale(0.8);
    }

    .lesson-card:hover {
      animation: none; /* Disable float on mobile */
    }

    .sparkle-particle {
      font-size: 8px;
    }

    .heart-particle {
      font-size: 6px;
    }
  }

  /* Smooth carousel transitions */
  .course-swiper {
    transition: height 0.3s ease-in-out;
  }

  .swiper-slide {
    transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = likeButtonStyles;
  if (!document.head.querySelector('style[data-like-effects]')) {
    styleElement.setAttribute('data-like-effects', 'true');
    document.head.appendChild(styleElement);
  }
}
