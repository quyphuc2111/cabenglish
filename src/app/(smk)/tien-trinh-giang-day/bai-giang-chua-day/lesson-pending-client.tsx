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
