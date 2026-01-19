import React from "react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import CourseDetailContent from "@/components/course-detail/course-detail-content";
import { cabKid3Units } from "@/mock/course-units";

function MainUnit() {
  return (
    <ContentLayout title="CAB Kid 3" type="course">
      <CourseDetailContent 
        courseTitle="CAB Kid 3"
        units={cabKid3Units}
      />
    </ContentLayout>
  );
}

export default MainUnit;
