"use server"

import { serverFetch } from "@/lib/api";
import { NotiTypeFormValues } from "@/lib/validations/notitype";
import { NotificationListResponse, NotiType } from "@/types/notification";

interface NotificationResponse {
  data: NotiType[];
  error?: string;
  success?: boolean;
}
  
export async function getNotificationListByUserId({
    userId
  }: {userId: string}): Promise<NotificationListResponse> {
    if (!userId) {
      return {
        success: false,
        error: "UserId không được để trống"
      };
    }
  
    try {
      const response = await serverFetch(`/api/Noti/user/${userId}`);
  
      if (!response) {
        throw new Error("Không nhận được phản hồi từ server");
      }
  
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error("Lỗi khi lấy danh sách thông báo:", {
        error,
        timestamp: new Date().toISOString()
      });
  
      return {
        success: false,
        error:
          error instanceof Error
            ? `Lỗi: ${error.message}`
            : "Có lỗi xảy ra khi lấy danh sách thông báo"
      };
    }
}

//Admin
export async function getAllNotiTypeAdminData(): Promise<NotificationResponse> {
  try {
    const data = await serverFetch(`/api/NotiType/notitype`);

    if (!Array.isArray(data)) {
      throw new Error("Dữ liệu không đúng định dạng");
    }

    return {
      data,
      error: undefined
    };
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu loại thông báo:", error);
    return {
      data: [],
      error:
        error instanceof Error ? error.message : "Có lỗi xảy ra khi lấy dữ liệu"
    };
  }
}

export async function getSingleNotiTypeAdminData({
  ntId
}: {
  ntId: number;
}): Promise<NotificationResponse> {
  try {
    const data = await serverFetch(`/api/NotiType/notitype/${ntId}`);

    return {
      data,
      error: undefined
    };
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu loại thông báo:", error);
    return {
      data: [],
      error:
        error instanceof Error ? error.message : "Có lỗi xảy ra khi lấy dữ liệu"
    };
  }
}

export async function createNotiTypeAdminData({
  notiTypeData
}: {
  notiTypeData:  NotiTypeFormValues;
}): Promise<NotificationResponse> {
  try {
    const data = await serverFetch(`/api/NotiType/notitype`, {
      method: "POST",
      data: notiTypeData
    });

    return {
      data,
      error: undefined
    };
  } catch (error) {
    console.error("Lỗi khi tạo loại thông báo:", error);
    return {
      data: [],
      error:
        error instanceof Error ? error.message : "Có lỗi xảy ra khi lấy dữ liệu"
    };
  }
}

export async function updateNotiTypeAdminData({
  ntId,
  notiTypeData
}: {
  ntId: number;
  notiTypeData: {
    value: number;
    ntId: number;
  };
}): Promise<NotificationResponse> {

  try {
    const response = await serverFetch(`/api/NotiType/notitype/${ntId}`, {
      method: "PUT",
      data: notiTypeData
    });

    if (!response) {
      throw new Error("Không nhận được phản hồi từ server");
    }

    return {
      data: response,
      error: undefined
    };
  } catch (error) {
    console.error("Server action error:", error);
    return {
      data: [],
      error: error instanceof Error ? error.message : "Lỗi không xác định"
    };
  }
}

export async function deleteNotiTypeAdminData({
  ntId
}: {
  ntId: number;
}): Promise<NotificationResponse> {
  try {
    const data = await serverFetch(`/api/NotiType/notitype/${ntId}`, {
      method: "DELETE"
    });

    return {
      data,
      error: undefined
    };
  } catch (error) {
    console.error("Lỗi khi xóa loại thông báo:", error);
    return {
      data: [],
      error:
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi xóa loại thông báo"
    };
  }
}
