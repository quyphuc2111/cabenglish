"use server"

import { createSchoolWeekAdminData } from "@/actions/schoolWeekAction";
import { SchoolWeekFormValues } from "@/lib/validations/schoolweek";

export async function createSchoolWeek(values: SchoolWeekFormValues) {
  try {
    const result = await createSchoolWeekAdminData({
      schoolWeekData: values.length >= 0 ? values : [values]
    });

    return { success: result.success, data: result.data, error: result.error };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Có lỗi xảy ra khi tạo tuần học333",
      // error: error instanceof Error ? error.message : "Có lỗi xảy ra khi tạo tuần học333"
    };
  }
} 