"use client";

import React, { useState } from "react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import SectionTitle from "@/components/common/section-title";
import FilterFacet from "@/components/common/filter-facet";
import Image from "next/image";
import { PaginatedContent } from "@/components/common/paginated-content";
import { LessonType } from "@/types/lesson";
import LessonCard from "@/components/lesson/lesson-card";

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
  const [filteredLessons, setFilteredLessons] = useState<LessonType[]>(pendingLessons);

  const handleFilterChange = async (filterValues: {
    classId: string;
    unitId: string;
    userId: string;
  }) => {
    // Lọc bài học dựa trên các giá trị filter
    const filtered = pendingLessons.filter(lesson => {
      if (filterValues.classId && lesson.classId !== parseInt(filterValues.classId)) {
        return false;
      }
      if (filterValues.unitId && lesson.unitId !== parseInt(filterValues.unitId)) {
        return false;
      }
      return true;
    });
    
    setFilteredLessons(filtered);
  };

  return (
    <ContentLayout title="BaiGiangChuaDay">
      <p className="text-[#736E6E] text-md ml-8">
        Còn lại {filteredLessons.length}/{totalLessons} bài học chưa dạy
      </p>
      <div className="bg-white px-5 py-2 relative rounded-xl min-h-screen  ">
        <div className="flex gap-20 absolute top-0 right-[12%]">
          <Image src="/rank.gif" alt="rank" width={40} height={40} />
          <Image src="/rank.gif" alt="rank" width={40} height={40} />
        </div>
        <div className="flex items-center gap-8">
          <SectionTitle
            title="Bài giảng chưa dạy"
            image={{
              src: "/assets/gif/book_animate.gif",
              width: 40,
              height: 40,
              alt: "book_animate"
            }}
            wrapperClassName="border-[#3EC474]"
          />
          <FilterFacet
            initialFilterData={initialFilterData}
            fetchFilterData={fetchFilterData}
            onFilterChange={handleFilterChange}
          />
        </div>

        {filteredLessons.length > 0 ? (
          <PaginatedContent
            items={filteredLessons}
            itemsPerPage={8}
            renderItem={(lessonItem) => (
              <LessonCard
                {...lessonItem}
                classRoomName={lessonItem.className}
              />
            )}
          />
        ) : (
          <div className="flex flex-col items-center gap-10 h-full justify-center">
            <h3 className="text-3xl text-[#736E6E]">
              Hiện tại chưa có bài giảng nào!
            </h3>
            <div className="w-36 h-36">
              <Image
                src="/assets/image/no_course.png"
                width={512}
                height={512}
                alt="no_course"
                className="object-contain"
              />
            </div>
          </div>
        )}
      </div>
    </ContentLayout>
  );
}

export default LessonPendingClient;
