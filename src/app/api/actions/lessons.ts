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

export async function createLesson({classId, unitId, lessonData}) {
    try {
      const result = await createLessonAdminDataByClassIdUnitId({classId, unitId, lessonData});
  
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