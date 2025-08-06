"use client";

import React, { useState, useCallback, memo } from "react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import SectionTitle from "@/components/common/section-title";
import FilterFacet from "@/components/common/filter-facet";
import Image from "next/image";
import { PaginatedContent } from "@/components/common/paginated-content";
import { LessonType } from "@/types/lesson";
import LessonCard from "@/components/lesson/lesson-card";

// Memoized stats component
const LessonStats = memo(
  ({
    filteredCount,
    totalCount
  }: {
    filteredCount: number;
    totalCount: number;
  }) => (
    <p className="text-[#736E6E] text-sm sm:text-base md:text-md mx-2 sm:mx-4 md:mx-8 my-2 font-medium">
      Còn lại{" "}
      <span className="text-[#e25762] font-semibold">{filteredCount}</span>/
      {totalCount} bài học chưa dạy
    </p>
  )
);

LessonStats.displayName = "LessonStats";

// Memoized empty state component
const EmptyLessonsState = memo(() => (
  <div className="flex flex-col items-center gap-6 sm:gap-8 md:gap-10 min-h-[300px] sm:min-h-[400px] md:min-h-[600px] justify-center px-4">
    <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-[#736E6E] text-center leading-relaxed">
      Hiện tại chưa có bài giảng nào!
    </h3>
    <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36">
      <Image
        src="/assets/image/no_course.png"
        width={512}
        height={512}
        alt="no_course"
        className="object-contain"
        priority={false}
        loading="lazy"
      />
    </div>
  </div>
));

EmptyLessonsState.displayName = "EmptyLessonsState";

function LessonPendingClient({
  pendingLessons,
  totalLessons,
  initialFilterData,
  fetchFilterData
}: {
  pendingLessons: LessonType[];
  totalLessons: number;
  initialFilterData: any;
  fetchFilterData: any;
}) {
  const [filteredLessons, setFilteredLessons] =
    useState<LessonType[]>(pendingLessons);

  const handleFilterChange = useCallback(
    async (filterValues: {
      classId: string;
      unitId: string;
      userId: string;
    }) => {
      // Optimistic update - cập nhật UI ngay lập tức
      const filtered = pendingLessons.filter((lesson) => {
        if (
          filterValues.classId &&
          lesson.classId !== parseInt(filterValues.classId)
        ) {
          return false;
        }
        if (
          filterValues.unitId &&
          lesson.unitId !== parseInt(filterValues.unitId)
        ) {
          return false;
        }
        return true;
      });

      setFilteredLessons(filtered);
    },
    [pendingLessons]
  );

  // Memoized render function for lesson cards
  const renderLessonCard = useCallback(
    (lessonItem: LessonType) => (
      <LessonCard
        {...lessonItem}
        classRoomName={lessonItem.className}
        schoolWeekId={lessonItem.schoolWeekId || lessonItem.schoolWeekID || 0}
        key={`pending-${lessonItem.lessonId}`}
      />
    ),
    []
  );

  return (
    <ContentLayout title="BaiGiangChuaDay">
      <LessonStats
        filteredCount={filteredLessons.length}
        totalCount={totalLessons}
      />

      <div className="bg-white p-3 sm:p-4 md:p-6 relative rounded-xl min-h-screen mx-2 sm:mx-4 md:mx-0">
        <div className="flex flex-col gap-4 w-full sm:gap-6 md:flex-row md:items-end md:gap-8 md:justify-between">
          <div className="flex-shrink-0">
            <SectionTitle
              title="Bài giảng chưa dạy"
              image={{
                src: "/assets/gif/book_animate.gif",
                width: 32,
                height: 32,
                alt: "book_animate"
              }}
              wrapperClassName="border-[#E25762]"
            />
          </div>

          <div className="w-full md:flex-1">
            <FilterFacet
              initialFilterData={initialFilterData}
              fetchFilterData={fetchFilterData}
              onFilterChange={handleFilterChange}
            />
          </div>
        </div>

        <div className="mt-4 sm:mt-6">
          {filteredLessons.length > 0 ? (
            <PaginatedContent
              items={filteredLessons}
              itemsPerPage={8}
              renderItem={renderLessonCard}
              rowPerPage={4} // Grid responsive: 2 cột trên mobile, 4 cột trên desktop
              itemInPage={[8, 16, 24, 32]} // Options cho items per page
            />
          ) : (
            <EmptyLessonsState />
          )}
        </div>
      </div>
    </ContentLayout>
  );
}

export default memo(LessonPendingClient);
