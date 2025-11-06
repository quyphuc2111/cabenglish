"use server";

import { createLessonAdminDataByClassIdUnitId, getAllLessonAdminDataByClassIdUnitId } from "@/actions/lessonAction";
import { LessonAdminType } from "@/types/lesson";

export async function getAllLessonsByClassIdUnitId(classId: string, unitId: string) {
  try {
    const result = await getAllLessonAdminDataByClassIdUnitId(classId, unitId);

    return { success: true, data: result.data };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi lấy dữ liệu bài học"
    };
  }
}

export async function createLesson(values: {
  lessonData: LessonAdminType[];
  classId: number;
  unitId: number;
}) {
  try {
    const result = await createLessonAdminDataByClassIdUnitId(values);
    if (!result || result.success === false) {
      return {
        success: false,
        error: result?.error || "Có lỗi xảy ra khi tạo bài học"
      };
    }
    return { success: true, data: result.data };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi tạo bài học"
    };
  }
}