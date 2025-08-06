"use client";
import React, { useMemo, useState, useEffect, useCallback, memo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import SectionTitle from "@/components/common/section-title";
import Image from "next/image";
import { PaginatedContent } from "@/components/common/paginated-content";
import { LessonType } from "@/types/lesson";
import LessonCard from "@/components/lesson/lesson-card";
import OptimizeImage from "@/components/common/optimize-image";
import FilterFacet from "@/components/common/filter-facet";
import PerformanceWrapper from "@/components/common/performance-wrapper";

const ITEMS_PER_PAGE = 8;

// Types
interface FilterValues {
  classId: string;
  unitId: string;
  weekId: string;
}

interface LessonCompleteClientProps {
  lessonData: LessonType[];
  initialFilterData: any;
  fetchFilterData: any;
}

// Custom hook for URL synchronization with debouncing
const useURLSync = (searchParams: URLSearchParams) => {
  const router = useRouter();
  const pathname = usePathname();

  const [filterValues, setFilterValues] = useState<FilterValues>(() => ({
    classId: searchParams.get("classId") || "",
    unitId: searchParams.get("unitId") || "",
    weekId: searchParams.get("weekId") || ""
  }));

  // Debounced URL update function
  const debouncedUpdateURL = useCallback(
    debounce((newValues: FilterValues) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(newValues).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });

      const newSearchParams = params.toString();
      const newURL = `${pathname}${
        newSearchParams ? `?${newSearchParams}` : ""
      }`;

      // Use requestIdleCallback for better performance
      if (typeof window !== "undefined" && "requestIdleCallback" in window) {
        requestIdleCallback(() => {
          router.replace(newURL, { scroll: false });
        });
      } else {
        router.replace(newURL, { scroll: false });
      }
    }, 150),
    [router, pathname, searchParams]
  );

  const updateFilterValues = useCallback(
    (newValues: FilterValues) => {
      setFilterValues(newValues);
      debouncedUpdateURL(newValues);
    },
    [debouncedUpdateURL]
  );

  useEffect(() => {
    const newFilterValues = {
      classId: searchParams.get("classId") || "",
      unitId: searchParams.get("unitId") || "",
      weekId: searchParams.get("weekId") || ""
    };

    setFilterValues(newFilterValues);
  }, [searchParams]);

  return { filterValues, updateFilterValues };
};

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Custom hook for lesson filtering
const useLessonFilter = (
  lessonData: LessonType[],
  filterValues: FilterValues
) => {
  return useMemo(() => {
    const completedLessons = lessonData.filter(
      (lesson) => Number(lesson.progress) >= 1
    );

    const filterConditions = [
      {
        condition: !!filterValues.classId,
        filter: (lesson: LessonType) =>
          lesson.classId === Number(filterValues.classId)
      },
      {
        condition: !!filterValues.unitId,
        filter: (lesson: LessonType) =>
          lesson.unitId === Number(filterValues.unitId)
      },
      {
        condition: !!filterValues.weekId,
        filter: (lesson: LessonType) =>
          lesson.schoolWeekId === Number(filterValues.weekId)
      }
    ];

    return completedLessons.filter((lesson) =>
      filterConditions.every(
        ({ condition, filter }) => !condition || filter(lesson)
      )
    );
  }, [lessonData, filterValues]);
};

// Memoized component for lesson stats
const LessonStats = memo(
  ({
    completedCount,
    totalCount
  }: {
    completedCount: number;
    totalCount: number;
  }) => (
    <div className="px-4 sm:px-6 md:px-8">
      <p className="text-[#736E6E] text-sm sm:text-base md:text-md my-2 font-medium">
        Đã hoàn thành{" "}
        <span className="text-[#3EC474] font-semibold">{completedCount}</span>/
        {totalCount} bài học
      </p>
    </div>
  )
);

LessonStats.displayName = "LessonStats";

// Memoized NoLessons component with improved responsive design
const NoLessons = memo(() => (
  <div className="flex flex-col items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10 min-h-[250px] sm:min-h-[300px] md:min-h-[400px] lg:min-h-[500px] justify-center px-4">
    <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl text-[#736E6E] text-center leading-relaxed font-medium">
      Hiện tại chưa có bài giảng nào!
    </h3>
    <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32">
      <OptimizeImage
        src="/assets/image/no_course.png"
        width={512}
        height={512}
        alt="no_course"
        className="object-contain w-full h-full"
        priority={false}
      />
    </div>
  </div>
));

NoLessons.displayName = "NoLessons";

// Memoized SectionHeader component
const SectionHeader = memo(() => (
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
));

SectionHeader.displayName = "SectionHeader";

function LessonCompleteClient({
  lessonData,
  initialFilterData,
  fetchFilterData
}: LessonCompleteClientProps) {
  const searchParams = useSearchParams();

  // Custom hooks for better separation of concerns
  const { filterValues, updateFilterValues } = useURLSync(searchParams);
  const completedLessons = useLessonFilter(lessonData, filterValues);

  // Memoized filter change handler
  const handleFilterChange = useCallback(
    (newFilterValues: FilterValues) => {
      updateFilterValues(newFilterValues);
    },
    [updateFilterValues]
  );

  // Memoized lesson count
  const lessonCounts = useMemo(
    () => ({
      completed: completedLessons.length,
      total: lessonData.length
    }),
    [completedLessons.length, lessonData.length]
  );

  return (
    <ContentLayout title="BaiGiangHoanThanh">
      <LessonStats
        completedCount={lessonCounts.completed}
        totalCount={lessonCounts.total}
      />

      <div className="bg-white px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6 relative rounded-xl mx-2 sm:mx-4 md:mx-6 lg:mx-0 shadow-sm">
        <div className="flex flex-col gap-4 w-full sm:gap-6 md:flex-row md:items-end md:gap-6 lg:gap-8 md:justify-between">
          <SectionHeader />

          <div className="w-full md:flex-1 lg:max-w-2xl">
            <FilterFacet
              initialFilterData={initialFilterData}
              fetchFilterData={fetchFilterData}
              onFilterChange={handleFilterChange}
            />
          </div>
        </div>

        <PerformanceWrapper
          variant="lesson-grid"
          enableContentVisibility={true}
          className="lesson-grid-container performance-below-fold"
        >
          <div className="mt-4 sm:mt-6 md:mt-8">
            {completedLessons.length > 0 ? (
              <PaginatedContent
                items={completedLessons}
                itemsPerPage={ITEMS_PER_PAGE}
                renderItem={(lessonItem) => (
                  <LessonCard
                    {...lessonItem}
                    classRoomName={lessonItem.className}
                    schoolWeekId={
                      lessonItem.schoolWeekId || lessonItem.schoolWeekID || 0
                    }
                  />
                )}
              />
            ) : (
              <NoLessons />
            )}
          </div>
        </PerformanceWrapper>
      </div>
    </ContentLayout>
  );
}

export default memo(LessonCompleteClient);
