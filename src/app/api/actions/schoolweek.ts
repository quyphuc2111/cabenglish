"use server"

import { createSchoolWeekAdminData } from "@/actions/schoolWeekAction";
import { SchoolWeekFormValues } from "@/lib/validations/schoolweek";

export async function createSchoolWeek(values: SchoolWeekFormValues) {
  try {
    const result = await createSchoolWeekAdminData({
      schoolWeekData: [values]
    });

    return { success: true, data: result.data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Có lỗi xảy ra khi tạo tuần học"
    };
  }
} 