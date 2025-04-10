"use server";
import { serverFetch } from "@/lib/api";
import { UserResponse } from "@/types/user";

interface userParams {
  userId: string;
  userInfo: {
    email: string;
    language: string;
    theme: string;
    mode: string;
    isFirstLogin: boolean;
  };
}

interface userResponse {
  success: boolean;
  error?: string;
  data?: any;
}

export async function getUserInfo({
  userId
}: {
  userId: string;
}): Promise<UserResponse> {
  if (!userId) {
    return {
      success: false,
      error: "UserId không được để trống"
    };
  }

  try {
    const response = await serverFetch(`/api/Users/${userId}`);

    if (!response) {
      throw new Error("Không nhận được phản hồi từ server");
    }

    return {
      success: true,
      data: response
    };
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng:", {
      error,
      timestamp: new Date().toISOString()
    });

    return {
      success: false,
      error:
        error instanceof Error
          ? `Lỗi: ${error.message}`
          : "Có lỗi xảy ra khi lấy thông tin người dùng"
    };
  }
}

export async function updateUserInfo({
  userId,
  userInfo
}: userParams): Promise<userResponse> {
  if (!userId) {
    return {
      success: false,
      error: "UserId không được để trống"
    };
  }
  try {
    const response = await serverFetch(`/api/Users/${userId}`, {
      method: "PUT",
      data: {
        email: userInfo.email,
        language: userInfo.language,
        theme: userInfo.theme,
        mode: userInfo.mode,
        isFirstLogin: userInfo.isFirstLogin
      }
    });

    // Kiểm tra response từ API nếu cần
    if (!response) {
      throw new Error("Không nhận được phản hồi từ server");
    }

    return {
      success: true
    };
  } catch (error) {
    console.error("Lỗi khi cập nhật thông tin người dùng:", {
      error,
      timestamp: new Date().toISOString()
    });
    return {
      success: false,
      error:
        error instanceof Error
          ? `Lỗi: ${error.message}`
          : "Có lỗi xảy ra khi cập nhật thông tin người dùng"
    };
  }
}
