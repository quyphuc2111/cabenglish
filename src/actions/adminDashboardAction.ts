"use server"

import { serverFetch } from "@/lib/api";

interface AdminDashboardResponse {
    data: any;
    error?: string;
    success?: boolean;
}

export async function getAdminDashboardData(): Promise<AdminDashboardResponse> {
    try {
      const data = await serverFetch(`/api/Dashboard/dashboard`);
  
      return {
        data,
        error: undefined
      };
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu dashboard:", error);
      return {
        data: [],
        error:
          error instanceof Error ? error.message : "Có lỗi xảy ra khi lấy dữ liệu"
      };
    }
  }