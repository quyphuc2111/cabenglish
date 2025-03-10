import { serverFetch } from "@/lib/api";
import { NotificationListResponse } from "@/types/notification";
  
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