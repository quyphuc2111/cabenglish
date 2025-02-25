"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";
import FilterFacet from "@/components/common/filter-facet";
import { CourseCarousel } from "@/components/carousel/course-carousel";
// import Video from "next-video";

interface LectureFavouriteListProps {
  courseData: any[];
}

export function LectureFavouriteList({
  courseData
}: LectureFavouriteListProps) {
  const [isMounted, setIsMounted] = useState(false);
  const { t } = useTranslation("", "common");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

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
     {/* <video width="40" height="40" className="w-8 h-8 md:w-10 md:h-10" autoPlay loop muted playsInline>
  <source src="/book.mp4" type="video/webm"  />
</video> */}
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

          <div className="w-full md:w-3/4">
            <FilterFacet />
          </div>

          <div className="hidden lg:flex gap-20 absolute top-0 right-[12%]">
            <Image src="/rank.gif" alt="rank" width={40} height={40} />
            <Image src="/rank.gif" alt="rank" width={40} height={40} />
          </div>
        </div>

        <div className="relative pt-3 md:pt-5">
          <CourseCarousel courseData={courseData} />
        </div>
      </div>
    </div>
  );
}
