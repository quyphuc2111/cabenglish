import { createSectionContentAdminData, deleteSectionContentAdminData, getSectionContentBySectionId, updateSectionContentAdminData } from "@/actions/sectionContentAction";
import { SectionContentAdminType } from "@/types/section";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface SectionContentResponse {
  success: boolean;
  data?: any;
  error?: string;
}

interface SectionContentParams {
  sectionContentData: SectionContentAdminType[];
  sectionIds: number;
  sectionContentIds: number[];
}

export function useGetSectionContentBySectionId(sectionId: number) {
  return useQuery({
    queryKey: ["section-content-by-section-id", sectionId],
    queryFn: async () => {
      const response = await getSectionContentBySectionId({ sectionId });

      if (response.error) {
        throw new Error(response.error);
      }

      return response.data;
    },
    enabled: !!sectionId
  });
}


  
export function useCreateSectionContent() {
  const queryClient = useQueryClient();

  return useMutation<SectionContentResponse, Error, SectionContentParams>({
    mutationFn: async (params) => {
      if (!params.sectionIds) {
        throw new Error("Không tìm thấy thông tin sectionIds");
      }

      const response = await createSectionContentAdminData({
        sectionContentData: params.sectionContentData,
        sectionId: params.sectionIds
      });

      if (!response.success) {
        throw new Error(response.error || "Có lỗi xảy ra khi tạo bài học");
      }

      return response;
    },

    onSuccess: (_, variables) => {
      // Invalidate và refetch tất cả các queries liên quan
      queryClient.invalidateQueries({
        queryKey: ["section-content-by-section-id"]
      });

      // Refetch ngay lập tức
      queryClient.refetchQueries({
        queryKey: ["section-content-by-section-id", variables.sectionIds],
        exact: true
      });
    },

    onError: (error) => {
      console.error("Create section content error:", error);
    }
  });
}

export function useUpdateSectionContent() {
  const queryClient = useQueryClient();

  return useMutation<SectionContentResponse, Error, SectionContentParams>({
    mutationFn: async (params: SectionContentParams) => {
      
      if (!params.sectionContentData) {
        throw new Error("Không tìm thấy thông tin sectionData");
      }

      if (!params.sectionIds) {
        throw new Error("Không tìm thấy thông tin sectionId");
      }

      const response = await updateSectionContentAdminData({
        sectionId: params.sectionIds,
        sectionContentData: params.sectionContentData
      });

      if (!response.success) {
        throw new Error(response.error || "Có lỗi xảy ra khi cập nhật section");
      }

      return response;
    },

    onSuccess: (_, variables) => {
      // Invalidate và refetch tất cả các queries liên quan
      queryClient.invalidateQueries({
        queryKey: ["section-content-by-section-id"]
      });

      // Refetch ngay lập tức
      queryClient.refetchQueries({
        queryKey: ["section-content-by-section-id", variables.sectionIds],
        exact: true
      });
    },

    onError: (error) => {
      console.error("Update section content error:", error);
    }
  });
}

export function useDeleteSectionContent() {
    const queryClient = useQueryClient();
  
    return useMutation<SectionContentResponse, Error, SectionContentParams>({
      mutationFn: async (params: SectionContentParams) => {
        if (!params.sectionIds) {
          throw new Error("Không tìm thấy thông tin sectionIds");
        }
        
        const response = await deleteSectionContentAdminData({ sectionId: params.sectionIds, sectionContentIds: params.sectionContentIds});
  
        return response;
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({
          queryKey: ["section-content-by-section-id", variables.sectionIds]
        });
      },
      onError: (error) => {
        console.error("Delete section content error:", error);
      }
    });
  }