import { Suspense } from "react";

import dynamic from 'next/dynamic'

import { ContentLayout } from "@/components/admin-panel/content-layout";
import OverviewPage from "@/components/page/overview-page";
// import { LectureFavouriteList } from "@/components/page/lecture-favourite-list";
// import { TeachingProgress } from "@/components/page/teaching-progress/teaching-progress";

// const LectureFavouriteList = dynamic(
//   () => import('@/components/page/lecture-favourite-list').then(mod => mod.LectureFavouriteList),
//   { ssr: false }
// )

const courseData = [
  {
    courseTitle: "Unit 1 - Bài học: Từ vựng",
    courseImage: "/modal/course1.png",
    courseWeek: "Tuần học 1",
    courseCategory: "3 - 4 tuổi",
    courseName: "Bảng chữ cái tiếng anh",
    courseProgress: 100,
    courseLike: 668,
    courseStatus: "started"
  },
  {
    courseTitle: "Unit 2 - Bài học: Chào hỏi",
    courseImage: "/modal/course2.png",
    courseWeek: "Tuần học 2",
    courseCategory: "3 - 4 tuổi",
    courseName: "Giới thiệu bản thân",
    courseProgress: 100,
    courseLike: 568,
    courseStatus: "started"
  },
  {
    courseTitle: "Unit 3 - Bài học: Màu sắc",
    courseImage: "/modal/course3.png",
    courseWeek: "Tuần học 3",
    courseCategory: "3 - 4 tuổi",
    courseName: "Khám phá các màu sắc",
    courseProgress: 100,
    courseLike: 86,
    courseStatus: "started"
  },
  {
    courseTitle: "Unit 4 - Bài học: Từ vựng",
    courseImage: "/modal/course4.png",
    courseWeek: "Tuần học 1",
    courseCategory: "3 - 4 tuổi",
    courseName: "Bảng chữ cái tiếng anh",
    courseProgress: 100,
    courseLike: 638,
    courseStatus: "started"
  },
  {
    courseTitle: "Unit 5 - Bài học: Từ vựng",
    courseImage: "/modal/course4.png",
    courseWeek: "Tuần học 51",
    courseCategory: "3 - 4 tuổi",
    courseName: "Bảng chữ cái tiếng anh",
    courseProgress: 100,
    courseLike: 638,
    courseStatus: "started"
  }
];

// async function getData() {
//   try {
//     const response = await fetch("http://localhost:5000/api/lessons", {
//       cache: 'no-store'
//     });

//     if (!response.ok) {
//       throw new Error('Không thể tải dữ liệu');
//     }

//     const responseData = await response.json();

//     if (!responseData?.data || !Array.isArray(responseData.data)) {
//       return [];
//     }

//     return responseData.data.map((item: any) => ({
//       courseTitle: item.lesson_name || '',
//       courseImage: '/modal/course1.png',
//       courseWeek: `Tuần học ${item.order || 1}`,
//       courseCategory: "3 - 4 tuổi",
//       courseName: item.lesson_name?.split(":")[1]?.trim() || '',
//       courseProgress: 100,
//       courseLike: item.numliked || 0,
//       courseStatus: 'started',
//     }));

//   } catch (error) {
//     console.error('Lỗi khi tải dữ liệu:', error);
//     return [];
//   }
// }

export default function DashboardPage() {
  // const courseData = await getData();

  return (
    <ContentLayout title="Dashboard">
      <Suspense fallback={<div>Đang tải...</div>}>
        <OverviewPage courseData={courseData} />
      </Suspense>
    </ContentLayout>
  );
}
