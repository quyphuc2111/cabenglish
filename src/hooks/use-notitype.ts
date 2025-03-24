import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteNotiTypeAdminData, getAllNotiTypeAdminData, getSingleNotiTypeAdminData, updateNotiTypeAdminData } from "@/actions/notificationAction";
import { NotiTypeFormValues } from "@/lib/validations/notitype";
import { createNotiType } from "@/app/api/actions/notitype";

interface UpdateNotiTypeParams {
  ntId: number;
  data: NotiTypeFormValues;
}

export function useNotiType() {
  return useQuery({
    queryKey: ["notitypes"],
    queryFn: () => getAllNotiTypeAdminData()
  });
}

export function useCreateNotiType() {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: (data: NotiTypeFormValues) => createNotiType(data),
      onSuccess: () => {
        // Invalidate và refetch
        queryClient.invalidateQueries({ queryKey: ["notitypes"] });
      },
    });
  }
  
  export const useGetSingleNotiType = (ntId: string | null) => {
    return useQuery({
      queryKey: ["notitype", ntId],
      queryFn: async () => {
        if (!ntId) return null;
        const response = await getSingleNotiTypeAdminData({ 
          ntId: parseInt(ntId) 
        });
        if (response.error) {
          throw new Error(response.error);
        }
        return response.data;
      },
      enabled: !!ntId,
    });
  };
  
  export const useUpdateNotiType = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: async ({ ntId, data }: UpdateNotiTypeParams) => {
  
        const response = await updateNotiTypeAdminData({
          ntId: ntId,
          notiTypeData: {
            value: data.value,
            ntId: data.ntId || 0
          }
        });
  
        if (response.error) {
          throw new Error(`API Error: ${response.error}`);
        }
  
        return response;
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ["notitypes"] });
        queryClient.invalidateQueries({ 
          queryKey: ["notitype", variables.ntId] 
        });
      }
    });
  };

  export const useDeleteNotiType = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: (ntId: number) => deleteNotiTypeAdminData({ntId: ntId}),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["notitypes"] });
      },
    });
  };
  
  