"use server";

import { serverFetch } from "@/lib/api";

interface InitializeLockedParams {
  userId: string;
  mode: "default" | "free"; // giới hạn các mode có thể có
}

interface LockedResponse {
  success: boolean;
  error?: string;
}

export async function initializeLocked({
  userId,
  mode = "default"
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
