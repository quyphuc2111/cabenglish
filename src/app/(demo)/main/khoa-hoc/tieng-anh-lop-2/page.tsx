import React from "react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import CourseDetailContent from "@/components/course-detail/course-detail-content";
import { cabKid2Units } from "@/mock/course-units";

function MainUnit() {
  return (
    <ContentLayout title="CAB Kid 2" type="course">
      <CourseDetailContent 
        courseTitle="CAB Kid 2"
        units={cabKid2Units}
      />
    </ContentLayout>
  );
}

export default MainUnit;
