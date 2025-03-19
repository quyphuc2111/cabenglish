"use server"

import { serverFetch } from "@/lib/api";
import { LessonAdminType, LessonType } from "@/types/lesson";

interface LessonResponse {
  data: LessonType[];
  error?: string;
  success?: boolean;
}

interface LessonAdminResponse {
  data: LessonAdminType[];
  error?: string;
  success?: boolean;
}

//User
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

//Admin
export async function getAllLessonAdminDataByClassIdUnitId(classId: string, unitId: string) {
  try {
    const data = await serverFetch(`/api/Lesson/class/${classId}/unit/${unitId}/withschoolweek`);
    if (!Array.isArray(data)) {
      throw new Error("Dữ liệu không đúng định dạng");
    }

    return {
      data: data as LessonAdminType[],
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

export async function createLessonAdminDataByClassIdUnitId({
  lessonData,
  classId,
  unitId
}: {
  lessonData: LessonAdminType[];
  classId: number;
  unitId: number;
}): Promise<LessonAdminResponse> {
  console.log('lessonData', lessonData);

  try {
    const lesson = {
      classId: classId,
      unitId: unitId,
      lessons: lessonData
    }
    
    const data = await serverFetch(`/api/Lesson/batch`, {
      method: "POST",
      data: lesson
    });

    if (!Array.isArray(data)) {
      throw new Error("Dữ liệu không đúng định dạng");
    }

    return {
      data,
      error: undefined
    };
  } catch (error) {
    console.error("Lỗi khi tạo unit:", error);
    return {
      data: [],
      error:
        error instanceof Error ? error.message : "Có lỗi xảy ra khi lấy dữ liệu"
    };
  }
}

export async function getSingleLessonAdminData({lessonId}: {lessonId: number}): Promise<LessonAdminType> {
  try {
    const data = await serverFetch(`/api/Lesson/${lessonId}`);
    
    return {
      data,
      error: undefined
    };
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu bài học:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Có lỗi xảy ra khi lấy dữ liệu"
    };
  }
}