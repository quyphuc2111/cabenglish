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
  <div className="flex flex-col items-center gap-10 min-h-[600px] justify-center">
    <h3 className="text-2xl text-[#736E6E]">
      Hiện tại chưa có bài giảng nào!
    </h3>
    <div className="w-36 h-36">
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
      <p className="text-[#736E6E] text-md ml-8 my-2 font-medium">
        Đã hoàn thành <span className="text-[#3EC474]">{completedLessons.length}</span>/{lessonData.length} bài học
      </p>
      <div className="bg-white px-5 py-2 relative rounded-xl">
        <div className="flex gap-20 absolute top-0 right-[12%]">
          <Image src="/rank.gif" alt="rank" width={40} height={40} />
          <Image src="/rank.gif" alt="rank" width={40} height={40} />
        </div>
        <div className="flex items-center gap-8">
          <SectionTitle
            title="Bài giảng hoàn thành"
            image={{
              src: "/assets/gif/book_animate.gif",
              width: 40,
              height: 40,
              alt: "book_animate"
            }}
            wrapperClassName="border-[#3EC474]"
          />
          <FilterFacet initialFilterData={initialFilterData} fetchFilterData={fetchFilterData} onFilterChange={() => {}} />
        </div>

        {completedLessons.length > 0 ? (
          <PaginatedContent
            items={completedLessons}
            itemsPerPage={ITEMS_PER_PAGE}
            renderItem={(lessonItem) => (
              <LessonCard 
                {...lessonItem}
                classRoomName={lessonItem.className}
              />
            )}
          />
        ) : (
          <NoLessons />
        )}
      </div>
    </ContentLayout>
  );
}

export default LessonCompleteClient;
