"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Virtual scrolling constants
const VIRTUAL_THRESHOLD = 50;
const BUFFER_SIZE = 5;

// Lazy loading component wrapper
const LazyLessonCard = React.lazy(() => import("../lesson/lesson-card"));

interface VirtualizedCarouselProps {
  items: any[];
  className?: string;
  slidesPerView: number;
  spaceBetween: number;
  renderItem: (item: any, index: number) => React.ReactNode;
  onSlideChange?: (activeIndex: number) => void;
  isMobile?: boolean;
  isExtraSmall?: boolean;
}

// Hook for virtual scrolling
function useVirtualScrolling(items: any[], slidesPerView: number, activeIndex: number) {
  return useMemo(() => {
    if (items.length <= VIRTUAL_THRESHOLD) {
      return { 
        virtualItems: items, 
        startIndex: 0, 
        endIndex: items.length - 1,
        isVirtual: false 
      };
    }

    const visibleCount = Math.ceil(slidesPerView) + BUFFER_SIZE * 2;
    const startIndex = Math.max(0, activeIndex - BUFFER_SIZE);
    const endIndex = Math.min(items.length - 1, startIndex + visibleCount - 1);
    
    const virtualItems = items.slice(startIndex, endIndex + 1);
    
    return { 
      virtualItems, 
      startIndex, 
      endIndex,
      isVirtual: true 
    };
  }, [items, slidesPerView, activeIndex]);
}

// Hook for intersection observer (lazy loading)
function useIntersectionObserver(threshold = 0.1) {
  const [visibleElements, setVisibleElements] = useState<Set<string>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);

  const observe = useCallback((element: Element, id: string) => {
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const elementId = entry.target.getAttribute('data-id');
            if (elementId) {
              setVisibleElements(prev => {
                const newSet = new Set(prev);
                if (entry.isIntersecting) {
                  newSet.add(elementId);
                } else {
                  newSet.delete(elementId);
                }
                return newSet;
              });
            }
          });
        },
        { threshold, rootMargin: '50px' }
      );
    }
    
    element.setAttribute('data-id', id);
    observerRef.current.observe(element);
  }, [threshold]);

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return { visibleElements, observe };
}

export function VirtualizedCarousel({
  items,
  className,
  slidesPerView,
  spaceBetween,
  renderItem,
  onSlideChange,
  isMobile = false,
  isExtraSmall = false
}: VirtualizedCarouselProps) {
  const [swiper, setSwiper] = useState<any>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // Initialize intersection observer for lazy loading
  const { visibleElements, observe } = useIntersectionObserver(0.1);

  // Use virtual scrolling for large datasets
  const { virtualItems, startIndex, isVirtual } = useVirtualScrolling(
    items,
    slidesPerView,
    activeIndex
  );

  const effectiveSlidesPerView = Math.floor(slidesPerView);
  const totalPages = Math.ceil(items.length / slidesPerView);

  const getCurrentPage = (activeIndex: number) => {
    const calculatedPage = Math.min(
      Math.ceil((activeIndex + 1) / slidesPerView),
      totalPages
    );
    return Math.max(1, calculatedPage);
  };

  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  };

  return (
    <div className={cn("relative group w-full", className)}>
      <div className={cn(
        "swiper-container w-full",
        isExtraSmall ? "px-0 mx-0" : isMobile ? "px-0.5 mx-0.5" : "px-0"
      )}>
        <Swiper
          onSwiper={setSwiper}
          modules={[Navigation, Pagination]}
          spaceBetween={spaceBetween}
          slidesPerView={slidesPerView}
          centeredSlides={false}
          loop={false}
          slideToClickedSlide={true}
          watchSlidesProgress={true}
          observer={true}
          observeParents={true}
          observeSlideChildren={true}
          resizeObserver={true}
          updateOnWindowResize={true}
          pagination={{
            clickable: true,
            el: ".swiper-pagination",
            dynamicBullets: isMobile ? true : false
          }}
          onSlideChange={(swiper) => {
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
            setActiveIndex(swiper.activeIndex);
            const newPage = getCurrentPage(swiper.activeIndex);
            setCurrentPage(newPage);
            onSlideChange?.(swiper.activeIndex);
          }}
          className="course-swiper"
        >
          <AnimatePresence>
            {virtualItems.map((item, index) => {
              const actualIndex = isVirtual ? startIndex + index : index;
              const itemId = `item-${item.lessonId || item.id || actualIndex}`;
              const isVisible = visibleElements.has(itemId);

              return (
                <SwiperSlide
                  key={itemId}
                  className="transition-all duration-300 ease-in-out pb-1.5 w-full"
                >
                  <div
                    className={cn(
                      "px-0.5",
                      isExtraSmall && "transform scale-[0.98]"
                    )}
                    ref={(el) => {
                      if (el) {
                        observe(el, itemId);
                      }
                    }}
                  >
                    <motion.div
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="h-full"
                    >
                      {isVisible || actualIndex < effectiveSlidesPerView + BUFFER_SIZE ? (
                        renderItem(item, actualIndex)
                      ) : (
                        <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
                          <div className="text-gray-400 text-sm">Loading...</div>
                        </div>
                      )}
                    </motion.div>
                  </div>
                </SwiperSlide>
              );
            })}
          </AnimatePresence>
        </Swiper>

        {/* Mobile pagination */}
        {isMobile && items.length > effectiveSlidesPerView && (
          <div className="swiper-pagination flex justify-center mt-1"></div>
        )}
      </div>

      {/* Desktop navigation */}
      {!isMobile && items.length > effectiveSlidesPerView && (
        <div className="flex items-center justify-center gap-4 -mt-2">
          <Button
            variant="outline"
            size="xl"
            className={cn(
              "rounded-full bg-white hover:bg-gray-50 transition-all duration-300",
              "border-2 border-gray-200 hover:border-gray-300 hover:shadow-md",
              "hover:scale-105 active:scale-95",
              isBeginning && "opacity-50"
            )}
            onClick={() => swiper?.slidePrev()}
            disabled={isBeginning}
          >
            <ChevronLeft className="h-6 w-6 text-gray-700" />
          </Button>

          {/* Custom Dots Pagination */}
          <div className="flex items-center gap-2">
            {Array.from({ length: Math.min(totalPages, 6) }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => {
                  const targetIndex = Math.floor(i * slidesPerView);
                  swiper?.slideTo(targetIndex);
                }}
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-300 hover:scale-110",
                  currentPage === i + 1
                    ? "bg-pink-500 scale-110"
                    : "bg-gray-300 hover:bg-gray-400"
                )}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="xl"
            className={cn(
              "rounded-full bg-white hover:bg-gray-50 transition-all duration-300",
              "border-2 border-gray-200 hover:border-gray-300 hover:shadow-md",
              "hover:scale-105 active:scale-95",
              isEnd && "opacity-50"
            )}
            onClick={() => swiper?.slideNext()}
            disabled={isEnd}
          >
            <ChevronRight className="h-6 w-6 text-gray-700" />
          </Button>
        </div>
      )}
    </div>
  );
}
