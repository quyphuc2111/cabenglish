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
import { DashboardLoading } from "@/components/ui/dashboard-loading";

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

  console.log("session.user.userId", session.user.userId);

  return <DashboardContent userId={session.user.userId} />;
}

function DashboardContent({ userId }: { userId: string }) {
  const { dashboardData, isLoading, error, refetch } = useDashboardData(userId);

  // if (isLoading) {
  //   return (
  //     <ContentLayout title="Dashboard">
  //       <DashboardLoading
  //         message="Đang tải dữ liệu dashboard..."
  //         showProgress={true}
  //       />
  //     </ContentLayout>
  //   );
  // }

  if (error) {
    return (
      <ContentLayout title="Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-red-600 mb-2">
              Có lỗi xảy ra
            </h2>
            <p className="text-gray-600 mb-4">{error.message}</p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Thử lại
            </button>
          </div>
        </div>
      </ContentLayout>
    );
  }

  if (!dashboardData) {
    return (
      <ContentLayout title="Dashboard">
        <DashboardLoading
          // message="Đang khởi tạo dữ liệu..."
          showProgress={true}
        />
      </ContentLayout>
    );
  }

  return (
    <ContentLayout title="Dashboard">
      <Suspense
        fallback={<DashboardLoading message="Đang tải components..." />}
      >
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
