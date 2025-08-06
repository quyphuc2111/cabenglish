"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";
import FilterFacet from "@/components/common/filter-facet";
import { CourseCarousel } from "@/components/carousel/course-carousel";
import OptimizeImage from "@/components/common/optimize-image";

interface LectureFavouriteListProps {
  courseData: any[];
  initialFilterData: any;
  fetchFilterData: ({
    classId,
    unitId,
    userId
  }: {
    classId?: string;
    unitId?: string;
    userId?: string;
  }) => Promise<any>;
  onDataRefetch?: () => Promise<void>;
}

export function LectureFavouriteList({
  courseData,
  initialFilterData,
  fetchFilterData,
  onDataRefetch
}: LectureFavouriteListProps) {
  const [isMounted, setIsMounted] = useState(false);

  // Sử dụng cùng format với FilterFacet
  const [filterValues, setFilterValues] = useState({
    classId: "",
    unitId: "",
    userId: "",
    weekId: "" // Sử dụng weekId để match với FilterFacet
  });

  // State để track những lesson đang trong quá trình removing
  const [removingLessons, setRemovingLessons] = useState<Set<number>>(
    new Set()
  );

  const { t } = useTranslation("", "common");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Debug khi courseData thay đổi - clear removing lessons khi data update
  useEffect(() => {
    // Clear removing lessons khi data update (sau khi refetch hoàn tất)
    setRemovingLessons(new Set());
  }, [courseData]);

  // Callback để trigger fadeout và refetch data từ server
  const handleLikeUpdate = useCallback(
    async (lessonId: number, newLikeCount: number) => {
      // Nếu unlike (newLikeCount = 0), thêm vào removing list và trigger fadeout
      if (newLikeCount === 0) {
        setRemovingLessons((prev) => new Set([...prev, lessonId]));

        // Delay để animation fadeout có thời gian chạy
        setTimeout(async () => {
          if (onDataRefetch) {
            await onDataRefetch();
          }
        }, 800); // 800ms để animation fadeout hoàn thành
      } else {
        // Nếu like, refetch ngay lập tức
        if (onDataRefetch) {
          await onDataRefetch();
        }
      }
    },
    [onDataRefetch]
  );

  if (!isMounted) {
    return null;
  }

  const filteredLessonData = courseData
    .filter((item) => {
      const matchesLocked = !item.isLocked;
      const matchesProgress =
        item.numLiked > 0 || removingLessons.has(item.lessonId); // Include removing lessons
      const matchesClass =
        !filterValues.classId || item.classId === Number(filterValues.classId);
      const matchesUnit =
        !filterValues.unitId || item.unitId === Number(filterValues.unitId);

      // Thử nhiều cách so sánh school week
      const matchesSchoolWeek =
        !filterValues.weekId ||
        item.schoolWeekId === Number(filterValues.weekId) ||
        String(item.schoolWeekId) === filterValues.weekId ||
        item.schoolWeek === Number(filterValues.weekId) ||
        String(item.schoolWeek) === filterValues.weekId;

      return (
        matchesClass &&
        matchesUnit &&
        matchesLocked &&
        matchesSchoolWeek &&
        matchesProgress
      );
    })
    .sort((a, b) => {
      const dateA = a.updatedAt || a.createdAt || a.lessonId;
      const dateB = b.updatedAt || b.createdAt || b.lessonId;
      return dateB - dateA;
    })
    .slice(0, 20);

  const handleFilterChange = (newFilterValues: typeof filterValues) => {
    setFilterValues(newFilterValues);
  };

  return (
    <div className="px-0 md:px-0 w-full">
      {/* Header with title */}
      <div className="flex items-center w-max gap-3 px-4 pt-3  bg-white rounded-t-xl">
        <Image
          src="/favourite.png"
          alt="favourite"
          width={30}
          height={30}
          className="w-6 h-6 md:w-8 md:h-8"
        />
        <h3 className="font-bold text-gray-800 ">{t("favourite")}</h3>
      </div>
      <div className="bg-white px-3 md:px-7 py-3 md:py-5  relative rounded-tr-xl rounded-b-xl ">
        {/* Filter section */}
        <div className="mb-4 md:mb-6 ">
          <FilterFacet
            initialFilterData={initialFilterData}
            fetchFilterData={fetchFilterData}
            onFilterChange={handleFilterChange}
          />
        </div>

        {/* Decorative images (hidden on mobile) */}
        <div className="hidden lg:flex gap-20 absolute -top-1 right-7 lg:right-[5%]">
          <Image src="/rank.gif" alt="rank" width={40} height={40} />
          <Image src="/rank.gif" alt="rank" width={40} height={40} />
        </div>

        <div className="relative pt-3">
          {filteredLessonData.length > 0 ? (
            <CourseCarousel
              courseData={filteredLessonData}
              onLikeUpdate={handleLikeUpdate}
              removingLessons={removingLessons}
            />
          ) : (
            <div className="flex justify-center items-center min-h-[200px] sm:min-h-[250px] md:min-h-[280px] h-full flex-col gap-4 sm:gap-8 md:gap-12">
              <p className="text-center text-base sm:text-lg md:text-2xl text-[#736E6E] font-medium px-2">
                Hiện tại chưa có bài học nào được yêu thích !
              </p>
              <OptimizeImage
                src="/assets/image/lesson/no_favourite_lesson.webp"
                alt="no-data"
                width={100}
                height={100}
                className="w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] md:w-[130px] md:h-[130px]"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
