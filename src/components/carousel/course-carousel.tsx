"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useRouter } from "next/navigation";
import { VirtualizedCarousel } from "./virtualized-carousel";

// Lazy loading component
const LazyLessonCard = React.lazy(() => import("../lesson/lesson-card"));

interface CourseCarouselProps {
  courseData: any[];
  className?: string;
  onLikeUpdate?: (lessonId: number, newLikeCount: number) => void;
  removingLessons?: Set<number>;
  onLessonClick?: (lessonId: number) => void;
  classroomData?: any[];
  containerType?: "current" | "next"; // Để phân biệt container type
}

export function CourseCarousel({
  courseData,
  className,
  onLikeUpdate,
  removingLessons,
  onLessonClick,
  classroomData,
  containerType = "next"
}: CourseCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(1);
  const [visibleItems, setVisibleItems] = useState(courseData);
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // Thêm breakpoint cho màn hình siêu nhỏ (mobile nhỏ)
  const isExtraSmall = useMediaQuery("(max-width: 480px)");
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isSmallTablet = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");
  const isLargeScreen = useMediaQuery("(min-width: 1536px)");
  const router = useRouter();

  // Memoize slidesPerView calculation based on container type
  const slidesPerView = useMemo(() => {
    if (isExtraSmall) return 1.5;
    if (isMobile) return 2.5;
    if (isSmallTablet) return 2.5;
    if (isTablet) return 2.5;

    // Điều chỉnh slidesPerView cho desktop dựa trên container type
    if (containerType === "current") {
      // CurrentLecture có container nhỏ hơn (lg:w-4/12), hiển thị ít slides hơn
      if (isLargeScreen) return 2;
      return 1.5;
    } else {
      // NextLecture có container lớn hơn (lg:w-8/12), hiển thị nhiều slides hơn
      if (isLargeScreen) return 3;
      return 2.5;
    }
  }, [
    isExtraSmall,
    isMobile,
    isSmallTablet,
    isTablet,
    isLargeScreen,
    containerType
  ]);

  // Render item function for VirtualizedCarousel
  const renderLessonCard = useCallback(
    (course: any, index: number) => {
      const customCourse = {
        ...course,
        classRoomName: course.className
      };

      return (
        <React.Suspense
          fallback={
            <div className="h-48 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
              <div className="text-gray-400 text-sm">Đang tải...</div>
            </div>
          }
        >
          <LazyLessonCard
            {...customCourse}
            onClick={() =>
              onLessonClick
                ? onLessonClick(customCourse.lessonId)
                : router.push(`/lesson/${customCourse.lessonId}`)
            }
            onLikeUpdate={onLikeUpdate}
            removingLessons={removingLessons}
            delay={0}
          />
        </React.Suspense>
      );
    },
    [onLessonClick, onLikeUpdate, removingLessons, router]
  );

  // Điều chỉnh spaceBetween cho từng kích thước màn hình
  const spaceBetween = useMemo(() => {
    if (isExtraSmall) return 6;
    if (isMobile) return 8;
    if (isSmallTablet) return 12;
    if (isTablet) return 16;
    return 20;
  }, [isExtraSmall, isMobile, isSmallTablet, isTablet]);

  // Update visible items khi courseData thay đổi
  useEffect(() => {
    setVisibleItems(courseData);
  }, [courseData]);

  const getCurrentPage = (activeIndex: number) => {
    const totalPages = Math.ceil(visibleItems.length / slidesPerView);
    const calculatedPage = Math.min(
      Math.ceil((activeIndex + 1) / slidesPerView),
      totalPages
    );
    return Math.max(1, calculatedPage);
  };

  return (
    <>
      {/* CSS Animations for loading effects */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0) scale(1);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-15px) scale(1.1);
            opacity: 1;
          }
        }

        @keyframes glowPulse {
          0%,
          100% {
            box-shadow: 0 0 5px rgba(236, 72, 153, 0.3);
          }
          50% {
            box-shadow: 0 0 20px rgba(236, 72, 153, 0.6);
          }
        }

        .animate-shimmer {
          animation: shimmer 1.5s infinite linear;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-glow {
          animation: glowPulse 2s ease-in-out infinite;
        }

        /* Enhanced bounce for dots */
        .animate-bounce {
          animation: bounce 0.8s ease-in-out infinite;
        }

        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-8px) scale(1.1);
          }
        }

        /* Thêm CSS cho responsive swiper */
        .course-swiper {
          width: 100%;
          height: auto;
          margin: 0 auto;
          overflow: visible;
        }

        /* Cải thiện hiển thị nút điều hướng trên mobile */
        @media (max-width: 640px) {
          .swiper-pagination-bullet {
            width: 4px;
            height: 4px;
            margin: 0 2px;
          }

          .swiper-container {
            padding: 0 1px;
            overflow: hidden;
          }

          .swiper-slide {
            overflow: visible;
          }
        }

        /* Thêm wrapper style để ngăn overflow */
        .carousel-wrapper {
          overflow: hidden;
          width: 100%;
          position: relative;
        }
      `}</style>

      <div className={cn("relative group w-full carousel-wrapper", className)}>
        {/* Show loading when updating, hide swiper */}
        {removingLessons && removingLessons.size > 0 ? (
          /* Beautiful Loading Center Display */
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex flex-col items-center justify-center py-16 px-4"
            >
              {/* Main loading container - centered */}
              <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-xl p-6 max-w-md w-full animate-glow">
                <div className="flex flex-col items-center gap-4">
                  {/* Large animated dots spinner */}
                  <div className="flex gap-2">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-bounce"
                        style={{
                          animationDelay: `${i * 0.15}s`,
                          animationDuration: "0.8s"
                        }}
                      />
                    ))}
                  </div>

                  {/* Loading text - centered */}
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Đang cập nhật dữ liệu
                    </h3>
                    <p className="text-sm text-gray-600">
                      Đang xử lý{" "}
                      <span className="text-pink-600 font-semibold">
                        {removingLessons.size}
                      </span>{" "}
                      bài học
                    </p>
                  </div>

                  {/* Progress dots display */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Tiến độ:</span>
                    <div className="flex gap-1">
                      {[...Array(Math.min(removingLessons.size, 8))].map(
                        (_, i) => (
                          <div
                            key={i}
                            className="w-2 h-2 bg-pink-300 rounded-full animate-pulse"
                            style={{
                              animationDelay: `${i * 0.2}s`,
                              animationDuration: "1.5s"
                            }}
                          />
                        )
                      )}
                      {removingLessons.size > 8 && (
                        <span className="text-xs text-gray-500 ml-1">
                          +{removingLessons.size - 8}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Enhanced progress bar */}
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 rounded-full relative">
                      {/* Shimmer effect */}
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer"
                        style={{
                          backgroundSize: "200% 100%"
                        }}
                      />
                    </div>
                  </div>

                  {/* Status message */}
                  <p className="text-xs text-gray-500 text-center">
                    Vui lòng đợi trong giây lát...
                  </p>
                </div>
              </div>

              {/* Floating particles effect around loading */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(isMobile ? 6 : 12)].map((_, i) => (
                  <div
                    key={`loading-particle-${i}`}
                    className="absolute w-1 h-1 sm:w-1.5 sm:h-1.5 bg-pink-400/40 rounded-full animate-float"
                    style={{
                      left: `${15 + i * 8}%`,
                      top: `${30 + (i % 4) * 20}%`,
                      animationDelay: `${i * 0.3}s`,
                      animationDuration: "4s"
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        ) : (
          /* Virtualized Carousel Display */
          <VirtualizedCarousel
            items={visibleItems}
            className=""
            slidesPerView={slidesPerView}
            spaceBetween={spaceBetween}
            renderItem={renderLessonCard}
            onSlideChange={(activeIndex) => {
              setActiveIndex(activeIndex);
              const newPage = getCurrentPage(activeIndex);
              setCurrentSlide(newPage);
              setCurrentPage(newPage);
            }}
            isMobile={isMobile}
            isExtraSmall={isExtraSmall}
          />
        )}
      </div>
    </>
  );
}
