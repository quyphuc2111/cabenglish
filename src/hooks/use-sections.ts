import {
  deleteSectionAdminData,
  getSectionAdminDataByLessonId,
  getSingleSectionAdminData,
  updateSectionAdminData
} from "@/actions/sectionAction";
import { createSection } from "@/app/api/actions/section";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SectionAdminType } from "@/types/section";

interface SectionParams {
  sectionName?: string;
  iconUrl?: string;
  estimateTime?: string;
  order?: number;
  lessonId: number;
  sectionId?: number;
  sectionData?: SectionAdminType;
  sectionIds?: string[];
}

interface SectionResponse {
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
}

export const useGetSingleSection = (sectionId: string | null) => {
  return useQuery({
    queryKey: ["section", sectionId],
    queryFn: async () => {
      if (!sectionId) return null;
      const response = await getSingleSectionAdminData({
        sectionId: parseInt(sectionId)
      });
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
    enabled: !!sectionId
  });
};

export function useCreateSection() {
  const queryClient = useQueryClient();

  return useMutation<SectionResponse, Error, any>({
    mutationFn: async (params) => {
      if (!params.lessonId) {
        throw new Error("Không tìm thấy thông tin lesson");
      }

      if (!params.sectionData || !Array.isArray(params.sectionData)) {
        throw new Error("Dữ liệu section không hợp lệ");
      }

      const response = await createSection({
        sectionData: params.sectionData,
        lessonId: params.lessonId
      });

      if (!response.success) {
        throw new Error(response.error || "Có lỗi xảy ra khi tạo section");
      }

      return response;
    },

    onSuccess: async (response, variables) => {
      console.log('Mutation success with lessonId:', variables.lessonId);
      console.log('Response data:', response);
      
      // Invalidate để refetch data mới từ server
      await queryClient.invalidateQueries({
        queryKey: ["sections", variables.lessonId]
      });
      
      // Đảm bảo refetch để có data mới nhất
      await queryClient.refetchQueries({
        queryKey: ["sections", variables.lessonId]
      });
    },

    onError: (error) => {
      console.error("Create section error:", error);
    }
  });
}

export function useUpdateSection() {
  const queryClient = useQueryClient();

  return useMutation<SectionResponse, Error, SectionParams>({
    mutationFn: async (params: SectionParams): Promise<SectionResponse> => {
      
      if (!params.sectionData) {
        throw new Error("Không tìm thấy thông tin sectionData");
      }

      if (!params.lessonId) {
        throw new Error("Không tìm thấy thông tin lesson");
      }

      if (!params.sectionId) {
        throw new Error("Không tìm thấy thông tin sectionId");
      }

      const response = await updateSectionAdminData({
        sectionId: params.sectionId,
        lessonId: params.lessonId,
        sectionData: params.sectionData
      });

      return {
        success: response.success || false,
        data: response.data,
        error: response.error,
        message: response.message
      };
    },

    onSuccess: async (_, variables) => {
      // Invalidate các queries liên quan
      await queryClient.invalidateQueries({
        queryKey: ["sections", variables.lessonId]
      });
    },

    onError: (error) => {
      console.error("Update section error:", error);
    }
  });
}

export function useGetSectionByLessonId(lessonId: number) {
  return useQuery({
    queryKey: ["sections", lessonId],
    queryFn: async () => {
      if (!lessonId || lessonId <= 0) {
        return { data: [] };
      }
      
      const response = await getSectionAdminDataByLessonId({ lessonId });
      if (response.error) {
        throw new Error(response.error);
      }
      return response;
    },
    enabled: !!lessonId && lessonId > 0
  });
}

export function useDeleteSection() {
  const queryClient = useQueryClient();

  return useMutation<SectionResponse, Error, SectionParams>({
    mutationFn: async (params: SectionParams): Promise<SectionResponse> => {
      if (!params.sectionIds || !Array.isArray(params.sectionIds)) {
        throw new Error("Không tìm thấy thông tin sectionIds");
      }

      if (!params.lessonId) {
        throw new Error("Không tìm thấy thông tin lessonId");
      }
      
      // Convert string IDs to numbers
      const sectionIds = params.sectionIds.map((id: string) => parseInt(id)).filter((id: number) => !isNaN(id));
      
      if (sectionIds.length === 0) {
        throw new Error("Không có section hợp lệ để xóa");
      }
      
      const response = await deleteSectionAdminData({ 
        sectionIds: sectionIds, 
        lessonId: params.lessonId 
      });

      return {
        success: true,
        data: response,
        error: undefined
      };
    },
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ["sections", variables.lessonId]
      });
    },
    onError: (error) => {
      console.error("Delete section error:", error);
    }
  });
}
