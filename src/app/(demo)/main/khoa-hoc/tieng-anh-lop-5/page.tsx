import React from "react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import CourseDetailContent from "@/components/course-detail/course-detail-content";
import { cabKid5Units } from "@/mock/course-units";

function MainUnit() {
  return (
    <ContentLayout title="CAB Kid 5" type="course">
      <CourseDetailContent 
        courseTitle="CAB Kid 5"
        units={cabKid5Units}
        grade={5}
      />
    </ContentLayout>
  );
}

export default MainUnit;
