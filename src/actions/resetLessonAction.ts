'use server'

import { DashboardService } from "@/services/dashboard.service";
import { revalidatePath } from "next/cache";

export async function resetLessonProgress(userId: string, lessonIds: number[]) {
  try {
    await DashboardService.resetLessonProgress(userId, lessonIds);
    revalidatePath('/tong-quan'); // Revalidate để cập nhật data mới
    return { success: true };
  } catch (error) {
    console.error('Reset lesson progress error:', error);
    return { success: false, error: 'Có lỗi xảy ra khi khởi tạo lại tiến trình!' };
  }
} 