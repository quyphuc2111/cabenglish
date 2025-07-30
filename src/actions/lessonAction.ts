"use server";

import { serverFetch } from "@/lib/api";
import { LessonAdminType, LessonType } from "@/types/lesson";
import { initializeProgress } from "./progressAction";
import { initializeLocked } from "./lockedAction";

interface LessonResponse {
  data: LessonType[];
  error?: string;
  success?: boolean;
}

interface LessonAdminResponse {
  data: LessonAdminType[] | null;
  error?: string;
  success?: boolean;
}

//User
export async function getAllLessonDataByUserId({
  userId,
  mode
}: {
  userId: string;
  mode?: "default" | "free"
}): Promise<LessonResponse> {
  if (!userId) {
    return {
      data: [],
      error: "UserId không được để trống"
    };
  }

  try {
    await initializeProgress(userId)
    await initializeLocked({userId, mode: mode })
    const data = await serverFetch(`/api/Lesson/user/${userId}`);

    if (!Array.isArray(data)) {
      throw new Error("Dữ liệu không đúng định dạng");
    }

    return {
      data: data as LessonType[],
      error: undefined
    };
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu bài học:", error);
    return {
      data: [],
      error:
        error instanceof Error ? error.message : "Có lỗi xảy ra khi lấy dữ liệu"
    };
  }
}

export async function incrementLessonLike(lessonId: string): Promise<LessonResponse> {
  try {
    const data = await serverFetch(`/api/Lesson/like/${lessonId}`, {
      method: "POST"
    });

    return {
      data: data,
      error: undefined
    };
  } catch (error) {
    console.error("Lỗi khi tăng số lượt thích cho bài học:", error);
    return {
      data: [],
      error:
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi tăng số lượt thích cho bài học"
    };
  }
}

export async function decrementLessonLike(lessonId: string): Promise<LessonResponse> {
  try {
    const data = await serverFetch(`/api/Lesson/unlike/${lessonId}`, {
      method: "POST"
    });

    return {
      data: data,
      error: undefined
    };
  } catch (error) {
    console.error("Lỗi khi tăng số lượt thích cho bài học:", error);
    return {
      data: [],
      error:
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi tăng số lượt thích cho bài học"
    };
  }
}

//Admin
export async function getAllLessonAdminDataByClassIdUnitId(
  classId: string,
  unitId: string
) {
  try {
    const data = await serverFetch(
      `/api/Lesson/class/${classId}/unit/${unitId}/withschoolweekID`
    );
    if (!Array.isArray(data)) {
      throw new Error("Dữ liệu không đúng định dạng");
    }

    return {
      data: data as LessonAdminType[],
      error: undefined
    };
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu bài học:", error);
    return {
      data: [],
      error:
        error instanceof Error ? error.message : "Có lỗi xảy ra khi lấy dữ liệu"
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
}) {
  const lesson = {
    classId: classId,
    unitId: unitId,
    lessons: lessonData
  };

  const data = await serverFetch(`/api/Lesson/batch`, {
    method: "POST",
    data: lesson
  });

  if (!Array.isArray(data)) {
    throw new Error("Dữ liệu không đúng định dạng");
  }

  return data;
}

export async function getSingleLessonAdminData({
  lessonId,
  classId,
  unitId
}: {
  lessonId: number;
  classId: number;
  unitId: number;
}): Promise<LessonAdminResponse> {
  try {
    const response = await serverFetch(
      `/api/Lesson/${classId}/${unitId}/${lessonId}`
    );

    return {
      data: response,
      error: undefined,
      success: true
    };
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu bài học:", error);
    return {
      data: null,
      error:
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi lấy dữ liệu",
      success: false
    };
  }
}

export async function updateLessonAdminDataByClassIdUnitId({
  lessonId,
  classId,
  unitId,
  lessonData
}: {
  lessonId: number;
  classId: number;
  unitId: number;
  lessonData: LessonAdminType;
}): Promise<LessonAdminResponse> {
  try {
    const data = await serverFetch(
      `/api/Lesson/${classId}/${unitId}/${lessonId}`,
      {
        method: "PUT",
        data: lessonData
      }
    );

    return {
      data,
      error: undefined
    };
  } catch (error) {
    console.error("Lỗi khi cập nhật bài học:", error);
    return {
      data: [],
      error:
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi cập nhật bài học"
    };
  }
}

export async function deleteLessonAdminData({
  lessonIds,
  classId,
  unitId
}: {
  lessonIds: string[];
  classId: number;
  unitId: number;
}): Promise<LessonAdminResponse> {
  try {
    const data = await serverFetch(`/api/Lesson/batch`, {
      method: "DELETE",
      data: {
        lessonIds: lessonIds,
        classId: classId,
        unitId: unitId
      }
    });

    return {
      data,
      error: undefined,
      success: true
    };
  } catch (error) {
    console.error("Lỗi khi xóa bài học:", error);
    return {
      data: [],
      error:
        error instanceof Error ? error.message : "Có lỗi xảy ra khi xóa bài học",
      success: false
    };
  }
}
