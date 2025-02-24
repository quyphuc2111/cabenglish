"use client";

import React from "react";
import dynamic from "next/dynamic";

const LectureFavouriteList = dynamic(
  () => import("./lecture-favourite-list").then((mod) => mod.LectureFavouriteList),
  { ssr: false }
);

const TeachingProgress = dynamic(
  () => import("./teaching-progress/teaching-progress").then((mod) => mod.TeachingProgress),
  { ssr: false }
);

interface OverviewPageProps {
  courseData: any[];
}

function OverviewPage({ courseData }: OverviewPageProps) {
  return (
    <div>
      <LectureFavouriteList courseData={courseData} />
      <TeachingProgress courseData={courseData} />
    </div>
  );
}

export default OverviewPage;
