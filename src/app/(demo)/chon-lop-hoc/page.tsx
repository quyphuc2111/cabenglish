import { ContentLayout } from "@/components/admin-panel/content-layout";
import GradeSelection from "@/components/grade-selection/grade-selection-content";

export default function GradeSelectionPage() {
  return (
    <ContentLayout title="Chọn lớp học">
      <GradeSelection />
    </ContentLayout>
  );
}
