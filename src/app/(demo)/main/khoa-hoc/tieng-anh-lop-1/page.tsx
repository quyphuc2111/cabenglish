import React from "react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import CourseDetailContent from "@/components/course-detail/course-detail-content";
import { cabKid1Units } from "@/mock/course-units";

function MainUnit() {
  return (
    <ContentLayout title="CAB Kid 1" type="course">
      <CourseDetailContent 
        courseTitle="CAB Kid 1"
        units={cabKid1Units}
      />
    </ContentLayout>
  );
}

export default MainUnit;
