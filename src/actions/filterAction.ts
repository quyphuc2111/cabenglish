"use server";

import { serverFetch } from "@/lib/api";

// Định nghĩa các interface để type safety
interface FilterParams {
  classId?: string;
  unitId?: string;
  userId: string;
}

interface ApiResponse<T> {
  data: T;
  error?: string;
}

export async function fetchFilterData({ classId, unitId, userId }: FilterParams) {
  try {
    // Sử dụng Promise.all để fetch song song các request
    const [classroomsResponse, unitsResponse, schoolWeeksResponse] = await Promise.all([
      // Luôn fetch classrooms vì cần cho dropdown đầu tiên
      serverFetch(`/api/Classroom/user/${userId}`).then(data => ({
        data,
        error: null
      })).catch(error => ({
        data: [],
        error: `Lỗi lấy danh sách lớp học: ${error.message}`
      })),

      // Chỉ fetch units khi có classId
      classId ? serverFetch(`/api/Unit/class/${classId}/${userId}`).then(data => ({
        data,
        error: null
      })).catch(error => ({
        data: [],
        error: `Lỗi lấy danh sách unit: ${error.message}`
      })) : { data: [], error: null },

      // Chỉ fetch schoolWeeks khi có unitId
      unitId ? serverFetch(`/api/Schoolweek/unit/${unitId}`).then(data => ({
        data,
        error: null
      })).catch(error => ({
        data: [],
        error: `Lỗi lấy danh sách tuần học: ${error.message}`
      })) : { data: [], error: null }
    ]);

    // Tập hợp các lỗi nếu có
    const errors = [
      classroomsResponse.error,
      unitsResponse.error,
      schoolWeeksResponse.error
    ].filter(Boolean);

    // Log lỗi nếu có
    if (errors.length > 0) {
      console.error("Các lỗi khi fetch dữ liệu:", errors);
    }

    // Validate và transform dữ liệu
    return {
      classrooms: Array.isArray(classroomsResponse.data) 
        ? classroomsResponse.data 
        : [],
      units: Array.isArray(unitsResponse.data) 
        ? unitsResponse.data 
        : [],
      schoolWeeks: Array.isArray(schoolWeeksResponse.data) 
        ? schoolWeeksResponse.data 
        : [],
      errors: errors.length > 0 ? errors : undefined
    };

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
