import Link from "next/link";

import PlaceholderContent from "@/components/demo/placeholder-content";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import ClassroomContent from "@/components/class/classroom-content";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function DashboardPage() {
  return (
    <ContentLayout title="Dashboard">
       <ClassroomContent />
    </ContentLayout>
  );
}
