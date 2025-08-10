"use client";

import React, { Suspense } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import OverviewPage from "@/components/page/overview-page";
import { fetchFilterData } from "@/actions/filterAction";
import { useDashboardData } from "@/hooks/useDashboardData";
import { Loading } from "@/components/ui/loading";

export default function DashboardPage() {
  const { data: session, status } = useSession();

  // Redirect nếu chưa đăng nhập
  useEffect(() => {
    if (status === "loading") return; // Đợi session load
    if (!session) {
      redirect("/signin-v2");
    }
  }, [session, status]);

  // Hiển thị loading khi đang check session
  if (status === "loading") {
    return (
      <ContentLayout title="Dashboard">
        <Loading />
      </ContentLayout>
    );
  }

  // Redirect nếu không có session
  if (!session) {
    redirect("/signin-v2");
    return null;
  }

  if (!session.user.userId) {
    throw new Error("User ID is undefined");
  }

  return <DashboardContent userId={session.user.userId} />;
}

function DashboardContent({ userId }: { userId: string }) {
  const { dashboardData, isLoading, error } = useDashboardData(userId);

  if (isLoading) {
    return (
      <ContentLayout title="Dashboard">
        <Loading />
      </ContentLayout>
    );
  }

  if (error) {
    return (
      <ContentLayout title="Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-red-600 mb-2">Có lỗi xảy ra</h2>
            <p className="text-gray-600">{error.message}</p>
          </div>
        </div>
      </ContentLayout>
    );
  }

  if (!dashboardData) {
    return (
      <ContentLayout title="Dashboard">
        <Loading />
      </ContentLayout>
    );
  }

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
