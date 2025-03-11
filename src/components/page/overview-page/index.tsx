"use client";

import React from "react";
import dynamic from "next/dynamic";
import { ClassroomType } from "@/types/classroom";

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
  courseData,
  initialFilterData,
  fetchFilterData,
  classroomData
}: OverviewPageProps) {
  return (
    <div>
      <LectureFavouriteList
        courseData={courseData}
        initialFilterData={initialFilterData}
        fetchFilterData={fetchFilterData}
      />
      <TeachingProgress courseData={courseData} classroomData={classroomData} />
    </div>
  );
}

export default OverviewPage;
