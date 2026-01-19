import { ContentLayout } from "@/components/admin-panel/content-layout";
import ClassroomContent from "@/components/class/classroom-content";

export default function DashboardPage() {
  return (
    <ContentLayout title="Lớp học">
       <ClassroomContent />
    </ContentLayout>
  );
}
