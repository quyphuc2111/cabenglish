"use server"

import { createSchoolWeekAdminData } from "@/actions/schoolWeekAction";
import { SchoolWeekFormValues } from "@/lib/validations/schoolweek";

export async function createSchoolWeek(values: SchoolWeekFormValues) {
  try {
    // Bảo đảm payload luôn là mảng và value là số hợp lệ
    const payloadArray = Array.isArray(values) ? values : [values];
    const normalized = payloadArray.map((item) => ({
      swId: Number(item.swId) || 0,
      value: Number(item.value)
    }));

    const result = await createSchoolWeekAdminData({
      schoolWeekData: normalized as any
    });

    return { success: result.success, data: result.data, error: result.error };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Có lỗi xảy ra khi tạo tuần học",
    };
  }
} 