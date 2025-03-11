import React, { Suspense } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import OverviewPage from "@/components/page/overview-page";
import { fetchFilterData } from "@/actions/filterAction";
import { DashboardService } from "@/services/dashboard.service";
import { Loading } from "@/components/ui/loading";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin");
  }

  const dashboardData = await DashboardService.fetchDashboardData(session.user.userId);

  return (
    <ContentLayout title="Dashboard">
      <Suspense fallback={<Loading />}>
        <OverviewPage
          courseData={dashboardData.courseData}
          initialFilterData={dashboardData.filterData}
          fetchFilterData={fetchFilterData}
          classroomData={dashboardData.classroomData}
        />
      </Suspense>
    </ContentLayout>
  );
}
