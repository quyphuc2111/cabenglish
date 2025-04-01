"use server";

import { serverFetch } from "@/lib/api";
import { authOptions } from "@/lib/auth";
import { NotiAdminType } from "@/types/notification";
import { getServerSession } from "next-auth";

interface NotiResponse {
  data: NotiAdminType[];
  error?: string;
  success?: boolean;
}

// User
export async function markAsReadNoti({
  notiId
}: {
  notiId: number;
}): Promise<NotiResponse> {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      throw new Error("Không tìm thấy session");
    }
    const response = await serverFetch(`/api/Noti/markAsRead`, {
      method: "PUT",
      data: {
        userId: session.user.userId,
        notificationId: notiId
      }
    });

    if (!response) {
      throw new Error("Không nhận được phản hồi từ server");
    }

    return {
      success: true,
      data: response
    };
  } catch (error) {
    console.error("Lỗi khi đánh dấu đã đọc thông báo:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Có lỗi xảy ra khi đánh dấu đã đọc thông báo",
      data: []
    };
  }
}

// Admin
export async function getAllNotiAdminData(): Promise<NotiResponse> {
  try {
    const data = await serverFetch(`/api/Noti/all`);

    if (!Array.isArray(data)) {
      throw new Error("Dữ liệu không đúng định dạng");
    }

    return {
      data,
      error: undefined
    };
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu tuần học:", error);
    return {
      data: [],
      error:
        error instanceof Error ? error.message : "Có lỗi xảy ra khi lấy dữ liệu"
    };
  }
}

export async function createNotiAdminData(notiData: NotiAdminType): Promise<NotiResponse> {
  const response = await serverFetch(`/api/Noti`, {
    method: "POST",
    data: notiData
  });

  if (!response) {
    return {
      success: false,
      error: "Không nhận được phản hồi từ server",
      data: []
    };
  }

  return {
    success: true,
    data: response
  };
}

export async function updateNotiAdminData({
  notiData,
  notiId
}: {
  notiData: NotiAdminType;
  notiId: number;
}): Promise<NotiResponse> {
  try {
    const response = await serverFetch(`/api/Noti/${notiId}`, {
      method: "PUT",
      data: notiData
    });

    if (!response) {
      throw new Error("Không nhận được phản hồi từ server");
    }

    return {
      success: true,
      data: response
    };
  } catch (error) {
    console.error("Lỗi khi cập nhật dữ liệu notification:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Có lỗi xảy ra khi cập nhật dữ liệu notification",
      data: []
    };
  }
}

export async function getSingleNotiAdminData({
  ntId
}: {
  ntId: number;
}): Promise<NotiResponse> {
  try {
    const data = await serverFetch(`/api/Noti/${ntId}`);

    return {
      data,
      error: undefined
    };
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu thông báo:", error);
    return {
      data: [],
      error:
        error instanceof Error ? error.message : "Có lỗi xảy ra khi lấy dữ liệu"
    };
  }
}

export async function sendNotiAdminData(notificationId: number): Promise<NotiResponse> {
  try {
    const response = await serverFetch(`/api/Noti/send/${notificationId}`, {
      method: "POST"
    });

    if (!response) {
      throw new Error("Không nhận được phản hồi từ server");
    }

    return {
      success: true,
      data: response
    };
  } catch (error) {
    console.error("Lỗi khi gửi thông báo:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Có lỗi xảy ra khi gửi thông báo",
      data: []
    };
  }
}

export async function deleteNotiAdminData(notificationId: number): Promise<NotiResponse> {
  try {
    const response = await serverFetch(`/api/Noti/${notificationId}`, {
      method: "DELETE"
    });

    // if (!response) {
    //   throw new Error("Không nhận được phản hồi từ server");
    // }

    return {
      success: true,
      data: response
    };
  } catch (error) {
    console.error("Lỗi khi xóa thông báo:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Có lỗi xảy ra khi xóa thông báo",
      data: []
    };
  }
}


