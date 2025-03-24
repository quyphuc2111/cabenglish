"use server"

import { serverFetch } from "@/lib/api";

interface ProgressResponse {
  success: boolean;
  error?: string;
}

export async function initializeProgress(userId: string): Promise<ProgressResponse> {
  if (!userId) {
    return {
      success: false,
      error: "UserId không được để trống"
    };
  }

  try {
    const response = await serverFetch("/api/Progress/initialize", {
      method: "POST",
      data: userId,
    });

    if (!response) {
      throw new Error("Không nhận được phản hồi từ server");
    }

    return {
      success: true
    };

  } catch (error) {
    console.error("Lỗi khởi tạo progress:", {
      error,
      userId,
      timestamp: new Date().toISOString()
    });

    return {
      success: false,
      error: error instanceof Error 
        ? `Lỗi: ${error.message}`
        : "Có lỗi xảy ra khi khởi tạo progress"
    };
  }
} 

export async function updateProgressSectionContent({userId, sectionContentId, progress}: {userId: string, sectionContentId: string | number, progress: 0 | 1}) {
  if (!userId) {
    return {
      success: false,
      error: "UserId không được để trống"
    };
  }

  if (!sectionContentId) {
    return {
      success: false,
      error: "SectionContentId không được để trống"
    };
  }

  if (progress !== 0 && progress !== 1) {
    return {
      success: false,
      error: "Tiến trình phải là giá trị 0 hoặc 1"
    };
  }

  try {
    const response = await serverFetch(`/api/Progress/updateProgress`, {
      method: "PUT",
      headers: {
        'accept': '*/*',
        'Content-Type': 'application/json'
      },
      data: {
        userId,
        scId: sectionContentId,
        progress
      }
    });

    // Kiểm tra response từ API nếu cần
    if (!response) {
      throw new Error("Không nhận được phản hồi từ server");
    }

    return {
      success: true,
    };
  } catch (error) {
  
    // Log chi tiết lỗi để debug
    console.error("Lỗi cập nhật tiến trình section content", {
      error,
      timestamp: new Date().toISOString()
    });

    return {
      success: false,
      error:
        error instanceof Error
          ? `Lỗi: ${error.message}`
          : "Có lỗi xảy ra khi cập nhật tiến trình section content"
    };
  }
}

export async function resetLessonProgress({userId, lessonIds}: {userId: string, lessonIds: number[] }) {
  if (!userId) {
    return {
      success: false,
      error: "UserId không được để trống"
    };
  }

  if(!lessonIds || lessonIds.length === 0) {
    return {
      success: false,
      error: "LessonIds không được để trống"
    };
  }
  

  try {
    const response = await serverFetch(`/api/Progress/resetLesson`, {
      method: "POST",
      headers: {
        'accept': '*/*',
        'Content-Type': 'application/json'
      },
      data: {
        userId,
        lessonIds
      }
    });

    // Kiểm tra response từ API nếu cần
    if (!response) {
      throw new Error("Không nhận được phản hồi từ server");
    }

    return {
      success: true,
    };
  } catch (error) {
  
    // Log chi tiết lỗi để debug
    console.error("Lỗi reset tiến trình bài học", {
      error,
      timestamp: new Date().toISOString()
    });

    return {
      success: false,
      error:
        error instanceof Error
          ? `Lỗi: ${error.message}`
          : "Có lỗi xảy ra khi reset tiến trình bài học"
    };
  }
}