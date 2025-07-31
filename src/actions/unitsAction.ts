"use server";

import { serverFetch } from "@/lib/api";
import { Units } from "@/types/unit";

interface UnitsResponse {
  data: Units[];
  error?: string;
  success?: boolean;
}

//Client 

export async function getUnitByClassId(classId: number | string, userId: number | string) {
  try {
    const data = await serverFetch(`/api/Unit/class/${classId}/${userId}`);
    return data;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu unit:", error);
    return {
      data: [],
      error:
        error instanceof Error ? error.message : "Có lỗi xảy ra khi lấy dữ liệu"
    };
  }
}

//Admin
export async function getAllUnitsAdminDataByClassId(
  classId: number | string
): Promise<UnitsResponse> {
  try {
    const data = await serverFetch(`/api/Unit/class/${classId}`);

    if (!Array.isArray(data)) {
      throw new Error("Dữ liệu không đúng định dạng");
    }

    return {
      data,
      error: undefined
    };
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu unit:", error);
    return {
      data: [],
      error:
        error instanceof Error ? error.message : "Có lỗi xảy ra khi lấy dữ liệu"
    };
  }
}

export async function createUnitAdminDataByClassId({
  unitData,
  classId
}: {
  unitData: Units[];
  classId: number;
}): Promise<UnitsResponse> {
  try {
    const data = await serverFetch(`/api/Unit/class/${classId}`, {
      method: "POST",
      data: unitData
    });

    if (!Array.isArray(data)) {
      throw new Error("Dữ liệu không đúng định dạng");
    }

    return {
      data,
      error: undefined
    };
  } catch (error) {
    console.error("Lỗi khi tạo unit:", error);
    return {
      data: [],
      error:
        error instanceof Error ? error.message : "Có lỗi xảy ra khi lấy dữ liệu"
    };
  }
}

export async function updateUnitAdminDataByClassId({
  unitId,
  unitData,
  classId
}: {
  unitId: number;
  unitData: Units;
  classId: number;
}): Promise<UnitsResponse> {
  try {
    const data = await serverFetch(`/api/Unit/class/${classId}/unit/${unitId}`, {
      method: "PUT",
      data: unitData
    });

    if (!Array.isArray(data)) {
      throw new Error("Dữ liệu không đúng định dạng");
    }

    return {
      data,
      error: undefined
    };
  } catch (error) {
    console.error("Lỗi khi cập nhật unit:", error);
    return {
      data: [],
      error:
        error instanceof Error ? error.message : "Có lỗi xảy ra khi cập nhật unit"
    };
  }
}

export async function deleteUnitsByClassId(classId: number, unitIds: number[]) {
  try {
    const response = await serverFetch(`/api/Unit/class/${classId}`, {
      method: "DELETE",
      data: unitIds
    });

    return response;
  } catch (error) {
    console.error("Lỗi khi xóa unit:", error);
    console.error("Failed with classId:", classId, "unitIds:", unitIds);
    throw error;
  }
}
