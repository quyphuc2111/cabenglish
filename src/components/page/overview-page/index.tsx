"use client";

import React, { useEffect, useState, useCallback, memo } from "react";
import dynamic from "next/dynamic";
import { ClassroomType } from "@/types/classroom";
import { useModal } from "@/hooks/useModalStore";
import { useSession } from "next-auth/react";
import { DashboardClientService } from "@/services/dashboard.client.service";
import { useUserInfo } from "@/hooks/useUserInfo";
import { useNavigationStore } from "@/store/navigationStore";
import { useNavigationRestore } from "@/hooks/useNavigationRestore";
import CurrentAndNextLecture from "./current-and-next-lecture";
import { useTranslation } from "react-i18next";

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

const OverviewPage = memo(function OverviewPage({
  courseData: initialCourseData,
  initialFilterData,
  fetchFilterData,
  classroomData
}: OverviewPageProps) {
  const { onOpen } = useModal();
  const { data: session } = useSession();
  const { data: userInfo } = useUserInfo(session?.user?.userId);
  const currentTheme = userInfo?.theme;
  const { t } = useTranslation();
  const { overviewState } = useNavigationStore();
  const { isReturningFromLesson } = useNavigationRestore();

  const [courseData, setCourseData] = useState(initialCourseData);
  const [isRefetching, setIsRefetching] = useState(false);

  // Global handler để sync like/unlike giữa tất cả components
  const handleGlobalLikeUpdate = useCallback(
    (lessonId: number, newLikeCount: number) => {
      setCourseData((prevData) =>
        prevData.map((lesson) =>
          lesson.lessonId === lessonId
            ? { ...lesson, numLiked: newLikeCount }
            : lesson
        )
      );
    },
    []
  );

  useEffect(() => {
    if (session && session.user.is_firstlogin) {
      onOpen("teachingMode");
    }
  }, [session]);

  // Khôi phục scroll position khi quay lại từ lesson
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isReturningFromLesson && overviewState?.scrollPosition) {
      setTimeout(() => {
        window.scrollTo(0, overviewState.scrollPosition || 0);
      }, 100);
    }
  }, [isReturningFromLesson, overviewState?.scrollPosition]);

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
    <div className="w-full flex flex-wrap gap-4">
      <CurrentAndNextLecture
        courseData={courseData}
        classroomData={classroomData}
        userId={session?.user?.userId}
        t={t}
        onLikeUpdate={handleGlobalLikeUpdate}
      />
      <LectureFavouriteList
        courseData={courseData}
        initialFilterData={initialFilterData}
        fetchFilterData={fetchFilterData}
        onDataRefetch={refetchCourseData}
        classrooms={classroomData}
        onLikeUpdate={handleGlobalLikeUpdate}
      />
      <TeachingProgress
        courseData={courseData}
        classroomData={classroomData}
        currentTheme={currentTheme}
        onDataRefetch={refetchCourseData}
      />
    </div>
  );
});

export default OverviewPage;
