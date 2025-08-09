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
  showArrows = false // Default to false (arrows hidden)
}: CourseCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [visibleItems, setVisibleItems] = useState(courseData);
  const router = useRouter();
  const { setSelectedLesson } = useSelectLessonStore();

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

    // Adjust for container type on desktop
    if (containerType === "current") {
      if (isLargeScreen) return "50%";
      return "66%";
    } else {
      if (isLargeScreen) return "33%";
      return "40%";
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

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      const newCurrent = api.selectedScrollSnap();
      setCurrent(newCurrent + 1);
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
              className={cn("pl-2 md:pl-4")}
              style={{ flexBasis: slidesPerView }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="h-full"
              >
                {renderLessonCard(item, index)}
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation arrows - controlled by showArrows prop */}
        {showArrows && !isMobile && visibleItems.length > 2 && (
          <>
            <CarouselPrevious className="hidden lg:flex -left-12" />
            <CarouselNext className="hidden lg:flex -right-12" />
          </>
        )}
      </Carousel>

      {/* Custom dots pagination for mobile */}
      {isMobile && visibleItems.length > 2 && (
        <div className="flex justify-center mt-4 gap-2">
          {Array.from({ length: Math.min(count, 6) }, (_, i) => (
            <button
              key={i}
              onClick={() => api?.scrollTo(i)}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                current === i + 1
                  ? "bg-pink-500 scale-110"
                  : "bg-gray-300 hover:bg-gray-400"
              )}
            />
          ))}
        </div>
      )}

      {/* Custom dots pagination for desktop */}
      {!isMobile && visibleItems.length > 2 && (
        <div className="flex justify-center mt-4 gap-2">
          {Array.from({ length: Math.min(count, 6) }, (_, i) => (
            <button
              key={i}
              onClick={() => api?.scrollTo(i)}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-300 hover:scale-110",
                current === i + 1
                  ? "bg-pink-500 scale-110 shadow-lg"
                  : "bg-gray-300 hover:bg-gray-400"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
