"use client";

import React, { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { ClassroomType } from "@/types/classroom";
import { useModal } from "@/hooks/useModalStore";
import { useSession } from "next-auth/react";
import { DashboardClientService } from "@/services/dashboard.client.service";
import { useUserInfo } from "@/hooks/useUserInfo";

const LectureFavouriteList = dynamic(
  () =>
    import("./lecture-favourite-list").then((mod) => mod.LectureFavouriteList),
  { ssr: false }
);

const TeachingProgress = dynamic(
  () =>
    import("./teaching-progress/teaching-progress").then(
      (mod) => mod.TeachingProgress
    ),
  { ssr: false }
);

interface OverviewPageProps {
  courseData: any[];
  initialFilterData: any;
  fetchFilterData: ({
    classId,
    unitId,
    userId
  }: {
    classId?: string;
    unitId?: string;
    userId?: string;
  }) => Promise<any>;
  classroomData: ClassroomType[];
}

function OverviewPage({
  courseData: initialCourseData,
  initialFilterData,
  fetchFilterData,
  classroomData
}: OverviewPageProps) {
  const { onOpen } = useModal();
  const { data: session } = useSession();
  const { data: userInfo } = useUserInfo(session?.user?.userId);
  const currentTheme = userInfo?.theme;
  
  const [courseData, setCourseData] = useState(initialCourseData);
  const [isRefetching, setIsRefetching] = useState(false);

  useEffect(() => {
    if (session && session.user.is_firstlogin) {
     
      onOpen("teachingMode");
    }
  }, [session])


  const refetchCourseData = useCallback(async () => {
    if (!session?.user?.userId || isRefetching) {
      return;
    }
    
    try {
      setIsRefetching(true);
      
      const dashboardData = await DashboardClientService.fetchDashboardData(
        session.user.userId,
        session.user.mode as "default" | "free"
      );
      
      setCourseData(dashboardData.courseData);
    } catch (error) {
      console.error("❌ Error refetching course data:", error);
    } finally {
      setIsRefetching(false);
    }
  }, [session?.user?.userId, session?.user?.mode, isRefetching, courseData]);

  return (
    <div className="w-full">
      <LectureFavouriteList
        courseData={courseData}
        initialFilterData={initialFilterData}
        fetchFilterData={fetchFilterData}
        onDataRefetch={refetchCourseData}
      />
      <TeachingProgress 
        courseData={courseData} 
        classroomData={classroomData}  
        currentTheme={currentTheme}
        onDataRefetch={refetchCourseData}
      />
    </div>
  );
}

export default OverviewPage;
