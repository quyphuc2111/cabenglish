"use server"

import { serverFetch } from "@/lib/api";
import { LessonType } from "@/types/lesson";

interface LessonResponse {
  data: LessonType[];
  error?: string;
}

export async function getAllLessonDataByUserId({
  userId 
}: {
  userId: string
}): Promise<LessonResponse> {
  if (!userId) {
    return {
      data: [],
      error: "UserId không được để trống"
    };
  }

  try {
    const data = await serverFetch(`/api/Lesson/user/${userId}`);
    
    if (!Array.isArray(data)) {
      throw new Error("Dữ liệu không đúng định dạng");
    }

    return {
      data: data as LessonType[],
      error: undefined
    };

  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu bài học:', error);
    return {
      data: [],
      error: error instanceof Error ? error.message : "Có lỗi xảy ra khi lấy dữ liệu"
    };
  }
}
  