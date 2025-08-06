"use client";
import React, { useMemo, useState, useCallback, memo } from "react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import SectionTitle from "@/components/common/section-title";
import Image from "next/image";
import { PaginatedContent } from "@/components/common/paginated-content";
import { LessonType } from "@/types/lesson";
import { ClassroomType } from "@/types/classroom";
import LessonCard from "@/components/lesson/lesson-card";
import OptimizeImage from "@/components/common/optimize-image";
import PerformanceWrapper from "@/components/common/performance-wrapper";
import { getUnitByClassId } from "@/actions/unitsAction";
import { getSchoolWeekByUnitId } from "@/actions/schoolWeekAction";

const ITEMS_PER_PAGE = 8;

// Types
interface LessonCompleteClientProps {
  lessonData: LessonType[];
  classrooms: ClassroomType[];
  userId: string;
}

// Custom hook for lesson filtering
const useLessonFilter = (
  lessonData: LessonType[],
  selectedClassId: string,
  selectedUnitId: string,
  selectedWeekId: string
) => {
  return useMemo(() => {
    // Filter completed lessons (progress >= 1)
    const completedLessons = lessonData.filter(
      (lesson) => Number(lesson.progress) >= 1
    );

    let filtered = [...completedLessons];

    // Filter by class
    if (selectedClassId && selectedClassId !== "") {
      filtered = filtered.filter(
        (lesson) => lesson.classId === parseInt(selectedClassId)
      );
    }

    // Filter by unit
    if (selectedUnitId && selectedUnitId !== "") {
      filtered = filtered.filter(
        (lesson) => lesson.unitId === parseInt(selectedUnitId)
      );
    }

    // Filter by school week
    if (selectedWeekId && selectedWeekId !== "") {
      filtered = filtered.filter((lesson) => {
        const lessonWeekId = lesson.schoolWeekId || lesson.schoolWeekID;
        return lessonWeekId === parseInt(selectedWeekId);
      });
    }

    return filtered;
  }, [lessonData, selectedClassId, selectedUnitId, selectedWeekId]);
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
  classrooms,
  userId
}: LessonCompleteClientProps) {
  // Local state for filters - no URL params
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedUnitId, setSelectedUnitId] = useState("");
  const [selectedWeekId, setSelectedWeekId] = useState("");

  const completedLessons = useLessonFilter(
    lessonData,
    selectedClassId,
    selectedUnitId,
    selectedWeekId
  );

  // State for filter options
  const [units, setUnits] = useState<any[]>([]);
  const [schoolWeeks, setSchoolWeeks] = useState<any[]>([]);
  const [loadingUnits, setLoadingUnits] = useState(false);
  const [loadingWeeks, setLoadingWeeks] = useState(false);

  // Handle class change
  const handleClassChange = useCallback(
    async (classId: string) => {
      setSelectedClassId(classId);
      setSelectedUnitId(""); // Reset unit when changing class
      setSelectedWeekId(""); // Reset week when changing class
      setUnits([]);
      setSchoolWeeks([]); // Reset school weeks when changing class

      if (classId && classId !== "") {
        setLoadingUnits(true);
        try {
          const unitsResponse = await getUnitByClassId(classId, userId);
          setUnits(
            Array.isArray(unitsResponse)
              ? unitsResponse
              : unitsResponse.data || []
          );
        } catch (error) {
          console.error("Error loading units:", error);
          setUnits([]);
        } finally {
          setLoadingUnits(false);
        }
      }
    },
    [userId]
  );

  // Handle unit change
  const handleUnitChange = useCallback(async (unitId: string) => {
    setSelectedUnitId(unitId);
    setSelectedWeekId(""); // Reset week when changing unit
    setSchoolWeeks([]); // Reset school weeks when changing unit

    if (unitId && unitId !== "") {
      setLoadingWeeks(true);
      try {
        const weeksResponse = await getSchoolWeekByUnitId({
          unitId: parseInt(unitId)
        });
        setSchoolWeeks(Array.isArray(weeksResponse) ? weeksResponse : []);
      } catch (error) {
        console.error("Error loading school weeks:", error);
        setSchoolWeeks([]);
      } finally {
        setLoadingWeeks(false);
      }
    }
  }, []);

  // Handle week change
  const handleWeekChange = useCallback((weekId: string) => {
    setSelectedWeekId(weekId);
  }, []);

  // Memoized lesson count
  const lessonCounts = useMemo(
    () => ({
      completed: completedLessons.length,
      total: lessonData.filter((lesson) => Number(lesson.progress) >= 1).length
    }),
    [completedLessons.length, lessonData]
  );

  // Memoized render function for lesson cards
  const renderLessonCard = useCallback(
    (lessonItem: LessonType) => (
      <LessonCard
        {...lessonItem}
        classRoomName={lessonItem.className}
        schoolWeekId={lessonItem.schoolWeekId || lessonItem.schoolWeekID || 0}
        key={`completed-${lessonItem.lessonId}`}
      />
    ),
    []
  );

  return (
    <ContentLayout title="BaiGiangHoanThanh">
      <LessonStats
        completedCount={lessonCounts.completed}
        totalCount={lessonCounts.total}
      />

      <div className="bg-white px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6 relative rounded-xl mx-2 sm:mx-4 md:mx-6 lg:mx-0 shadow-sm">
        <div className="flex flex-col gap-4 w-full sm:gap-6">
          <SectionHeader />

          {/* Bộ lọc mới */}
          <div className="flex flex-col sm:flex-row gap-4 bg-gray-50 p-4 rounded-lg">
            {/* Filter Lớp học */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chọn lớp học
              </label>
              <select
                value={selectedClassId}
                onChange={(e) => handleClassChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tất cả lớp học</option>
                {classrooms.map((classroom) => (
                  <option key={classroom.class_id} value={classroom.class_id}>
                    {classroom.classname}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Unit */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chọn đơn vị học
              </label>
              <select
                value={selectedUnitId}
                onChange={(e) => handleUnitChange(e.target.value)}
                disabled={!selectedClassId || loadingUnits}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Tất cả đơn vị học</option>
                {units.map((unit) => (
                  <option key={unit.unitId} value={unit.unitId}>
                    {unit.unitName}
                  </option>
                ))}
              </select>
              {loadingUnits && (
                <p className="text-sm text-gray-500 mt-1">Đang tải...</p>
              )}
            </div>

            {/* Filter Tuần học */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chọn tuần học
              </label>
              <select
                value={selectedWeekId}
                onChange={(e) => handleWeekChange(e.target.value)}
                disabled={!selectedUnitId || loadingWeeks}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Tất cả tuần học</option>
                {schoolWeeks.map((week) => (
                  <option key={week.swId} value={week.swId}>
                    Tuần {week.value}
                  </option>
                ))}
              </select>
              {loadingWeeks && (
                <p className="text-sm text-gray-500 mt-1">
                  Đang tải tuần học...
                </p>
              )}
            </div>
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
                renderItem={renderLessonCard}
                rowPerPage={4} // Grid responsive: 2 cột trên mobile, 4 cột trên desktop
                itemInPage={[8, 16, 24, 32]} // Options cho items per page
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
