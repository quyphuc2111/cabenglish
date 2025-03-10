// "use client"
// 'use server'
import React, { Suspense } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { serverFetch } from "@/lib/api";

import dynamic from "next/dynamic";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import OverviewPage from "@/components/page/overview-page";
import { fetchFilterData } from "@/actions/filterAction";
import { getAllLessonDataByUserId } from "@/actions/lessonAction";
import { initializeLocked } from "@/actions/lockedAction";
import { initializeProgress } from "@/actions/progressAction";
// import { LectureFavouriteList } from "@/components/page/lecture-favourite-list";
// import { TeachingProgress } from "@/components/page/teaching-progress/teaching-progress";

// const LectureFavouriteList = dynamic(
//   () => import('@/components/page/lecture-favourite-list').then(mod => mod.LectureFavouriteList),
//   { ssr: false }
// )

// const courseData = [
//   {
//     courseTitle: "Unit 1 - Bài học: Từ vựng",
//     courseImage: "/modal/course1.png",
//     courseWeek: "Tuần học 1",
//     courseCategory: "3 - 4 tuổi",
//     courseName: "Bảng chữ cái tiếng anh",
//     courseProgress: 100,
//     courseLike: 668,
//     courseStatus: "started"
//   },
//   {
//     courseTitle: "Unit 2 - Bài học: Chào hỏi",
//     courseImage: "/modal/course2.png",
//     courseWeek: "Tuần học 2",
//     courseCategory: "3 - 4 tuổi",
//     courseName: "Giới thiệu bản thân",
//     courseProgress: 100,
//     courseLike: 568,
//     courseStatus: "started"
//   },
//   {
//     courseTitle: "Unit 3 - Bài học: Màu sắc",
//     courseImage: "/modal/course3.png",
//     courseWeek: "Tuần học 3",
//     courseCategory: "3 - 4 tuổi",
//     courseName: "Khám phá các màu sắc",
//     courseProgress: 100,
//     courseLike: 86,
//     courseStatus: "started"
//   },
//   {
//     courseTitle: "Unit 4 - Bài học: Từ vựng",
//     courseImage: "/modal/course4.png",
//     courseWeek: "Tuần học 1",
//     courseCategory: "3 - 4 tuổi",
//     courseName: "Bảng chữ cái tiếng anh",
//     courseProgress: 100,
//     courseLike: 638,
//     courseStatus: "started"
//   },
//   {
//     courseTitle: "Unit 5 - Bài học: Từ vựng",
//     courseImage: "/modal/course4.png",
//     courseWeek: "Tuần học 51",
//     courseCategory: "3 - 4 tuổi",
//     courseName: "Bảng chữ cái tiếng anh",
//     courseProgress: 100,
//     courseLike: 638,
//     courseStatus: "started"
//   }
// ];

// import axios from 'axios';

// async function getData() {
//   const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://192.168.1.4:7056';

//   // Hàm lấy cookie từ trình duyệt
//   const getCookie = (name: string) => {
//     const value = `; ${document.cookie}`;
//     const parts = value.split(`; ${name}=`);
//     if (parts.length === 2) return parts.pop()?.split(';').shift();
//     return null;
//   };

//   const authToken = getCookie('SmartKids.Auth'); // Lấy token từ cookie
//   console.log("!23", authToken)
//   console.log("!23document", document.cookie);

//   try {
//     const response = await axios.get(`${API_URL}/api/Lesson/user/user1`, {
//       withCredentials: true, // Cho phép gửi cookie
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': authToken ? `Bearer ${authToken}` : '', // Gửi token nếu có
//       },
//     });

//     const responseData = response.data;

//     if (!responseData?.data) {
//       console.warn('Dữ liệu không đúng định dạng:', responseData);
//       return [];
//     }

//     return Array.isArray(responseData.data)
//       ? responseData.data.map((item: any) => ({
//           courseTitle: item.lesson_name || 'Chưa có tên',
//           courseImage: '/modal/course1.png',
//           courseWeek: `Tuần học ${item.order || 1}`,
//           courseCategory: "3 - 4 tuổi",
//           courseName: item.lesson_name?.split(":")[1]?.trim() || 'Chưa có tên',
//           courseProgress: item.progress || 0,
//           courseLike: item.numliked || 0,
//           courseStatus: item.status || 'pending',
//         }))
//       : [];

//   } catch (error: any) {
//     if (axios.isAxiosError(error)) {
//       console.error('Lỗi từ Axios:', error.response?.data || error.message);
//     } else {
//       console.error('Lỗi không xác định:', error);
//     }
//     return [];
//   }
// }

// async function getData({userId}: {userId: string}) {
//   try {
//     const data = await serverFetch(`/api/Lesson/user/${userId}`);
//     return data;
//   } catch (error) {
//     console.error('API Error:', error);
//     return [];
//   }
// }

// Trong component page
export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin");
  }

  // console.log("session", session)

  const courseData = await getAllLessonDataByUserId({
    userId: session.user.userId
  });
  const initialFilterData = await fetchFilterData({
    userId: session.user.userId
  });

  const initialLockedData = await initializeLocked({
    userId: session.user.userId,
    mode: "default"
  });

  const initialProgressData = await initializeProgress(session.user.userId);

  // console.log("initialLockedData", initialLockedData)
  // console.log("initialProgressData", initialProgressData)

  // console.log("courseData", courseData)
  return (
    <ContentLayout title="Dashboard">
      <Suspense fallback={<div>Đang tải...</div>}>
        <OverviewPage
          courseData={courseData.data}
          initialFilterData={initialFilterData}
          fetchFilterData={fetchFilterData}
        />
      </Suspense>
    </ContentLayout>
  );
}
