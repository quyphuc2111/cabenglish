"use server"

import { serverFetch } from "@/lib/api";
import { ClassroomType } from "@/types/classroom";

interface ClassroomResponse {
  data: ClassroomType[];
  error?: string;
}

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
