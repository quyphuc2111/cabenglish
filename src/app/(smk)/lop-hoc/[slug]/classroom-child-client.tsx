"use client";
import React from "react";
import { BreadcrumbLayout } from "@/components/admin-panel/breadcrumb-layout";
import ClassroomWrapper from "@/components/common/classroom-wrapper";
import FilterClassroom from "@/components/common/filter-classroom";
import { PaginatedContent } from "@/components/common/paginated-content";
import { formatSlug } from "@/lib/utils";
import { LessonType } from "@/types/lesson";
import LessonCard from "@/components/lesson/lesson-card";
import { SectionType } from "@/types/section";
import { useRouter } from "next/navigation";
import FilterFacet from "@/components/common/filter-facet";

function ClassroomChildClient({
  slug,
  lessonData,
  initialFilterData,
  fetchFilterData
}: {
  slug: string;
  lessonData: LessonType[];
  initialFilterData: any;
  fetchFilterData: any;
}) {
  const [filteredLessons, setFilteredLessons] = React.useState<LessonType[]>(lessonData);
  const formattedSlug = formatSlug(slug);
  const router = useRouter();

  // Định dạng lại title để hiển thị
  const formatTitle = (slug: string) => {
    return decodeURIComponent(slug)
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleLessonClick = async (lessonId: number) => {
    router.push(`/lesson/${lessonId}`);
  };

  const handleFilterChange = async (filterValues: {
    classId: string;
    unitId: string;
    userId: string;
  }) => {
    const filtered = lessonData.filter(lesson => {
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
    <BreadcrumbLayout title={formatTitle(formattedSlug)}>
      <ClassroomWrapper>
        <div className="flex items-center gap-8">
          <FilterFacet
            initialFilterData={initialFilterData}
            fetchFilterData={fetchFilterData}
            onFilterChange={handleFilterChange}
          />
        </div>
        <PaginatedContent
          items={filteredLessons}
          itemsPerPage={8}
          renderItem={(lessonItem) => {
            const lessonItemData = {
              ...lessonItem,
              classRoomName: lessonItem.className,
              schoolWeek: lessonItem.schoolWeekId
            };

            return (
              <LessonCard
                {...lessonItemData}
                onClick={() => handleLessonClick(lessonItem.lessonId)}
              />
            );
          }}
          itemInPage={[8, 16, 24, 32, 40]}
          rowPerPage={4}
        />
      </ClassroomWrapper>
    </BreadcrumbLayout>
  );
}

export default ClassroomChildClient;
