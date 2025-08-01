"use server";

import { serverFetch } from "@/lib/api";
import { SchoolWeekType } from "@/types/schoolweek";

interface SchoolWeekResponse {
  data: SchoolWeekType[];
  error?: string;
  success?: boolean;
  message?: string;
}

export async function getSchoolWeekByUnitId({
  unitId
}: {
  unitId: number;
}) {
  try {
    const data = await serverFetch(`/api/Schoolweek/unit/${unitId}`);
    return data;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu tuần học:", error);
    return [];
  }
}

//Admin
export async function getAllSchoolWeekAdminData(): Promise<SchoolWeekResponse> {
  try {
    const data = await serverFetch(`/api/Schoolweek`);

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

export async function getSingleSchoolWeekAdminData({
  swId
}: {
  swId: number;
}): Promise<SchoolWeekResponse> {
  try {
    const data = await serverFetch(`/api/Schoolweek/${swId}`);

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

export async function createSchoolWeekAdminData({
  schoolWeekData
}: {
  schoolWeekData: SchoolWeekType[];
}): Promise<SchoolWeekResponse> {
  try {
    const response = await serverFetch(`/api/Schoolweek`, {
      method: "POST",
      data: schoolWeekData
    });

    if (!response || response.error) {
      return {
        data: [],
        success: false,
        error: response?.error || "Có lỗi xảy ra khi tạo tuần học 120" 
      };
    }

    return {
      data: response.data,
      success: true,
      error: undefined
    };
  } catch (error) {
    console.error("Lỗi khi tạo tuần học:", error);
    return {
      data: [],
      success: false,
      error: error instanceof Error ? error.message : "Có lỗi xảy ra khi tạo tuần học 12221"
    };
  }
}

export async function updateSchoolWeekAdminData({
  swId,
  schoolWeekData
}: {
  swId: number;
  schoolWeekData: {
    value: number;
    swId: number;
  };
}): Promise<SchoolWeekResponse> {
  try {
    const response = await serverFetch(`/api/Schoolweek/${swId}`, {
      method: "PUT",
      data: schoolWeekData
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

export async function deleteSchoolWeekAdminData({
  swId
}: {
  swId: string;
}): Promise<SchoolWeekResponse> {
  try {
    const data = await serverFetch(`/api/Schoolweek/${swId}`, {
      method: "DELETE"
    });

    return {
      data,
      error: undefined
    };
  } catch (error) {
    console.error("Lỗi khi xóa tuần học:", error);
    return {
      data: [],
      error:
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi xóa tuần học"
    };
  }
}
