"use client";
import React, { useMemo } from "react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import SectionTitle from "@/components/common/section-title";
import Image from "next/image";
import { PaginatedContent } from "@/components/common/paginated-content";
import { LessonType } from "@/types/lesson";
import LessonCard from "@/components/lesson/lesson-card";
import OptimizeImage from "@/components/common/optimize-image";
import FilterFacet from "@/components/common/filter-facet";

const ITEMS_PER_PAGE = 8;

const NoLessons = () => (
  <div className="flex flex-col items-center gap-6 sm:gap-8 md:gap-10 min-h-[300px] sm:min-h-[400px] md:min-h-[600px] justify-center px-4">
    <h3 className="text-lg sm:text-xl md:text-2xl text-[#736E6E] text-center leading-relaxed">
      Hiện tại chưa có bài giảng nào!
    </h3>
    <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36">
      <OptimizeImage
        src="/assets/image/no_course.png"
        width={512}
        height={512}
        alt="no_course"
        className="object-contain"
      />
    </div>
  </div>
);

function LessonCompleteClient({ lessonData, initialFilterData, fetchFilterData }: { lessonData: LessonType[], initialFilterData: any, fetchFilterData: any }) {
  const completedLessons = useMemo(() => 
    lessonData.filter((lesson) => Number(lesson.progress) === 1)
  , [lessonData]);

  return (
    <ContentLayout title="BaiGiangHoanThanh">
      <div className="px-4 sm:px-6 md:px-8">
        <p className="text-[#736E6E] text-sm sm:text-base md:text-md my-2 font-medium">
          Đã hoàn thành <span className="text-[#3EC474] font-semibold">{completedLessons.length}</span>/{lessonData.length} bài học
        </p>
      </div>

      <div className="bg-white px-3 sm:px-4 md:px-5 py-3 sm:py-4 md:py-2 relative rounded-xl mx-2 sm:mx-4 md:mx-0">
        <div className="hidden lg:flex gap-12 xl:gap-20 absolute top-2 md:top-0 right-[8%] xl:right-[12%]">
          <Image 
            src="/rank.gif" 
            alt="rank" 
            width={32} 
            height={32} 
            className="w-8 h-8 xl:w-10 xl:h-10" 
          />
          <Image 
            src="/rank.gif" 
            alt="rank" 
            width={32} 
            height={32} 
            className="w-8 h-8 xl:w-10 xl:h-10" 
          />
        </div>
        
        <div className="flex flex-col gap-4 sm:gap-6 md:flex-row md:items-center md:gap-8">
          <div className="flex-shrink-0">
            <SectionTitle
              title="Bài giảng hoàn thành"
              image={{
                src: "/assets/gif/book_animate.gif",
                width: 32,
                height: 32,
                alt: "book_animate"
              }}
              wrapperClassName="border-[#3EC474]"
            />
          </div>
          
          <div className="w-full md:flex-1">
            <FilterFacet 
              initialFilterData={initialFilterData} 
              fetchFilterData={fetchFilterData} 
              onFilterChange={() => {}} 
            />
          </div>
        </div>

        <div className="mt-4 sm:mt-6">
          {completedLessons.length > 0 ? (
            <PaginatedContent
              items={completedLessons}
              itemsPerPage={ITEMS_PER_PAGE}
              renderItem={(lessonItem) => (
                <LessonCard 
                  {...lessonItem}
                  classRoomName={lessonItem.className}
                  schoolWeekId={lessonItem.schoolWeekId || lessonItem.schoolWeekID || 0}
                />
              )}
            />
          ) : (
            <NoLessons />
          )}
        </div>
      </div>
    </ContentLayout>
  );
}

export default LessonCompleteClient;
