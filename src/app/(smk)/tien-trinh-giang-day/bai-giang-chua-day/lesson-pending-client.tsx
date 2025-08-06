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
  // Memoize pendingLessons với deep comparison để tránh re-render không cần thiết
  const memoizedPendingLessons = React.useMemo(
    () => pendingLessons,
    [
      JSON.stringify(
        pendingLessons.map((lesson) => ({
          id: lesson.lessonId,
          classId: lesson.classId,
          unitId: lesson.unitId
        }))
      )
    ]
  );

  const [filteredLessons, setFilteredLessons] = useState<LessonType[]>(
    memoizedPendingLessons
  );
  const [currentFilters, setCurrentFilters] = useState<{
    classId: string;
    unitId: string;
    userId: string;
    weekId: string;
  }>({
    classId: "",
    unitId: "",
    userId: "",
    weekId: ""
  });

  // Sync filteredLessons when memoizedPendingLessons changes
  React.useEffect(() => {
    console.log(
      "🔄 memoizedPendingLessons changed:",
      memoizedPendingLessons.length
    );

    // Áp dụng lại filter hiện tại khi có dữ liệu mới
    if (
      currentFilters.classId ||
      currentFilters.unitId ||
      currentFilters.weekId
    ) {
      const filtered = memoizedPendingLessons.filter((lesson) => {
        if (currentFilters.classId && currentFilters.classId.trim() !== "") {
          if (lesson.classId !== parseInt(currentFilters.classId)) return false;
        }
        if (currentFilters.unitId && currentFilters.unitId.trim() !== "") {
          if (lesson.unitId !== parseInt(currentFilters.unitId)) return false;
        }
        if (currentFilters.weekId && currentFilters.weekId.trim() !== "") {
          const lessonWeekId = lesson.schoolWeekId || lesson.schoolWeekID;
          if (lessonWeekId !== parseInt(currentFilters.weekId)) return false;
        }
        return true;
      });
      setFilteredLessons(filtered);
    } else {
      setFilteredLessons(memoizedPendingLessons);
    }
  }, [memoizedPendingLessons, currentFilters]);

  // Debug: Log dữ liệu pendingLessons (chỉ khi có thay đổi thực sự)
  React.useEffect(() => {
    if (memoizedPendingLessons.length > 0) {
      console.log(
        "📊 All pending lessons classIds:",
        memoizedPendingLessons.map((lesson) => ({
          lessonId: lesson.lessonId,
          classId: lesson.classId,
          className: lesson.className
        }))
      );

      const uniqueClassIds = [
        ...new Set(memoizedPendingLessons.map((lesson) => lesson.classId))
      ];
      console.log("🏫 Unique class IDs in data:", uniqueClassIds);
    }
  }, [memoizedPendingLessons.length]); // Chỉ log khi length thay đổi

  const handleFilterChange = useCallback(
    async (filterValues: {
      classId: string;
      unitId: string;
      userId: string;
      weekId: string;
    }) => {
      console.log("🔍 Filter change detected:", filterValues);

      // Lưu filter hiện tại
      setCurrentFilters(filterValues);

      // Áp dụng filter ngay lập tức
      const filtered = memoizedPendingLessons.filter((lesson) => {
        // Filter theo classId
        if (filterValues.classId && filterValues.classId.trim() !== "") {
          if (lesson.classId !== parseInt(filterValues.classId)) {
            return false;
          }
        }

        // Filter theo unitId
        if (filterValues.unitId && filterValues.unitId.trim() !== "") {
          if (lesson.unitId !== parseInt(filterValues.unitId)) {
            return false;
          }
        }

        // Filter theo weekId
        if (filterValues.weekId && filterValues.weekId.trim() !== "") {
          const lessonWeekId = lesson.schoolWeekId || lesson.schoolWeekID;
          if (lessonWeekId !== parseInt(filterValues.weekId)) {
            return false;
          }
        }

        return true;
      });

      console.log(
        "✅ Filtered lessons:",
        filtered.length,
        "out of",
        memoizedPendingLessons.length
      );
      setFilteredLessons(filtered);
    },
    [memoizedPendingLessons]
  );

  // 🚀 Initial filter application effect - apply filters on component mount
  React.useEffect(() => {
    // Kiểm tra xem có URL search params không khi component mount
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const classId = urlParams.get("classId") || "";
      const unitId = urlParams.get("unitId") || "";
      const weekId = urlParams.get("weekId") || "";

      if (classId || unitId || weekId) {
        console.log("🎯 Initial URL params detected, applying filters:", {
          classId,
          unitId,
          weekId
        });
        handleFilterChange({
          classId,
          unitId,
          userId: "",
          weekId
        });
      }
    }
  }, []); // Chỉ chạy một lần khi component mount

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
