"use client";

import React, {
  Fragment,
  useCallback,
  useMemo,
  useState,
  useRef,
  useEffect
} from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { cn, formatProgress, validateImageUrl } from "@/lib/utils";
import { toast } from "react-toastify";
import { useLessonLike } from "@/hooks/client/useLesson";
import PerformanceWrapper from "@/components/common/performance-wrapper";

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

const ProgressIndicator = ({
  progress,
  delay
}: {
  progress: number;
  delay: number;
}) => {
  const flowerCount = Math.ceil(progress / 25);

  return (
    <div
      className={cn(
        "bg-[#db8ab5]/50 rounded-tr-[4px] sm:rounded-tr-md px-1 sm:px-2 py-0.5 sm:py-1 h-full",
        progress === 0 && "bg-[#e25762]"
      )}
    >
      <div
        className={cn(
          "flex items-center gap-1 sm:gap-2 justify-around",
          progress === 0 && "justify-center"
        )}
      >
        {progress === 0 ? (
          <p className="text-center text-white text-[10px] sm:text-xs">
            Chưa học
          </p>
        ) : (
          [...Array(flowerCount)].map((_, index) => (
            <div key={index} className="progress-flower">
              <Image
                src="/flower.png"
                alt="flower"
                width={10}
                height={10}
                className="w-[8px] h-auto sm:w-[10px] md:w-[13px]"
              />
            </div>
          ))
        )}
      </div>
    </div>
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
  const { mutate: likeAction } = useLessonLike();
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
        draggable: true
      });
      return;
    }

    if (onClick) {
      onClick();
    }
  }, [isLocked, onClick]);

  const cardClasses = useMemo(
    () =>
      cn(
        "lesson-card px-1 sm:px-2 md:px-3 py-1.5 sm:py-2 md:py-4 bg-white rounded-lg sm:rounded-xl md:rounded-2xl flex flex-col gap-1 sm:gap-2 md:gap-3 shadow-course-inset border relative overflow-hidden w-full",
        "transition-all duration-300 ease-out",
        isLocked
          ? "opacity-60 cursor-not-allowed bg-[#d9d9d9]"
          : "cursor-pointer hover:shadow-lg",
        horizontal && "flex-col sm:flex-row gap-2 sm:gap-3 md:gap-5",
        isRemoving && "lesson-card-removing pointer-events-none z-10",
        className
      ),
    [isLocked, horizontal, className, isRemoving]
  );

  const handleLessonLike = useCallback(
    async (e: React.MouseEvent) => {
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

        likeAction(
          {
            lessonId: String(lessonId),
            action: willLike ? "like" : "unlike"
          },
          {
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
                  toastId: toastId
                }
              );
            },
            onError: (error) => {
              setIsLiking(false);

              // Revert optimistic update khi có lỗi
              setOptimisticLikeCount(numLiked);

              console.error("Like action failed:", error);

              toast.error("Có lỗi xảy ra khi thực hiện thao tác!", {
                position: "top-right",
                autoClose: 3000,
                toastId: `error-${toastId}`
              });
            }
          }
        );
      } catch (error) {
        setIsLiking(false);

        // Revert optimistic update khi có lỗi
        setOptimisticLikeCount(numLiked);

        console.error("Like action error:", error);

        toast.error("Có lỗi xảy ra khi thực hiện thao tác!", {
          position: "top-right",
          autoClose: 3000,
          toastId: `catch-error-${toastId}`
        });
      }
    },
    [
      likeAction,
      lessonId,
      optimisticLikeCount,
      lessonName,
      router,
      isLiking,
      numLiked,
      onLikeUpdate
    ]
  );

  return (
    <PerformanceWrapper
      variant="lesson-card"
      enableTouch={true}
      className="lesson-card performance-intrinsic-size-lesson"
    >
      <div onClick={handleChooseCourse} className={cardClasses}>
        {/* Removing Effects Overlay */}
        {isRemoving && (
          <>
            {/* Background blur overlay */}
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm rounded-xl z-20" />

            {/* Simple fade out text */}
            <div className="absolute inset-0 flex items-center justify-center text-gray-500 font-medium text-xs z-30">
              <div>Đã bỏ thích</div>
            </div>

            {/* Simple particles */}
            <div className="absolute inset-0 pointer-events-none z-25 overflow-hidden rounded-xl">
              <div className="sparkles-container">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={`sparkle-${i}`}
                    className="sparkle-particle"
                    style={{
                      left: `${20 + i * 10}%`,
                      top: `${30 + (i % 2) * 20}%`
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
                      left: `${50 + i * 5}%`,
                      top: `70%`
                    }}
                  >
                    💔
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <div className="flex flex-col space-y-1">
          <h2 className="text-xs sm:text-sm lg:text-base font-bold line-clamp-1 sm:line-clamp-2">
            {unitName}
          </h2>

          <div className="relative w-full aspect-[16/9] border border-gray-200 rounded-md sm:rounded-lg md:rounded-xl overflow-hidden">
            <Image
              src={validateImageUrl(imageUrl)}
              alt={unitName}
              fill
              className={cn("object-cover", isLocked && "opacity-50")}
              unoptimized
            />

            {isLocked && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src="/assets/image/lock_course.png"
                  alt="locked"
                  width={25}
                  height={25}
                  className="w-[20px] h-[20px] sm:w-[30px] sm:h-[30px] md:w-[35px] md:h-[35px]"
                />
              </div>
            )}
          </div>
        </div>

        <div
          className={cn(
            "flex flex-col",
            horizontal === true ? "flex-1" : "gap-1"
          )}
        >
          <div className="text-[#736E6E] text-[9px]  md:text-[14px] flex justify-between gap-1">
            <span className="course-week truncate">{`Tuần học ${String(
              schoolWeek
            )}`}</span>
            <span className="course-category truncate">{classRoomName}</span>
          </div>

          <h2
            className={cn(
              "text-xs sm:text-sm md:text-base font-bold overflow-hidden",
              "min-h-[2.5em] xs:min-h-[2.7em] sm:min-h-[3em] md:min-h-[2.5em]",
              "line-clamp-1 xs:line-clamp-2 sm:line-clamp-2 md:line-clamp-2",
              horizontal === true ? "flex-1" : ""
            )}
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              lineHeight: "1.25em"
            }}
          >
            {lessonName}
          </h2>

          <div className="flex justify-between items-center">
            <div
              className={cn(
                "border border-gray-200 sm:border-2 md:border-4", // Giảm border size trên mobile
                progress == 0 ? "border-[#333333]/20" : "",
                progress > 0 && progress < 100 ? "border-[#e25762]/50" : "",
                progress == 1 ? "border-[#3EC474]" : "",
                horizontal ? "w-1/3" : "w-2/3",
                "rounded-tr-[4px] sm:rounded-tr-md p-0.5 sm:p-1 flex justify-around items-center"
              )}
            >
              <ProgressIndicator
                progress={Number(formatProgress(progress))}
                delay={delay}
              />
              {progress > 0 && progress < 1 && (
                <p className="text-center px-1 text-[9px] sm:text-xs">
                  {formatProgress(progress)}%
                </p>
              )}
              {progress === 1 && (
                <div className="ml-0.5 sm:ml-1 md:ml-2">
                  <Image
                    src="/check_course.png"
                    alt="check"
                    width={16}
                    height={20}
                    className="w-[12px] h-auto sm:w-[15px] md:w-[18px]"
                  />
                </div>
              )}
            </div>

            <button
              className={cn(
                "like-button relative flex items-center gap-0.5 sm:gap-1 p-1 sm:p-1.5 md:p-2 rounded-lg transition-all duration-300 -m-1 sm:-m-1.5 md:-m-2 group",
                isLiking
                  ? "cursor-not-allowed opacity-50"
                  : "hover:bg-pink-50 active:scale-95",
                optimisticLikeCount > 0 && "like-button-loved"
              )}
              onClick={handleLessonLike}
              type="button"
              disabled={isLiking}
              aria-label={`${
                optimisticLikeCount === 0 ? "Like" : "Unlike"
              } this lesson`}
            >
              {/* Background glow effect */}
              <div
                className={cn(
                  "absolute inset-0 rounded-lg bg-gradient-to-r from-pink-400 to-red-400 opacity-0 blur-sm transition-opacity duration-300",
                  optimisticLikeCount > 0 && "opacity-20"
                )}
              ></div>

              {/* Heart container */}
              <div className="relative w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 flex items-center justify-center">
                {isLiking ? (
                  // Loading animation
                  <div className="relative">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 border-2 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
                    {/* Mini heart */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="absolute text-pink-400 text-[10px]">
                        💖
                      </div>
                    </div>
                  </div>
                ) : (
                  // Heart icon
                  <div className="relative">
                    {/* Main heart */}
                    <div className="relative">
                      {/* SVG Heart */}
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        className={cn(
                          "heart-svg transition-all duration-300",
                          "w-[14px] h-[14px] sm:w-[16px] sm:h-[16px] md:w-[20px] md:h-[20px]", // Responsive size
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
                    </div>

                    {/* Pulse effect khi liked */}
                    {optimisticLikeCount > 0 && (
                      <div className="absolute inset-0 border-2 border-red-400 rounded-full opacity-20" />
                    )}
                  </div>
                )}
              </div>

              {/* Like count */}
              <span
                className={cn(
                  "text-[10px] sm:text-xs md:text-sm font-medium transition-all duration-300", // Responsive text size
                  isLiking
                    ? "text-gray-400"
                    : optimisticLikeCount > 0
                    ? "text-red-500 font-semibold"
                    : "text-gray-500 group-hover:text-red-400"
                )}
              >
                {optimisticLikeCount}
              </span>

              {/* Success animation khi like thành công */}
              {optimisticLikeCount > 0 && (
                <div className="absolute -top-1 -right-1 text-[10px]">✨</div>
              )}
            </button>

            {/* Floating hearts animation khi like thành công */}
            {showLikeAnimation && (
              <div className="floating-hearts absolute inset-0 pointer-events-none overflow-hidden z-10">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={`floating-heart-${i}`}
                    className="heart-particle absolute text-red-500 select-none"
                    style={{
                      left: `${50 + (Math.random() - 0.5) * 40}%`,
                      top: "100%",
                      fontSize: `${6 + Math.random() * 4}px`,
                      filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
                    }}
                  >
                    {["❤️", "💕", "💖", "💝", "💗", "💓", "💞", "💟"][i]}
                  </div>
                ))}

                {/* Additional sparkle effects */}
                {[...Array(5)].map((_, i) => (
                  <div
                    key={`sparkle-${i}`}
                    className="absolute text-yellow-400 select-none"
                    style={{
                      left: `${40 + Math.random() * 20}%`,
                      top: "80%",
                      fontSize: "6px"
                    }}
                  >
                    ✨
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </PerformanceWrapper>
  );
}

export default LessonCard;

// Custom CSS cho like effects và removing animations (animations removed)
const likeButtonStyles = `
  /* Enhanced card hover effects */
  .lesson-card {
    transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
    box-sizing: border-box;
    max-width: 100%;
  }

  .lesson-card:hover .like-button:not(.like-button-loved) .heart-svg {
    filter: drop-shadow(0 0 8px rgba(239, 68, 68, 0.3));
    transform: scale(1.1);
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
  @media (max-width: 640px) {
    .like-button {
      padding: 4px;
      margin: -4px;
    }

    .floating-hearts {
      transform: scale(0.6);
    }

    .lesson-card:hover {
      /* Disable float on mobile */
    }

    .sparkle-particle {
      font-size: 5px;
    }

    .heart-particle {
      font-size: 4px;
    }
  }

  /* Thêm breakpoint cho màn hình siêu nhỏ */
  @media (max-width: 480px) {
    .lesson-card {
      padding: 8px !important;
      border-radius: 6px !important;
    }

    .lesson-card h2 {
      font-size: 11px !important;
      line-height: 14px !important;
      margin-bottom: 1px !important;
    }

    .like-button {
      padding: 3px !important;
      margin: -3px !important;
    }

    /* Fix hiển thị xấu và bị che */
    .lesson-card .course-week,
    .lesson-card .course-category {
      font-size: 8px !important;
    }

    .lesson-card .progress-flower img {
      width: 8px !important;
      height: auto !important;
    }
  }

  /* Breakpoint cụ thể cho màn hình nhỏ nhưng lớn hơn siêu nhỏ */
  @media (min-width: 481px) and (max-width: 640px) {
    .lesson-card {
      padding: 6px !important;
    }
  }

  /* Smooth carousel transitions */
  .course-swiper {
    transition: height 0.3s ease-in-out;
  }

  .swiper-slide {
    transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
    box-sizing: border-box;
  }

  /* Thêm utility class cho màn hình siêu nhỏ */
  @media (min-width: 400px) {
    .xs\\:text-xs {
      font-size: 0.75rem;
      line-height: 1rem;
    }

    .xs\\:text-\\[10px\\] {
      font-size: 10px;
    }
  }

  /* Tối ưu hóa hiển thị cho các loại màn hình */
  .lesson-card {
    width: 100% !important;
    box-sizing: border-box;
    overflow: hidden !important;
  }
`;

// Inject styles
if (typeof document !== "undefined") {
  const styleElement = document.createElement("style");
  styleElement.textContent = likeButtonStyles;
  if (!document.head.querySelector("style[data-like-effects]")) {
    styleElement.setAttribute("data-like-effects", "true");
    document.head.appendChild(styleElement);
  }
}
