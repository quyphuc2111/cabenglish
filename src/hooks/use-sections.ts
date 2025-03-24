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
  sectionName: string;
  iconUrl: string;
  estimateTime: string;
  order: number;
  lessonId: number;
  sectionId: number;
  sectionData: SectionAdminType
}

interface SectionResponse {
  success: boolean;
  data?: any;
  error?: string;
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

  return useMutation<SectionResponse, Error, SectionParams>({
    mutationFn: async (params) => {
      if (!params.lessonId) {
        throw new Error("Không tìm thấy thông tin lesson");
      }

      const response = await createSection({
        sectionData: params.sectionData,
        lessonId: params.lessonId
      });

      if (!response.success) {
        throw new Error(response.error || "Có lỗi xảy ra khi tạo bài học");
      }

      return response;
    },

    onSuccess: (_, variables) => {
      // Cập nhật lại query cache cho section list
      queryClient.invalidateQueries({
        queryKey: ["sections-by-lesson-id", variables.lessonId]
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
    mutationFn: async (params: SectionParams) => {
      
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

      if (!response.success) {
        throw new Error(response.error || "Có lỗi xảy ra khi cập nhật section");
      }

      return response;
    },

    onSuccess: (_, variables) => {
      // Invalidate các queries liên quan
      queryClient.invalidateQueries({
        queryKey: ["sections-by-lesson-id", variables.lessonId]
      });
    },

    onError: (error) => {
      console.error("Update section error:", error);
    }
  });
}

export function useGetSectionByLessonId(lessonId: number) {
  return useQuery({
    queryKey: ["sections-by-lesson-id", lessonId],
    queryFn: async () => {
      const response = await getSectionAdminDataByLessonId({ lessonId });
      console.log("response", response);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
    enabled: !!lessonId
  });
}

export function useDeleteSection() {
  const queryClient = useQueryClient();

  return useMutation<SectionResponse, Error, SectionParams>({
    mutationFn: async (params: SectionParams) => {
      if (!params.sectionIds) {
        throw new Error("Không tìm thấy thông tin sectionIds");
      }

      if (!params.lessonId) {
        throw new Error("Không tìm thấy thông tin lessonId");
      }
      
      const response = await deleteSectionAdminData({ sectionIds: params.sectionIds, lessonId: params.lessonId });

      return response;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["sections-by-lesson-id", variables.lessonId]
      });
    },
    onError: (error) => {
      console.error("Delete section error:", error);
    }
  });
}
