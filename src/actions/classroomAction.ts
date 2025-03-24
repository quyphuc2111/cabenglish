"use server"

import { serverFetch } from "@/lib/api";
import { ClassroomFormValues, ClassroomType } from "@/types/classroom";

interface ClassroomResponse {
  data: ClassroomType[] ;
  error?: string;
  success?: boolean;
}

// Client 
export async function getAllClassroomDataByUserId({
    userId 
  }: {
    userId: string
  }): Promise<ClassroomResponse> {
    if (!userId) {
      return {
        data: [],
        error: "UserId không được để trống"
      };
    }
  
    try {
      const data = await serverFetch(`/api/Classroom/user/${userId}`);
      
      if (!Array.isArray(data)) {
        throw new Error("Dữ liệu không đúng định dạng");
      }
  
      return {
        data: data as ClassroomType[],
        error: undefined
      };
  
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu bài học:', error);
      return {
        data: [],
        error: error instanceof Error ? error.message : "Có lỗi xảy ra khi lấy dữ liệu"
      };
    }
  }


export async function incrementLikeByClassroomId({
    classroomId
  }: {
    classroomId: number
  }): Promise<ClassroomResponse> {
    try {
        const data = await serverFetch(`/api/Classroom/${classroomId}/like/increment`, {
            method: "PATCH",
        });

        return {
            data: data as ClassroomType[],
            error: undefined
        };
    } catch (error) {
        console.error('Lỗi khi tăng số lượt thích:', error);
        return {
            data: [],
            error: error instanceof Error ? error.message : "Có lỗi xảy ra khi tăng số lượt thích"
        };
    }
  }

export async function decrementLikeByClassroomId({
    classroomId
  }: {
    classroomId: number
  }): Promise<ClassroomResponse> {
    try {
        const data = await serverFetch(`/api/Classroom/${classroomId}/like/decrement`, {
            method: "PATCH",
        });

        return {
            data: data as ClassroomType[],
            error: undefined
        };
    } catch (error) {
        console.error('Lỗi khi giảm số lượt thích:', error);
        return {
            data: [],
            error: error instanceof Error ? error.message : "Có lỗi xảy ra khi giảm số lượt thích"
        };
    }
}


// Admin 
export async function getAllClassroomAdminData(): Promise<ClassroomResponse> {
  
  try {
    const data = await serverFetch(`/api/Classroom`);
    
    if (!Array.isArray(data)) {
      throw new Error("Dữ liệu không đúng định dạng");
    }

    return {
      data,
      error: undefined
    };

  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu bài học:', error);
    return {
      data: [],
      error: error instanceof Error ? error.message : "Có lỗi xảy ra khi lấy dữ liệu"
    };
  }
}

export async function getSingleClassroomAdminData({classroomId}: {classroomId: number}): Promise<ClassroomResponse> {
  try {
    const data = await serverFetch(`/api/Classroom/${classroomId}`);
    
    return {
      data,
      error: undefined
    };
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu bài học:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Có lỗi xảy ra khi lấy dữ liệu"
    };
  }
}

export async function createClassroomsAdminData({classData}: {classData: ClassroomType[]}): Promise<ClassroomResponse> {
  // console.log("classData123", classData)
  try {
    const response = await serverFetch(`/api/Classroom`, {
      method: "POST",
      data: classData
    });

    // console.log("response123", response)

    if (response.error) {
      return Promise.reject(new Error(response.error));
    }
    
    // if (!Array.isArray(response.data)) {
    //   return Promise.reject(new Error("Dữ liệu không đúng định dạng"));
    // }

    return {
      data: response.data,
      success: true,
    };

  } catch (error) {
    console.error('Lỗi khi tạo lớp học:', error);
    return Promise.reject(error);
  }
}

export async function updateClassroomAdminData({
  classroomId,
  classData
}: {
  classroomId: string;
  classData: {
    classname: string;
    description: string;
    imageurl: string;
    numliked: number;
    progress: number;
    order: number;
    class_id: number;
  };
}): Promise<ClassroomResponse> {
  try {
    // Log request data
    console.log("Server action update data:", {
      classroomId,
      classData
    });

    const response = await serverFetch(`/api/Classroom/${classroomId}`, {
      method: "PUT",
      data: classData
    });

    if (!response) {
      throw new Error("Không nhận được phản hồi từ server");
    }

    // Log response
    console.log("Server response:", response);

    return {
      data: response,
      error: undefined
    };
  } catch (error) {
    console.error("Server action error:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Lỗi không xác định"
    };
  }
}

export async function deleteClassroomAdminData({classroomId}: {classroomId: number}): Promise<ClassroomResponse> {
  try {
    const data = await serverFetch(`/api/Classroom/${classroomId}`, {
      method: "DELETE",
    });
    
    return {
      data,
      error: undefined
    };
  } catch (error) {
    console.error('Lỗi khi xóa lớp học:', error);
    return {
      data: [],
      error: error instanceof Error ? error.message : "Có lỗi xảy ra khi xóa lớp học"
    };
  }
}