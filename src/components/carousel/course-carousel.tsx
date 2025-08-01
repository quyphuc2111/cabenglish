"use client"
import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { motion, AnimatePresence } from 'framer-motion';
import CourseCard from '@/components/course-card/course-card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/useMediaQuery';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import LessonCard from '../lesson/lesson-card';
import { useRouter } from 'next/navigation';

interface CourseCarouselProps {
  courseData: any[];
  className?: string;
  onLikeUpdate?: (lessonId: number, newLikeCount: number) => void;
  removingLessons?: Set<number>;
}

export function CourseCarousel({ courseData, className, onLikeUpdate, removingLessons }: CourseCarouselProps) {
  const [swiper, setSwiper] = useState<any>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(1);
  const [visibleItems, setVisibleItems] = useState(courseData);
  
  // Thêm breakpoint cho màn hình siêu nhỏ (mobile nhỏ)
  const isExtraSmall = useMediaQuery('(max-width: 480px)');
  const isMobile = useMediaQuery('(max-width: 640px)');
  const isSmallTablet = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');
  const isLargeScreen = useMediaQuery('(min-width: 1536px)');
  const router = useRouter();

  // Điều chỉnh slidesPerView cho từng kích thước màn hình - hiển thị gần như full 1 slide trên mobile
  const slidesPerView = isExtraSmall
    ? 1.5  
    : isMobile 
    ? 2.5   
    : isSmallTablet
    ? 2.5  
    : isTablet 
    ? 2.5 
    : isLargeScreen 
    ? 4 
    : 3;

  const effectiveSlidesPerView = Math.floor(slidesPerView);

  // Điều chỉnh spaceBetween cho từng kích thước màn hình
  const getSpaceBetween = () => {
    if (isExtraSmall) return 6;  // Giảm khoảng cách cho màn hình rất nhỏ
    if (isMobile) return 8;     // Giảm khoảng cách cho mobile
    if (isSmallTablet) return 12; // Khoảng cách cho tablet nhỏ
    if (isTablet) return 16;     // Giữ nguyên cho tablet
    return 20;                   // Mặc định cho màn hình lớn
  };

  // Update visible items khi courseData thay đổi
  useEffect(() => {
    setVisibleItems(courseData);
  }, [courseData]);

  // Smooth update pagination khi items thay đổi
  useEffect(() => {
    if (swiper) {
      const totalPages = Math.ceil(visibleItems.length / effectiveSlidesPerView);
      const currentActiveIndex = swiper.activeIndex;
      
      // Adjust active slide if needed
      if (currentActiveIndex >= visibleItems.length && visibleItems.length > 0) {
        swiper.slideTo(Math.max(0, visibleItems.length - 1));
      }
      
      swiper.update();
    }
  }, [visibleItems.length, swiper, effectiveSlidesPerView]);

  const totalPages = Math.ceil(visibleItems.length / effectiveSlidesPerView);

  const getCurrentPage = (activeIndex: number) => {
    const calculatedPage = Math.min(
      Math.ceil((activeIndex + 1) / effectiveSlidesPerView),
      totalPages
    );
    return Math.max(1, calculatedPage); 
  };

  // Simplified animation variants cho carousel items
  const itemVariants = {
    hidden: { 
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3
      }
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.2
      }
    }
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
          0%, 100% {
            transform: translateY(0) scale(1);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-15px) scale(1.1);
            opacity: 1;
          }
        }

        @keyframes glowPulse {
          0%, 100% {
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
          0%, 100% {
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
                          animationDuration: '0.8s'
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
                      Đang xử lý <span className="text-pink-600 font-semibold">{removingLessons.size}</span> bài học
                    </p>
                  </div>

                  {/* Progress dots display */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Tiến độ:</span>
                    <div className="flex gap-1">
                      {[...Array(Math.min(removingLessons.size, 8))].map((_, i) => (
                        <div
                          key={i}
                          className="w-2 h-2 bg-pink-300 rounded-full animate-pulse"
                          style={{
                            animationDelay: `${i * 0.2}s`,
                            animationDuration: '1.5s'
                          }}
                        />
                      ))}
                      {removingLessons.size > 8 && (
                        <span className="text-xs text-gray-500 ml-1">+{removingLessons.size - 8}</span>
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
                          backgroundSize: '200% 100%'
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
                      left: `${15 + (i * 8)}%`,
                      top: `${30 + (i % 4) * 20}%`,
                      animationDelay: `${i * 0.3}s`,
                      animationDuration: '4s'
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        ) : (
          /* Normal Swiper Display */
          <>
            {/* Cải thiện container với padding phù hợp cho từng thiết bị */}
            <div className={cn(
              "swiper-container w-full",
              isExtraSmall ? "px-0 mx-0" : isMobile ? "px-0.5 mx-0.5" : "px-0" // Giảm padding đối với mobile
            )}>
              <Swiper
                onSwiper={setSwiper}
                modules={[Navigation, Pagination]}
                spaceBetween={getSpaceBetween()}
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
                  el: '.swiper-pagination',
                  dynamicBullets: isMobile ? true : false,
                }}
                onSlideChange={(swiper) => {
                  setIsBeginning(swiper.isBeginning);
                  setIsEnd(swiper.isEnd);
                  setCurrentSlide(getCurrentPage(swiper.activeIndex));
                }}
                className="course-swiper pb-8 sm:pb-10" // Giảm padding-bottom trên mobile
              >
                <AnimatePresence>
                  {visibleItems.map((course, index) => {
                    const customCourse = {
                      ...course,
                      classRoomName: course.className,
                    };

                    const isRemoving = removingLessons?.has(course.lessonId) || false;

                    return (
                      <SwiperSlide 
                        key={`lesson-${course.lessonId}`}
                        className="transition-all duration-300 ease-in-out pb-1.5 w-full" // Giảm padding-bottom
                      >
                        <div className={cn(
                          "px-0.5", // Thêm padding nhỏ cho card
                          isExtraSmall && "transform scale-[0.98]" // Thu nhỏ một chút cho màn hình rất nhỏ
                        )}>
                          <motion.div
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="h-full"
                          >
                            <LessonCard 
                              {...customCourse} 
                              onClick={() => router.push(`/lesson/${customCourse.lessonId}`)}
                              onLikeUpdate={onLikeUpdate}
                              removingLessons={removingLessons}
                              delay={0}
                            />
                          </motion.div>
                        </div>
                      </SwiperSlide>
                    );
                  })}
                </AnimatePresence>
              </Swiper>

              {/* Điểm phân trang cho mobile */}
              {isMobile && visibleItems.length > effectiveSlidesPerView && (
                <div className="swiper-pagination flex justify-center mt-1"></div>
              )}
            </div>

            {/* Enhanced Navigation - hiển thị trên tablet và desktop */}
            {!isMobile && visibleItems.length > effectiveSlidesPerView && (
              <div className="flex items-center justify-center gap-4 mt-4 sm:mt-6">
                <Button
                  variant="outline"
                  size={isSmallTablet ? "default" : "xl"}
                  className={cn(
                    "rounded-full bg-white hover:bg-gray-50 transition-all duration-300 disabled:opacity-50",
                    "border-2 border-gray-200 hover:border-gray-300 hover:shadow-md",
                    "hover:scale-105 active:scale-95",
                    isBeginning && "opacity-50"
                  )}
                  onClick={() => swiper?.slidePrev()}
                  disabled={isBeginning}
                >
                  <ChevronLeft className={cn(
                    isSmallTablet ? "h-5 w-5" : "h-6 w-6",
                    "text-gray-700"
                  )} />
                </Button>

                <div className="min-w-[80px] sm:min-w-[100px] text-center font-medium text-gray-600 bg-gray-50 px-3 py-1 sm:px-4 sm:py-2 rounded-full text-sm">
                  {currentSlide} / {totalPages}
                </div>

                <Button
                  variant="outline"
                  size={isSmallTablet ? "default" : "xl"}
                  className={cn(
                    "rounded-full bg-white hover:bg-gray-50 transition-all duration-300 disabled:opacity-50",
                    "border-2 border-gray-200 hover:border-gray-300 hover:shadow-md",
                    "hover:scale-105 active:scale-95",
                    isEnd && "opacity-50"
                  )}
                  onClick={() => swiper?.slideNext()}
                  disabled={isEnd}
                >
                  <ChevronRight className={cn(
                    isSmallTablet ? "h-5 w-5" : "h-6 w-6",
                    "text-gray-700"
                  )} />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
