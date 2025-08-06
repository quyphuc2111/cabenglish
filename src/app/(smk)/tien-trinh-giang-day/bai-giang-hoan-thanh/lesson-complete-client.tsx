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
import { ChevronDown, Users, BookOpen, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

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

// Custom Select Component with better styling
const CustomSelect = memo(
  ({
    value,
    onChange,
    options,
    placeholder,
    disabled = false,
    loading = false,
    icon: Icon,
    label
  }: {
    value: string;
    onChange: (value: string) => void;
    options: Array<{ value: string; label: string }>;
    placeholder: string;
    disabled?: boolean;
    loading?: boolean;
    icon?: any;
    label: string;
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedOption = options.find((opt) => opt.value === value);
    const hasValue = value && value !== "";

    return (
      <div className="relative">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2">
          {Icon && <Icon className="w-4 h-4 text-green-600" />}
          {label}
        </label>

        <div className="relative">
          <button
            type="button"
            onClick={() => !disabled && !loading && setIsOpen(!isOpen)}
            disabled={disabled || loading}
            className={cn(
              "w-full px-4 py-3 text-left border-2 rounded-xl transition-all duration-200",
              "flex items-center justify-between gap-2",
              "shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500/20",
              "text-sm font-medium",
              // States
              hasValue
                ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-900"
                : "bg-white border-gray-200 text-gray-600 hover:border-gray-300",
              disabled &&
                "bg-gray-50 border-gray-200 cursor-not-allowed opacity-60",
              loading && "bg-gray-50 border-gray-200 cursor-wait"
            )}
          >
            <span
              className={cn(
                "truncate",
                hasValue ? "text-green-900 font-semibold" : "text-gray-500"
              )}
            >
              {loading ? "Đang tải..." : selectedOption?.label || placeholder}
            </span>

            <ChevronDown
              className={cn(
                "w-4 h-4 transition-transform duration-200 flex-shrink-0",
                isOpen && "rotate-180",
                hasValue ? "text-green-600" : "text-gray-400"
              )}
            />
          </button>

          {isOpen && !disabled && !loading && (
            <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border-2 border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
              <div className="py-2">
                {options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full px-4 py-2.5 text-left text-sm transition-colors duration-150",
                      "hover:bg-green-50 focus:outline-none focus:bg-green-50",
                      option.value === value
                        ? "bg-green-100 text-green-900 font-semibold"
                        : "text-gray-700 hover:text-green-800"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Overlay to close dropdown */}
        {isOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>
    );
  }
);

CustomSelect.displayName = "CustomSelect";

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

          {/* Bộ lọc mới - Enhanced UI */}
          <div className="bg-gradient-to-br from-gray-50 to-green-50/30 p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
              {/* Filter Lớp học */}
              <div className="flex-1 min-w-0">
                <CustomSelect
                  value={selectedClassId}
                  onChange={handleClassChange}
                  options={[
                    { value: "", label: "Tất cả lớp học" },
                    ...classrooms.map((classroom) => ({
                      value: classroom.class_id.toString(),
                      label: classroom.classname
                    }))
                  ]}
                  placeholder="Chọn lớp học"
                  icon={Users}
                  label="Lớp học"
                />
              </div>

              {/* Filter Unit */}
              <div className="flex-1 min-w-0">
                <CustomSelect
                  value={selectedUnitId}
                  onChange={handleUnitChange}
                  options={[
                    { value: "", label: "Tất cả đơn vị học" },
                    ...units.map((unit) => ({
                      value: unit.unitId.toString(),
                      label: unit.unitName
                    }))
                  ]}
                  placeholder="Chọn đơn vị học"
                  disabled={!selectedClassId}
                  loading={loadingUnits}
                  icon={BookOpen}
                  label="Đơn vị học"
                />
              </div>

              {/* Filter Tuần học */}
              <div className="flex-1 min-w-0">
                <CustomSelect
                  value={selectedWeekId}
                  onChange={handleWeekChange}
                  options={[
                    { value: "", label: "Tất cả tuần học" },
                    ...schoolWeeks.map((week) => ({
                      value: week.swId.toString(),
                      label: `Tuần ${week.value}`
                    }))
                  ]}
                  placeholder="Chọn tuần học"
                  disabled={!selectedUnitId}
                  loading={loadingWeeks}
                  icon={Calendar}
                  label="Tuần học"
                />
              </div>
            </div>

            {/* Filter status indicator */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-gray-600 font-medium">
                  Bộ lọc đang áp dụng:
                </span>
                {selectedClassId && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full font-medium">
                    {
                      classrooms.find(
                        (c) => c.class_id.toString() === selectedClassId
                      )?.classname
                    }
                  </span>
                )}
                {selectedUnitId && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                    {
                      units.find((u) => u.unitId.toString() === selectedUnitId)
                        ?.unitName
                    }
                  </span>
                )}
                {selectedWeekId && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full font-medium">
                    Tuần{" "}
                    {
                      schoolWeeks.find(
                        (w) => w.swId.toString() === selectedWeekId
                      )?.value
                    }
                  </span>
                )}
                {!selectedClassId && !selectedUnitId && !selectedWeekId && (
                  <span className="text-gray-500 italic">Hiển thị tất cả</span>
                )}
              </div>
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
