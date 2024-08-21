import { ContentLayout } from "@/components/admin-panel/content-layout";
import CourseBound from "@/components/course-card/course-bound";
import CourseNew from "@/components/course-card/course-new";
import React from "react";

function MainCourse() {
  return (
    <ContentLayout title="GiftShop">
      <div className="flex flex-col gap-5">
        <div>
          <h2 className="font-semibold text-lg mb-4">Khoá học mới ra mắt</h2>
          <div className="grid grid-cols-3 gap-5">
            <CourseNew />
            <CourseNew />
          </div>
        </div>

        <div>
          <h2 className="font-semibold text-lg mb-4">Khoá học tiếng anh</h2>
          <div className="grid grid-cols-5 gap-5">
            <CourseBound />
            <CourseBound />
            <CourseBound />
            <CourseBound />
            <CourseBound />
            <CourseBound />
            <CourseBound />
          </div>
        </div>
      </div>
    </ContentLayout>
  );
}

export default MainCourse;
