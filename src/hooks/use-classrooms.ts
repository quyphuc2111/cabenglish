import { createClassroom } from "@/app/api/actions/classroom";
import { deleteClassroomAdminData, getAllClassroomAdminData, getSingleClassroomAdminData, updateClassroomAdminData } from "@/actions/classroomAction";
import { ClassroomFormValues } from "@/lib/validations/classroom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { serverFetch } from "@/lib/api";

interface ClassroomParams {
  page?: number;
  limit?: number;
  search?: string;
}

interface UpdateClassroomParams {
  classId: string;
  data: {
    classname: string;
    description: string;
    imageurl: string;
    numliked?: number;
    progress?: number;
    order?: number;
    class_id?: number;
  };
}

// Tách hàm fetch để có thể dùng ở cả server và client
export const getClassrooms = async () => {
  return serverFetch('/api/Classroom');
};

// export const getClassrooms = async (params: ClassroomParams) => {
//   const searchParams = new URLSearchParams();
//   if (params.page) searchParams.set("page", params.page.toString());
//   if (params.limit) searchParams.set("limit", params.limit.toString());
//   if (params.search) searchParams.set("search", params.search);

//   return serverFetch(`/api/Classroom`);
// };

// Hook này chỉ dùng ở client components
export function useClassrooms() {
  return useQuery({
    queryKey: ["classrooms"],
    queryFn: () => getAllClassroomAdminData(),
  });
}

export function useCreateClassroom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ClassroomFormValues) => {
      const response = await createClassroom(data);
      if (response.error) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classrooms"] });
    },
    onError: (error: Error) => {
      console.error("Create error:", error);
      // toast.error(error.message || "Có lỗi xảy ra khi tạo lớp học");
    }
  });
}

export const useGetSingleClassroom = (classroomId: string | null) => {
  return useQuery({
    queryKey: ["classroom", classroomId],
    queryFn: async () => {
      if (!classroomId) return null;
      const response = await getSingleClassroomAdminData({ 
        classroomId: parseInt(classroomId) 
      });
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
    enabled: !!classroomId,
  });
};

export const useUpdateClassroom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ classId, data }: UpdateClassroomParams) => {

      const response = await updateClassroomAdminData({
        classroomId: classId,
        classData: {
          classname: data.classname,
          description: data.description,
          imageurl: data.imageurl, 
          numliked: data.numliked || 0,
          progress: data.progress || 0,
          order: data.order || 0,
          class_id: data.class_id || 0
        }
      });

      if (response.error) {
        throw new Error(`API Error: ${response.error}`);
      }

      return response;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["classrooms"] });
      queryClient.invalidateQueries({ 
        queryKey: ["classroom", variables.classId] 
      });
    }
  });
};

export const useDeleteClassroom = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (classroomId: string) => {
      const response = await deleteClassroomAdminData({classroomId: parseInt(classroomId)});
      // Kiểm tra và throw error nếu có
      if (response.error) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classrooms"] });
    }
  });
};


