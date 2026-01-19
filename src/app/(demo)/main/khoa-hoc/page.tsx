import { ContentLayout } from "@/components/admin-panel/content-layout";
import CourseSelection from "@/components/course-selection/course-selection-content";

function MainCourse() {
  return (
    <ContentLayout title="Khóa học">
      <CourseSelection />
    </ContentLayout>
  );
}

export default MainCourse;
