"use client";

import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { NotificationList } from "@/components/notification";
import NotificationDebug from "@/components/notification-debug";

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
  initialFilterData: any;
  fetchFilterData: ({classId, unitId, userId}: {classId?: string, unitId?: string, userId?: string}) => Promise<any>;
}

// const lessonData = [
//   {
//     "unitName": "Unit 1.1",
//     "imageUrl": "http://example.com/lesson.jpg",
//     "schoolWeek": 1,
//     "className": "Classroom 1",
//     "lessonName": "Lesson 1.1.1",
//     "progress": 0,
//     "numLiked": 0,
//     "classId": 1,
//     "unitId": 1,
//     "lessonId": 1,
//     "schoolWeekId": 1,
//     "isLocked": false
//   },
//   {
//     "unitName": "Unit 1.1",
//     "imageUrl": "http://example.com/lesson.jpg",
//     "schoolWeek": 1,
//     "className": "Classroom 1",
//     "lessonName": "Lesson 1.1.2",
//     "progress": 0,
//     "numLiked": 0,
//     "classId": 1,
//     "unitId": 1,
//     "lessonId": 2,
//     "schoolWeekId": 1,
//     "isLocked": true
//   },
//   {
//     "unitName": "Unit 1.1",
//     "imageUrl": "http://example.com/lesson.jpg",
//     "schoolWeek": 1,
//     "className": "Classroom 1",
//     "lessonName": "Lesson 1.1.3",
//     "progress": 0,
//     "numLiked": 0,
//     "classId": 1,
//     "unitId": 1,
//     "lessonId": 3,
//     "schoolWeekId": 1,
//     "isLocked": true
//   },
//   {
//     "unitName": "Unit 1.2",
//     "imageUrl": "http://example.com/lesson.jpg",
//     "schoolWeek": 1,
//     "className": "Classroom 1",
//     "lessonName": "Lesson 1.2.1",
//     "progress": 0,
//     "numLiked": 0,
//     "classId": 1,
//     "unitId": 2,
//     "lessonId": 4,
//     "schoolWeekId": 1,
//     "isLocked": true
//   },
//   {
//     "unitName": "Unit 1.2",
//     "imageUrl": "http://example.com/lesson.jpg",
//     "schoolWeek": 1,
//     "className": "Classroom 1",
//     "lessonName": "Lesson 1.2.2",
//     "progress": 0,
//     "numLiked": 0,
//     "classId": 1,
//     "unitId": 2,
//     "lessonId": 5,
//     "schoolWeekId": 1,
//     "isLocked": true
//   },
//   {
//     "unitName": "Unit 1.2",
//     "imageUrl": "http://example.com/lesson.jpg",
//     "schoolWeek": 1,
//     "className": "Classroom 1",
//     "lessonName": "Lesson 1.2.3",
//     "progress": 0,
//     "numLiked": 0,
//     "classId": 1,
//     "unitId": 2,
//     "lessonId": 6,
//     "schoolWeekId": 1,
//     "isLocked": true
//   },
//   {
//     "unitName": "Unit 1.3",
//     "imageUrl": "http://example.com/lesson.jpg",
//     "schoolWeek": 1,
//     "className": "Classroom 1",
//     "lessonName": "Lesson 1.3.1",
//     "progress": 0,
//     "numLiked": 0,
//     "classId": 1,
//     "unitId": 3,
//     "lessonId": 7,
//     "schoolWeekId": 1,
//     "isLocked": true
//   },
//   {
//     "unitName": "Unit 1.3",
//     "imageUrl": "http://example.com/lesson.jpg",
//     "schoolWeek": 1,
//     "className": "Classroom 1",
//     "lessonName": "Lesson 1.3.2",
//     "progress": 0,
//     "numLiked": 0,
//     "classId": 1,
//     "unitId": 3,
//     "lessonId": 8,
//     "schoolWeekId": 1,
//     "isLocked": true
//   },
//   {
//     "unitName": "Unit 1.3",
//     "imageUrl": "http://example.com/lesson.jpg",
//     "schoolWeek": 1,
//     "className": "Classroom 1",
//     "lessonName": "Lesson 1.3.3",
//     "progress": 0,
//     "numLiked": 0,
//     "classId": 1,
//     "unitId": 3,
//     "lessonId": 9,
//     "schoolWeekId": 1,
//     "isLocked": true
//   },
//   {
//     "unitName": "Unit 2.1",
//     "imageUrl": "http://example.com/lesson.jpg",
//     "schoolWeek": 1,
//     "className": "Classroom 2",
//     "lessonName": "Lesson 2.1.1",
//     "progress": 0,
//     "numLiked": 0,
//     "classId": 2,
//     "unitId": 4,
//     "lessonId": 10,
//     "schoolWeekId": 1,
//     "isLocked": true
//   },
//   {
//     "unitName": "Unit 2.1",
//     "imageUrl": "http://example.com/lesson.jpg",
//     "schoolWeek": 1,
//     "className": "Classroom 2",
//     "lessonName": "Lesson 2.1.2",
//     "progress": 0,
//     "numLiked": 0,
//     "classId": 2,
//     "unitId": 4,
//     "lessonId": 11,
//     "schoolWeekId": 1,
//     "isLocked": true
//   },
//   {
//     "unitName": "Unit 2.1",
//     "imageUrl": "http://example.com/lesson.jpg",
//     "schoolWeek": 1,
//     "className": "Classroom 2",
//     "lessonName": "Lesson 2.1.3",
//     "progress": 0,
//     "numLiked": 0,
//     "classId": 2,
//     "unitId": 4,
//     "lessonId": 12,
//     "schoolWeekId": 1,
//     "isLocked": true
//   },
//   {
//     "unitName": "Unit 2.2",
//     "imageUrl": "http://example.com/lesson.jpg",
//     "schoolWeek": 1,
//     "className": "Classroom 2",
//     "lessonName": "Lesson 2.2.1",
//     "progress": 0,
//     "numLiked": 0,
//     "classId": 2,
//     "unitId": 5,
//     "lessonId": 13,
//     "schoolWeekId": 1,
//     "isLocked": true
//   },
//   {
//     "unitName": "Unit 2.2",
//     "imageUrl": "http://example.com/lesson.jpg",
//     "schoolWeek": 1,
//     "className": "Classroom 2",
//     "lessonName": "Lesson 2.2.2",
//     "progress": 0,
//     "numLiked": 0,
//     "classId": 2,
//     "unitId": 5,
//     "lessonId": 14,
//     "schoolWeekId": 1,
//     "isLocked": true
//   },
//   {
//     "unitName": "Unit 2.2",
//     "imageUrl": "http://example.com/lesson.jpg",
//     "schoolWeek": 1,
//     "className": "Classroom 2",
//     "lessonName": "Lesson 2.2.3",
//     "progress": 0,
//     "numLiked": 0,
//     "classId": 2,
//     "unitId": 5,
//     "lessonId": 15,
//     "schoolWeekId": 1,
//     "isLocked": true
//   },
//   {
//     "unitName": "Unit 2.3",
//     "imageUrl": "http://example.com/lesson.jpg",
//     "schoolWeek": 1,
//     "className": "Classroom 2",
//     "lessonName": "Lesson 2.3.1",
//     "progress": 0,
//     "numLiked": 0,
//     "classId": 2,
//     "unitId": 6,
//     "lessonId": 16,
//     "schoolWeekId": 1,
//     "isLocked": true
//   },
//   {
//     "unitName": "Unit 2.3",
//     "imageUrl": "http://example.com/lesson.jpg",
//     "schoolWeek": 1,
//     "className": "Classroom 2",
//     "lessonName": "Lesson 2.3.2",
//     "progress": 0,
//     "numLiked": 0,
//     "classId": 2,
//     "unitId": 6,
//     "lessonId": 17,
//     "schoolWeekId": 1,
//     "isLocked": true
//   },
//   {
//     "unitName": "Unit 2.3",
//     "imageUrl": "http://example.com/lesson.jpg",
//     "schoolWeek": 1,
//     "className": "Classroom 2",
//     "lessonName": "Lesson 2.3.3",
//     "progress": 0,
//     "numLiked": 0,
//     "classId": 2,
//     "unitId": 6,
//     "lessonId": 18,
//     "schoolWeekId": 1,
//     "isLocked": true
//   },
//   {
//     "unitName": "Unit 3.1",
//     "imageUrl": "http://example.com/lesson.jpg",
//     "schoolWeek": 1,
//     "className": "Classroom 3",
//     "lessonName": "Lesson 3.1.1",
//     "progress": 0,
//     "numLiked": 0,
//     "classId": 3,
//     "unitId": 7,
//     "lessonId": 19,
//     "schoolWeekId": 1,
//     "isLocked": true
//   },
//   {
//     "unitName": "Unit 3.1",
//     "imageUrl": "http://example.com/lesson.jpg",
//     "schoolWeek": 1,
//     "className": "Classroom 3",
//     "lessonName": "Lesson 3.1.2",
//     "progress": 0,
//     "numLiked": 0,
//     "classId": 3,
//     "unitId": 7,
//     "lessonId": 20,
//     "schoolWeekId": 1,
//     "isLocked": true
//   },
//   {
//     "unitName": "Unit 3.1",
//     "imageUrl": "http://example.com/lesson.jpg",
//     "schoolWeek": 1,
//     "className": "Classroom 3",
//     "lessonName": "Lesson 3.1.3",
//     "progress": 0,
//     "numLiked": 0,
//     "classId": 3,
//     "unitId": 7,
//     "lessonId": 21,
//     "schoolWeekId": 1,
//     "isLocked": true
//   },
//   {
//     "unitName": "Unit 3.2",
//     "imageUrl": "http://example.com/lesson.jpg",
//     "schoolWeek": 1,
//     "className": "Classroom 3",
//     "lessonName": "Lesson 3.2.1",
//     "progress": 0,
//     "numLiked": 0,
//     "classId": 3,
//     "unitId": 8,
//     "lessonId": 22,
//     "schoolWeekId": 1,
//     "isLocked": true
//   },
//   {
//     "unitName": "Unit 3.2",
//     "imageUrl": "http://example.com/lesson.jpg",
//     "schoolWeek": 1,
//     "className": "Classroom 3",
//     "lessonName": "Lesson 3.2.2",
//     "progress": 0,
//     "numLiked": 0,
//     "classId": 3,
//     "unitId": 8,
//     "lessonId": 23,
//     "schoolWeekId": 1,
//     "isLocked": true
//   },
//   {
//     "unitName": "Unit 3.2",
//     "imageUrl": "http://example.com/lesson.jpg",
//     "schoolWeek": 1,
//     "className": "Classroom 3",
//     "lessonName": "Lesson 3.2.3",
//     "progress": 0,
//     "numLiked": 0,
//     "classId": 3,
//     "unitId": 8,
//     "lessonId": 24,
//     "schoolWeekId": 1,
//     "isLocked": true
//   },
//   {
//     "unitName": "Unit 3.3",
//     "imageUrl": "http://example.com/lesson.jpg",
//     "schoolWeek": 1,
//     "className": "Classroom 3",
//     "lessonName": "Lesson 3.3.1",
//     "progress": 0,
//     "numLiked": 0,
//     "classId": 3,
//     "unitId": 9,
//     "lessonId": 25,
//     "schoolWeekId": 1,
//     "isLocked": true
//   },
//   {
//     "unitName": "Unit 3.3",
//     "imageUrl": "http://example.com/lesson.jpg",
//     "schoolWeek": 1,
//     "className": "Classroom 3",
//     "lessonName": "Lesson 3.3.2",
//     "progress": 0,
//     "numLiked": 0,
//     "classId": 3,
//     "unitId": 9,
//     "lessonId": 26,
//     "schoolWeekId": 1,
//     "isLocked": true
//   },
//   {
//     "unitName": "Unit 3.3",
//     "imageUrl": "http://example.com/lesson.jpg",
//     "schoolWeek": 1,
//     "className": "Classroom 3",
//     "lessonName": "Lesson 3.3.3",
//     "progress": 0,
//     "numLiked": 0,
//     "classId": 3,
//     "unitId": 9,
//     "lessonId": 27,
//     "schoolWeekId": 1,
//     "isLocked": true
//   },
//   {
//     "unitName": "Unit 4.1",
//     "imageUrl": "http://example.com/lesson.jpg",
//     "schoolWeek": 1,
//     "className": "Classroom 4",
//     "lessonName": "Lesson 4.1.1",
//     "progress": 0,
//     "numLiked": 0,
//     "classId": 4,
//     "unitId": 10,
//     "lessonId": 28,
//     "schoolWeekId": 1,
//     "isLocked": true
//   },
//   {
//     "unitName": "Unit 4.1",
//     "imageUrl": "http://example.com/lesson.jpg",
//     "schoolWeek": 1,
//     "className": "Classroom 4",
//     "lessonName": "Lesson 4.1.2",
//     "progress": 0,
//     "numLiked": 0,
//     "classId": 4,
//     "unitId": 10,
//     "lessonId": 29,
//     "schoolWeekId": 1,
//     "isLocked": true
//   },
//   {
//     "unitName": "Unit 4.1",
//     "imageUrl": "http://example.com/lesson.jpg",
//     "schoolWeek": 1,
//     "className": "Classroom 4",
//     "lessonName": "Lesson 4.1.3",
//     "progress": 0,
//     "numLiked": 0,
//     "classId": 4,
//     "unitId": 10,
//     "lessonId": 30,
//     "schoolWeekId": 1,
//     "isLocked": true
//   },
//   {
//     "unitName": "Unit 4.2",
//     "imageUrl": "http://example.com/lesson.jpg",
//     "schoolWeek": 1,
//     "className": "Classroom 4",
//     "lessonName": "Lesson 4.2.1",
//     "progress": 0,
//     "numLiked": 0,
//     "classId": 4,
//     "unitId": 11,
//     "lessonId": 31,
//     "schoolWeekId": 1,
//     "isLocked": true
//   },
//   {
//     "unitName": "Unit 4.2",
//     "imageUrl": "http://example.com/lesson.jpg",
//     "schoolWeek": 1,
//     "className": "Classroom 4",
//     "lessonName": "Lesson 4.2.2",
//     "progress": 0,
//     "numLiked": 0,
//     "classId": 4,
//     "unitId": 11,
//     "lessonId": 32,
//     "schoolWeekId": 1,
//     "isLocked": true
//   },
//   {
//     "unitName": "Unit 4.2",
//     "imageUrl": "http://example.com/lesson.jpg",
//     "schoolWeek": 1,
//     "className": "Classroom 4",
//     "lessonName": "Lesson 4.2.3",
//     "progress": 0,
//     "numLiked": 0,
//     "classId": 4,
//     "unitId": 11,
//     "lessonId": 33,
//     "schoolWeekId": 1,
//     "isLocked": true
//   },
//   {
//     "unitName": "Unit 4.3",
//     "imageUrl": "http://example.com/lesson.jpg",
//     "schoolWeek": 1,
//     "className": "Classroom 4",
//     "lessonName": "Lesson 4.3.1",
//     "progress": 0,
//     "numLiked": 0,
//     "classId": 4,
//     "unitId": 12,
//     "lessonId": 34,
//     "schoolWeekId": 1,
//     "isLocked": true
//   },
//   {
//     "unitName": "Unit 4.3",
//     "imageUrl": "http://example.com/lesson.jpg",
//     "schoolWeek": 1,
//     "className": "Classroom 4",
//     "lessonName": "Lesson 4.3.2",
//     "progress": 0,
//     "numLiked": 0,
//     "classId": 4,
//     "unitId": 12,
//     "lessonId": 35,
//     "schoolWeekId": 1,
//     "isLocked": true
//   },
//   {
//     "unitName": "Unit 4.3",
//     "imageUrl": "http://example.com/lesson.jpg",
//     "schoolWeek": 1,
//     "className": "Classroom 4",
//     "lessonName": "Lesson 4.3.3",
//     "progress": 0,
//     "numLiked": 0,
//     "classId": 4,
//     "unitId": 12,
//     "lessonId": 36,
//     "schoolWeekId": 1,
//     "isLocked": true
//   }
// ]

// async function updateLessonImage(lesson: any, newImageUrl: string) {
//   try {
//     const updateData = {
//       lessonId: lesson.lessonId,
//       lessonName: lesson.lessonName,
//       imageUrl: newImageUrl,
//       numLiked: 0, // Giữ nguyên là 0 theo curl
//       order: lesson.lessonId, // Sử dụng lessonId làm order
//       isActive: true // Giữ nguyên là true theo curl
//     };

//     const response = await fetch(`https://192.168.1.4:7056/api/Lesson/${lesson.lessonId}`, {
//       method: 'PUT',
//       headers: {
//         'accept': 'text/plain',
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiYWRtaW4iLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJBZG1pbmlzdHJhdG9yIiwiZXhwIjoxNzQxMTY4MTAzLCJpc3MiOiJodHRwczovL2FjY291bnRhcGkuYmt0Lm5ldC52biIsImF1ZCI6Imh0dHBzOi8vYWNjb3VudGFwaS5ia3QubmV0LnZuIn0.e-RMz_CARwuMm2Cd6RVmv-y82XcT7Wg8NWob3WoFEFg`
//       },
//       credentials: 'include',
//       body: JSON.stringify(updateData)
//     });
    
//     if (!response.ok) {
//       throw new Error(`Lỗi khi cập nhật bài học ${lesson.lessonId}: ${response.statusText}`);
//     }
    
//     return true;
//   } catch (error) {
//     console.error(error);
//     return false;
//   }
// }

// async function updateAllLessonsImages() {
//   const newImageUrl = "https://img.freepik.com/free-vector/girls-boys-students-classroom-with-blackboard_24640-45512.jpg?t=st=1741055695~exp=1741059295~hmac=6870a7403e0beeda151fd8a4df9cedd2fb523f010e95619cb28d8b92fa559155&w=2000";
//   let successCount = 0;
  
//   for (const lesson of lessonData) {
//     const success = await updateLessonImage(lesson, newImageUrl);
//     if (success) successCount++;
//     await delay(1000); // Delay 1 giây giữa các request
//     console.log(`Đã xử lý bài học ${lesson.lessonName}: ${success ? 'Thành công' : 'Thất bại'}`);
//   }
  
//   console.log(`Đã cập nhật thành công ${successCount}/${lessonData.length} bài học`);
// }

// const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function OverviewPage({ courseData, initialFilterData, fetchFilterData }: OverviewPageProps) {
  // useEffect(() => {
  //   updateAllLessonsImages();
  // }, []);
  return (
    <div>
      {/* <NotificationDebug /> */}
      <LectureFavouriteList courseData={courseData} initialFilterData={initialFilterData} fetchFilterData={fetchFilterData} />
      <TeachingProgress courseData={courseData} />
      
    </div>
  );
}

export default OverviewPage;
