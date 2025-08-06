"use server";

import { serverFetch } from "@/lib/api";

export async function getLessonInfoById({
  userId,
  lessonId
}: {
  userId: string;
  lessonId: string;
}) {
  try {
    // Lấy thông tin lesson từ API
    const data = await serverFetch(
      `/api/Lesson/user/${userId}/lesson/${lessonId}`
    );

    if (!data) {
      return {
        lessonInfo: null,
        error: "Không tìm thấy thông tin bài học"
      };
    }

    return {
      lessonInfo: data,
      error: undefined
    };
  } catch (error) {
    console.error("Error getting lesson info:", error);
    return {
      lessonInfo: null,
      error: error instanceof Error ? error.message : "Có lỗi xảy ra"
    };
  }
}
