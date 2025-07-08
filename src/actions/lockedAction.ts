"use server";

import { serverFetch } from "@/lib/api";

interface InitializeLockedParams {
  userId: string;
  mode: "default" | "free"; 
}

interface LockedResponse {
  success: boolean;
  error?: string;
}

export async function initializeLocked({
  userId,
  mode = "default" || "free" 
}: InitializeLockedParams): Promise<LockedResponse> {
  if (!userId) {
    return {
      success: false,
      error: "UserId không được để trống"
    };
  }

  try {
    const response = await serverFetch("/api/Locked/initializeByMode", {
      method: "POST",
      data: { userId, mode }
    });

    // Kiểm tra response từ API nếu cần
    if (!response) {
      throw new Error("Không nhận được phản hồi từ server");
    }

    return {
      success: true
    };
  } catch (error) {
    // Log chi tiết lỗi để debug
    console.error("Lỗi khởi tạo locked:", {
      error,
      timestamp: new Date().toISOString()
    });

    return {
      success: false,
      error:
        error instanceof Error
          ? `Lỗi: ${error.message}`
          : "Có lỗi xảy ra khi khởi tạo locked"
    };
  }
}

export async function switchModeAction({
  userId,
  mode
}: InitializeLockedParams): Promise<LockedResponse> {
  if (!userId) {
    return {
      success: false,
      error: "UserId không được để trống"
    };
  }

  try {
    const response = await serverFetch("/api/Locked/switchMode", {
      method: "PUT",
      data: { userId, mode }
    });

    // Kiểm tra response từ API nếu cần
    if (!response) {
      throw new Error("Không nhận được phản hồi từ server");
    }

    return {
      success: true
    };
  } catch (error) {
    // Log chi tiết lỗi để debug
    console.error("Lỗi chuyển mode trong locked:", {
      error,
      timestamp: new Date().toISOString()
    });

    return {
      success: false,
      error:
        error instanceof Error
          ? `Lỗi: ${error.message}`
          : "Có lỗi xảy ra khi chuyển mode trong locked"
    };
  }
}

export async function updateSectionLocked({userId, sectionId}: {userId: string, sectionId: number}) {
  if (!userId || !sectionId) {
    return {
      success: false,
      error: "UserId hoặc sectionId không được để trống"
    };
  }

  try {
    const response = await serverFetch("/api/Locked/updateSectionLocked", {
      method: "PUT",
      data: { userId, sectionId }
    });

    if (!response) {
      throw new Error("Không nhận được phản hồi từ server");
    }

    return {
      success: true
    };
  } catch (error) {
    console.error("Lỗi cập nhật locked section", {
      error,
      timestamp: new Date().toISOString()
    });

    return {
      success: false,
      error:
        error instanceof Error
          ? `Lỗi: ${error.message}`
          : "Có lỗi xảy ra khi cập nhật locked section"
    };
  }
}

export async function updateLessonLocked({userId, lessonId}: {userId: string, lessonId: number}) {
  if (!userId || !lessonId) {
    return {
      success: false,
      error: "UserId hoặc lessonId không được để trống"
    };
  }
  
  try {
    const response = await serverFetch("/api/Locked/updateLessonLocked", {
      method: "PUT",
      data: { userId, lessonId }
    });

    if (!response) {
      throw new Error("Không nhận được phản hồi từ server");
    }

    return {
      success: true
    };
  } catch (error) {
    console.error("Lỗi cập nhật locked lesson", {
      error,
      timestamp: new Date().toISOString()
    });
    
    return {
      success: false,
      error:
        error instanceof Error
          ? `Lỗi: ${error.message}`
          : "Có lỗi xảy ra khi cập nhật locked lesson"
    };
  }
}