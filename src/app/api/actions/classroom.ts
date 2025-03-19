"use server"

import { ClassroomFormValues } from "@/lib/validations/classroom";
import { createClassroomsAdminData } from "@/actions/classroomAction";

export async function createClassroom(values: ClassroomFormValues) {
  try {
    const result = await createClassroomsAdminData({
      classData: values.length >= 0 ? values : [values]
    });
    console.log("result", result);

    return { success: result.success, data: result.data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Có lỗi xảy ra khi tạo lớp học"
    };
  }
} 