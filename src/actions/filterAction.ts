"use server";

import { serverFetch } from "@/lib/api";

// Định nghĩa các interface để type safety
interface FilterParams {
  classId?: string;
  unitId?: string;
  userId?: string;
}

interface ApiResponse<T> {
  data: T;
  error?: string;
}

// Thêm interface cho dữ liệu đã được transform
interface TransformedFilterData {
  classrooms: {
    class_id: string;
    classname: string;
  }[];
  units: {
    unitId: string;
    unitName: string;
  }[];
  schoolWeeks: {
    swId: string;
    value: number;
  }[];
}

export async function fetchFilterData({
  classId,
  unitId,
  userId
}: FilterParams) {
  try {
    // Validate userId
    if (!userId) {
      console.error("fetchFilterData: userId is required");
      throw new Error("UserId is required");
    }

    // Validate classId để tránh gọi API với giá trị không hợp lệ
    const isValidClassId =
      classId &&
      classId !== "user" &&
      classId !== "reset" &&
      !isNaN(Number(classId));
    const isValidUnitId =
      unitId && unitId !== "reset" && !isNaN(Number(unitId));

    console.log("fetchFilterData called with:", { classId, unitId, userId });

    // Gọi API với error handling riêng biệt
    let classroomsResponse = [];
    let unitsResponse = [];
    let schoolWeeksResponse = [];

    try {
      classroomsResponse = await serverFetch(`/api/Classroom/user/${userId}`);
      console.log("Classrooms API response:", classroomsResponse);
    } catch (error) {
      console.error("Error fetching classrooms:", error);
      // Không throw error, chỉ log và sử dụng empty array
    }

    if (isValidClassId) {
      try {
        unitsResponse = await serverFetch(
          `/api/Unit/class/${classId}/${userId}`
        );
        console.log("Units API response:", unitsResponse);
      } catch (error) {
        console.error("Error fetching units:", error);
        // Không throw error, chỉ log và sử dụng empty array
      }
    }

    if (isValidUnitId) {
      try {
        schoolWeeksResponse = await serverFetch(
          `/api/Schoolweek/unit/${unitId}`
        );
        console.log("SchoolWeeks API response:", schoolWeeksResponse);
      } catch (error) {
        console.error("Error fetching school weeks:", error);
        // Không throw error, chỉ log và sử dụng empty array
      }
    }

    // Transform data trước khi trả về
    const transformedData: TransformedFilterData = {
      classrooms: Array.isArray(classroomsResponse)
        ? classroomsResponse.map((classroom: any) => ({
            class_id: String(classroom.class_id),
            classname: classroom.classname
          }))
        : [],
      units: Array.isArray(unitsResponse)
        ? unitsResponse.map((unit: any) => ({
            unitId: unit.unitId,
            unitName: unit.unitName
          }))
        : [],
      schoolWeeks: Array.isArray(schoolWeeksResponse)
        ? schoolWeeksResponse.sort((a: any, b: any) => a.value - b.value)
        : []
    };

    return transformedData;
  } catch (error) {
    console.error("Lỗi không mong muốn:", error);
    // Trả về empty data thay vì throw error
    return {
      classrooms: [],
      units: [],
      schoolWeeks: []
    };
  }
}

// Hàm helper để kiểm tra response
function isValidResponse(data: unknown): boolean {
  return Array.isArray(data);
}

// Thêm hàm refresh để force update khi cần
export async function refreshFilterData(params: FilterParams) {
  return fetchFilterData(params);
}
