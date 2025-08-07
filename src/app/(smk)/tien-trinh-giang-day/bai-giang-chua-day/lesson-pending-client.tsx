"use client";

import React, { useState, useCallback, memo, useMemo } from "react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import SectionTitle from "@/components/common/section-title";
import Image from "next/image";
import { PaginatedContent } from "@/components/common/paginated-content";
import { LessonType } from "@/types/lesson";
import { ClassroomType } from "@/types/classroom";
import LessonCard from "@/components/lesson/lesson-card";
import { getUnitByClassId } from "@/actions/unitsAction";
import { getSchoolWeekByUnitId } from "@/actions/schoolWeekAction";
import { ChevronDown, Users, BookOpen, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

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
          {Icon && <Icon className="w-4 h-4 text-blue-600" />}
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
              "shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500/20",
              "text-sm font-medium",
              // States
              hasValue
                ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 text-blue-900"
                : "bg-white border-gray-200 text-gray-600 hover:border-gray-300",
              disabled &&
                "bg-gray-50 border-gray-200 cursor-not-allowed opacity-60",
              loading && "bg-gray-50 border-gray-200 cursor-wait"
            )}
          >
            <span
              className={cn(
                "truncate",
                hasValue ? "text-blue-900 font-semibold" : "text-gray-500"
              )}
            >
              {loading ? "Đang tải..." : selectedOption?.label || placeholder}
            </span>

            <ChevronDown
              className={cn(
                "w-4 h-4 transition-transform duration-200 flex-shrink-0",
                isOpen && "rotate-180",
                hasValue ? "text-blue-600" : "text-gray-400"
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
                      "hover:bg-blue-50 focus:outline-none focus:bg-blue-50",
                      option.value === value
                        ? "bg-blue-100 text-blue-900 font-semibold"
                        : "text-gray-700 hover:text-blue-800"
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

function LessonPendingClient({
  pendingLessons,
  totalLessons,
  classrooms,
  userId
}: {
  pendingLessons: LessonType[];
  totalLessons: number;
  classrooms: ClassroomType[];
  userId: string;
}) {
  // State cho các filter
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [selectedUnitId, setSelectedUnitId] = useState<string>("");
  const [selectedWeekId, setSelectedWeekId] = useState<string>("");
  const [units, setUnits] = useState<any[]>([]);
  const [schoolWeeks, setSchoolWeeks] = useState<any[]>([]);
  const [loadingUnits, setLoadingUnits] = useState(false);
  const [loadingWeeks, setLoadingWeeks] = useState(false);

  // Lọc bài học theo các filter
  const filteredLessons = useMemo(() => {
    let filtered = [...pendingLessons];

    // Filter theo lớp học
    if (selectedClassId && selectedClassId !== "") {
      filtered = filtered.filter(
        (lesson) => lesson.classId === parseInt(selectedClassId)
      );
    }

    // Filter theo unit
    if (selectedUnitId && selectedUnitId !== "") {
      filtered = filtered.filter(
        (lesson) => lesson.unitId === parseInt(selectedUnitId)
      );
    }

    // Filter theo tuần học
    if (selectedWeekId && selectedWeekId !== "") {
      filtered = filtered.filter((lesson) => {
        const lessonWeekId = lesson.schoolWeekId || lesson.schoolWeekID;
        return lessonWeekId === parseInt(selectedWeekId);
      });
    }

    return filtered;
  }, [pendingLessons, selectedClassId, selectedUnitId, selectedWeekId]);

  // Xử lý thay đổi lớp học
  const handleClassChange = useCallback(
    async (classId: string) => {
      setSelectedClassId(classId);
      setSelectedUnitId(""); // Reset unit khi đổi lớp
      setSelectedWeekId(""); // Reset week khi đổi lớp
      setUnits([]);
      setSchoolWeeks([]); // Reset school weeks khi đổi lớp

      if (classId && classId !== "") {
        setLoadingUnits(true);
        try {
          const unitsResponse = await getUnitByClassId(classId, userId);
          // getUnitByClassId trả về data trực tiếp, không có .data wrapper
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

  // Xử lý thay đổi unit
  const handleUnitChange = useCallback(async (unitId: string) => {
    setSelectedUnitId(unitId);
    setSelectedWeekId(""); // Reset week khi đổi unit
    setSchoolWeeks([]); // Reset school weeks khi đổi unit

    if (unitId && unitId !== "") {
      setLoadingWeeks(true);
      try {
        const weeksResponse = await getSchoolWeekByUnitId({
          unitId: parseInt(unitId)
        });
        // getSchoolWeekByUnitId trả về data trực tiếp
        setSchoolWeeks(Array.isArray(weeksResponse) ? weeksResponse : []);
      } catch (error) {
        console.error("Error loading school weeks:", error);
        setSchoolWeeks([]);
      } finally {
        setLoadingWeeks(false);
      }
    }
  }, []);

  // Xử lý thay đổi tuần học
  const handleWeekChange = useCallback((weekId: string) => {
    setSelectedWeekId(weekId);
  }, []);

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
        <div className="flex flex-col gap-4 w-full sm:gap-6">
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

          {/* Bộ lọc mới - Enhanced UI */}
          <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm">
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
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                    {
                      classrooms.find(
                        (c) => c.class_id.toString() === selectedClassId
                      )?.classname
                    }
                  </span>
                )}
                {selectedUnitId && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full font-medium">
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
