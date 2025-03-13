"use server"

import { createNotiTypeAdminData } from "@/actions/notificationAction";
import { NotiTypeFormValues } from "@/lib/validations/notitype";

export async function createNotiType(values: NotiTypeFormValues) {
  try {
    const result = await createNotiTypeAdminData({
      notiTypeData: values
    });

    return { success: true, data: result.data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Có lỗi xảy ra khi tạo tuần học"
    };
  }
} 