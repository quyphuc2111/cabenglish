import React from "react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import CourseDetailContent from "@/components/course-detail/course-detail-content";
import { cabKid4Units } from "@/mock/course-units";

function MainUnit() {
  return (
    <ContentLayout title="CAB Kid 4" type="course">
      <CourseDetailContent 
        courseTitle="CAB Kid 4"
        units={cabKid4Units}
        grade={4}
      />
    </ContentLayout>
  );
}

export default MainUnit;
