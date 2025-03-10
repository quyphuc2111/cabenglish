"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";
import FilterFacet from "@/components/common/filter-facet";
import { CourseCarousel } from "@/components/carousel/course-carousel";
import LessonCard from "@/components/lesson/lesson-card";
import OptimizeImage from "@/components/common/optimize-image";
import dynamic from "next/dynamic";

// const FilterSection = dynamic(() => import("./filter-section"), {
//   ssr: true,
//   loading: () => <div>Loading...</div>
// });

interface LectureFavouriteListProps {
  courseData: any[];
  initialFilterData: any;
  fetchFilterData: ({classId, unitId, userId}: {classId?: string, unitId?: string, userId?: string}) => Promise<any>;
}

export function LectureFavouriteList({
  courseData,
  initialFilterData,
  fetchFilterData
}: LectureFavouriteListProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [filterValues, setFilterValues] = useState({
    classId: '',
    unitId: '',
    schoolWeekId: '',
    userId: ''
  });
  const { t } = useTranslation("", "common");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const filteredLessonData = courseData.filter((item) => {
    const matchesLocked = !item.isLocked;
    const matchesProgress = item.numLiked > 0;
    const matchesClass = !filterValues.classId || item.classId === Number(filterValues.classId);
    const matchesUnit = !filterValues.unitId || item.unitId === Number(filterValues.unitId);
    const matchesSchoolWeek = !filterValues.schoolWeekId || item.schoolWeekId === Number(filterValues.schoolWeekId);
    // const matchesUser = !filterValues.userId || item.userId === filterValues.userId;
    // console.log("item", item)

    // matchesProgress &&&& matchesUser
    return  matchesClass && matchesUnit  && matchesLocked && matchesSchoolWeek && matchesProgress;
  });

  const handleFilterChange = (newFilterValues: typeof filterValues) => {
    setFilterValues(newFilterValues);
  };

  return (
    <div className="px-4 md:px-0">
      <div className="flex items-center gap-2">
        <Image
          src="/book.gif"
          alt="book"
          width={40}
          height={40}
          className="w-8 h-8 md:w-10 md:h-10"
        />
        <p className="text-lg md:text-xl text-[#555555] font-medium">
          {t("listOfLecture")}
        </p>
      </div>

      <div className="bg-white px-3 md:px-7 py-3 md:py-5 my-2 relative rounded-xl">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-24">
          <div className="flex items-center gap-3 border-b-4 border-[#EA69AE]/50 w-fit pr-6 pb-1">
            <Image
              src="/favourite.png"
              alt="favourite"
              width={30}
              height={30}
              className="w-6 h-6 md:w-8 md:h-8"
            />
            <p className="text-base md:text-lg">{t("favourite")}</p>
          </div>

          {/* <FilterSection /> */}
          <div className="w-full md:w-3/4">
            <FilterFacet 
              initialFilterData={initialFilterData} 
              fetchFilterData={fetchFilterData}
              onFilterChange={handleFilterChange} 
            />
          </div>

          <div className="hidden lg:flex gap-20 absolute top-0 right-[12%]">
            <Image src="/rank.gif" alt="rank" width={40} height={40} />
            <Image src="/rank.gif" alt="rank" width={40} height={40} />
          </div>
        </div>

        <div className="relative pt-3 md:pt-5">
          {filteredLessonData.length > 0 ? (
            <CourseCarousel courseData={filteredLessonData} />
          ) : (
            <div className="flex justify-center items-center min-h-[280px] h-full flex-col gap-12">
              <p className="text-lg md:text-2xl text-[#736E6E] font-medium">
                Hiện tại chưa có bài học nào được yêu thích !
              </p>
              <OptimizeImage
                src="/assets/image/lesson/no_favourite_lesson.webp"
                alt="no-data"
                width={130}
                height={130}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
