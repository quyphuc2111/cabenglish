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

export async function fetchFilterData({ classId, unitId, userId }: FilterParams) {
  try {
    const [classroomsResponse, unitsResponse, schoolWeeksResponse] = await Promise.all([
      serverFetch(`/api/Classroom/user/${userId}`),
      classId ? serverFetch(`/api/Unit/class/${classId}/${userId}`) : Promise.resolve([]),
      unitId ? serverFetch(`/api/Schoolweek/unit/${unitId}`) : Promise.resolve([])
    ]);

    // Transform data trước khi trả về
    const transformedData: TransformedFilterData = {
      classrooms: classroomsResponse.map((classroom: any) => ({
        class_id: classroom.class_id,
        classname: classroom.classname
      })),
      units: unitsResponse.map((unit: any) => ({
        unitId: unit.unitId,
        unitName: unit.unitName
      })),
      schoolWeeks: schoolWeeksResponse.sort((a: any, b: any) => a.value - b.value)
    };

    return transformedData;

  } catch (error) {
    console.error("Lỗi không mong muốn:", error);
    throw new Error("Có lỗi xảy ra khi lấy dữ liệu filter");
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
