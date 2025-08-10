"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useRouter } from "next/navigation";
import { useSelectLessonStore } from "@/store/useSelectLesson";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from "@/components/ui/carousel";
import { useImagePreloader } from "@/hooks/useImagePreloader";

// Lazy loading component
const LazyLessonCard = React.lazy(() => import("../lesson/lesson-card"));

interface CourseCarouselProps {
  courseData: any[];
  className?: string;
  onLikeUpdate?: (lessonId: number, newLikeCount: number) => void;
  removingLessons?: Set<number>;
  onLessonClick?: (lessonId: number) => void;
  classroomData?: any[];
  containerType?: "current" | "next";
  onSlideChange?: (activeIndex: number) => void;
  showArrows?: boolean; // New prop to control arrow visibility
}

export function CourseCarousel({
  courseData,
  className,
  onLikeUpdate,
  removingLessons,
  onLessonClick,
  classroomData,
  containerType = "next",
  onSlideChange,
  showArrows = true // Default to true (arrows visible)
}: CourseCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [visibleItems, setVisibleItems] = useState(courseData);
  const router = useRouter();
  const { setSelectedLesson } = useSelectLessonStore();

  // Preload images for smooth carousel scrolling
  const imageUrls = useMemo(
    () => courseData.map((item) => item.imageUrl).filter(Boolean),
    [courseData]
  );

  useImagePreloader(imageUrls, {
    enabled: courseData.length > 0,
    priority: containerType === "next" // Prioritize next lectures
  });

  // Media queries for responsive behavior
  const isExtraSmall = useMediaQuery("(max-width: 480px)");
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isSmallTablet = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");
  const isLargeScreen = useMediaQuery("(min-width: 1536px)");

  // Calculate slides per view based on container type and screen size
  const slidesPerView = useMemo(() => {
    if (isExtraSmall) return "33%";
    if (isMobile) return "40%";
    if (isSmallTablet) return "40%";
    if (isTablet) return "40%";

    // Adjust for container type on desktop - make cards smaller
    if (containerType === "current") {
      if (isLargeScreen) return "33%"; // Changed from 50% to 33%
      return "50%"; // Changed from 66% to 50%
    } else {
      if (isLargeScreen) return "25%"; // Changed from 33% to 25%
      return "33%"; // Changed from 40% to 33%
    }
  }, [
    isExtraSmall,
    isMobile,
    isSmallTablet,
    isTablet,
    isLargeScreen,
    containerType
  ]);

  // Update visible items when courseData changes
  useEffect(() => {
    setVisibleItems(courseData);
  }, [courseData]);

  // Setup carousel API
  useEffect(() => {
    if (!api) return;

    const snapCount = api.scrollSnapList().length;
    const currentSnap = api.selectedScrollSnap();

    // Use actual snap count from carousel API
    setCount(snapCount);
    setCurrent(currentSnap);

    api.on("select", () => {
      const newCurrent = api.selectedScrollSnap();
      setCurrent(newCurrent);
      onSlideChange?.(newCurrent);
    });
  }, [api, onSlideChange]);

  // Render lesson card
  const renderLessonCard = useCallback(
    (course: any, index: number) => {
      const customCourse = {
        ...course,
        classRoomName: course.className
      };

      const handleLessonClick = () => {
        // Set selected lesson trước khi navigate
        setSelectedLesson({
          ...customCourse,
          lessonName: customCourse.lessonName || "",
          className: customCourse.className || "",
          unitName: customCourse.unitName || "",
          imageUrl: customCourse.imageUrl || ""
        });

        if (onLessonClick) {
          onLessonClick(customCourse.lessonId);
        } else {
          router.push(`/lesson/${customCourse.lessonId}`);
        }
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
            onClick={handleLessonClick}
            onLikeUpdate={onLikeUpdate}
            removingLessons={removingLessons}
            delay={0}
          />
        </React.Suspense>
      );
    },
    [onLessonClick, onLikeUpdate, removingLessons, router, setSelectedLesson]
  );

  // Show loading state when removing lessons
  if (removingLessons && removingLessons.size > 0) {
    return (
      <div className={cn("relative group w-full", className)}>
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex flex-col items-center justify-center py-16 px-4"
          >
            <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-xl p-4 sm:p-6 max-w-sm sm:max-w-md w-full">
              <div className="flex flex-col items-center gap-3 sm:gap-4">
                {/* Animated loading dots */}
                <div className="flex gap-1.5 sm:gap-2">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-bounce"
                      style={{
                        animationDelay: `${i * 0.15}s`,
                        animationDuration: "0.8s"
                      }}
                    />
                  ))}
                </div>

                {/* Loading text */}
                <div className="text-center">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1 sm:mb-2">
                    Đang cập nhật dữ liệu
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Đang xử lý{" "}
                    <span className="text-pink-600 font-semibold">
                      {removingLessons.size}
                    </span>{" "}
                    bài học
                  </p>
                </div>

                {/* Progress dots */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-xs text-gray-500 hidden sm:inline">
                    Tiến độ:
                  </span>
                  <div className="flex gap-0.5 sm:gap-1">
                    {[
                      ...Array(Math.min(removingLessons.size, isMobile ? 6 : 8))
                    ].map((_, i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-pink-300 rounded-full animate-pulse"
                        style={{
                          animationDelay: `${i * 0.2}s`,
                          animationDuration: "1.5s"
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 sm:h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 rounded-full relative">
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-pulse"
                      style={{ backgroundSize: "200% 100%" }}
                    />
                  </div>
                </div>

                <p className="text-xs text-gray-500 text-center">
                  Vui lòng đợi trong giây lát...
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className={cn("relative group w-full", className)}>
      {/* Item count indicator */}
      {visibleItems.length > 0 && (
        <div className="flex justify-between items-center mb-3">
          <div className="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
            <span className="font-medium text-gray-800">{visibleItems.length}</span> bài học
          </div>
          {/* Current position indicator for all devices */}
          <div className="text-xs text-gray-500">
            {current + 1} / {Math.max(count, 1)}
          </div>
        </div>
      )}

      <Carousel
        setApi={setApi}
        className="w-full"
        opts={{
          align: "start",
          loop: false
        }}
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {visibleItems.map((item, index) => (
            <CarouselItem
              key={item.lessonId || index}
              className={cn("pl-2 md:pl-4 h-full")}
              style={{ flexBasis: slidesPerView }}
              data-carousel-item="true"
            >
              {renderLessonCard(item, index)}
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation arrows positioned below carousel - inside Carousel component */}
        {showArrows && visibleItems.length > 2 && (
          <div className="flex justify-center gap-4 mt-4">
            <CarouselPrevious className="relative left-0 top-0 transform-none bg-white shadow-lg hover:bg-gray-50 border-2 border-gray-200 hover:border-pink-300 transition-all duration-200" />
            <CarouselNext className="relative right-0 top-0 transform-none bg-white shadow-lg hover:bg-gray-50 border-2 border-gray-200 hover:border-pink-300 transition-all duration-200" />
          </div>
        )}
      </Carousel>
    </div>
  );
}
