"use client"
import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
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

interface CourseCarouselProps {
  courseData: any[];
  className?: string;
}

export function CourseCarousel({ courseData, className }: CourseCarouselProps) {
  const [swiper, setSwiper] = useState<any>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(1);
  
  const isMobile = useMediaQuery('(max-width: 640px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');
  const isLargeScreen = useMediaQuery('(min-width: 1536px)');

  const slidesPerView = isMobile 
    ? 1.2 
    : isTablet 
    ? 2.2 
    : isLargeScreen 
    ? 4 
    : 3;

  const effectiveSlidesPerView = Math.floor(slidesPerView);
  const totalPages = Math.ceil(courseData.length / effectiveSlidesPerView);

  const getCurrentPage = (activeIndex: number) => {
    // Đảm bảo không vượt quá tổng số trang
    const calculatedPage = Math.min(
      Math.ceil((activeIndex + 1) / effectiveSlidesPerView),
      totalPages
    );
    return Math.max(1, calculatedPage); // Đảm bảo không nhỏ hơn 1
  };

  return (
    <div className={cn("relative group", className)}>
      <Swiper
        onSwiper={setSwiper}
        modules={[Navigation, Pagination]}
        spaceBetween={isMobile ? 10 : isTablet ? 15 : 20}
        slidesPerView={slidesPerView}
        centeredSlides={isMobile ? true : false}
        loop={isMobile ? true : false}
        slideToClickedSlide={true}
        watchSlidesProgress={true}
        observer={true}
        observeParents={true}
        pagination={{
          clickable: true,
          el: '.swiper-pagination',
          dynamicBullets: isMobile ? true : false,
        }}
        onSlideChange={(swiper) => {
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
          setCurrentSlide(getCurrentPage(swiper.activeIndex));
          console.log('Current Index:', swiper.activeIndex, 'Current Page:', getCurrentPage(swiper.activeIndex));
        }}
        className="course-swiper pb-12"
      >
        {courseData.map((course, index) => {
          const customCourse = {
            ...course,
            classRoomName: course.className,
          }
          console.log("cuss", customCourse)
          return (
            <SwiperSlide key={index}>
              <LessonCard {...customCourse} />
            </SwiperSlide>
          );
        })}
        
        {/* <div className="swiper-pagination" /> */}
      </Swiper>

      {!isMobile && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <Button
            variant="outline"
            size="xl"
            className={cn(
              "rounded-full bg-white hover:bg-gray-50 transition-all disabled:opacity-50",
              "border-2 border-gray-200 hover:border-gray-300",
              isBeginning && "opacity-50"
            )}
            onClick={() => swiper?.slidePrev()}
            disabled={isBeginning}
          >
            <ChevronLeft className="h-6 w-6 text-gray-700" />
          </Button>

          <div className="min-w-[80px] text-center font-medium text-gray-600">
            {currentSlide} / {totalPages}
          </div>

          <Button
            variant="outline"
            size="xl" 
            className={cn(
              "rounded-full bg-white hover:bg-gray-50 transition-all disabled:opacity-50",
              "border-2 border-gray-200 hover:border-gray-300",
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
