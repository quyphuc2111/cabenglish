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

interface CourseCarouselProps {
  courseData: any[];
  className?: string;
}

export function CourseCarousel({ courseData, className }: CourseCarouselProps) {
  const [swiper, setSwiper] = useState<any>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  
  const isMobile = useMediaQuery('(max-width: 640px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');

  return (
    <div className={cn("relative group", className)}>
      <Swiper
        onSwiper={setSwiper}
        modules={[Navigation, Pagination]}
        spaceBetween={isMobile ? 10 : 20}
        slidesPerView={isMobile ? 1.2 : isTablet ? 2.2 : 4}
        centeredSlides={isMobile ? true : false}
        loop={isMobile ? true : false}
        pagination={{
          clickable: true,
          el: '.swiper-pagination',
          dynamicBullets: isMobile ? true : false,
        }}
        onSlideChange={(swiper) => {
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
        className="course-swiper"
      >
        {courseData.map((course, index) => (
          <SwiperSlide key={index}>
            <CourseCard {...course} />
          </SwiperSlide>
        ))}
        
        <div className="swiper-pagination mt-8" />
      </Swiper>

      {!isMobile && (
        <>
          <Button
            variant="outline"
            size="xl"
            className={cn(
              "absolute left-20 top-1/2 -translate-y-1/2 -translate-x-4 rounded-full bg-white opacity-0 transition-all group-hover:opacity-100 group-hover:-translate-x-12 disabled:opacity-0",
              isBeginning && "hidden"
            )}
            onClick={() => swiper?.slidePrev()}
            disabled={isBeginning}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>

          <Button
            variant="outline"
            size="xl" 
            className={cn(
              "absolute right-20 top-1/2 -translate-y-1/2 translate-x-4 rounded-full bg-white opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-12 disabled:opacity-0",
              isEnd && "hidden"
            )}
            onClick={() => swiper?.slideNext()}
            disabled={isEnd}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        </>
      )}
    </div>
  );
}
