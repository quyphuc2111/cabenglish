

import { createNotiAdminData, getAllNotiAdminData, updateNotiAdminData } from "@/actions/notiActions";
import { NotiAdminType } from "@/types/notification";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useNoti() {
    return useQuery({
      queryKey: ["noti"],
      queryFn: () => getAllNotiAdminData()
    });
  }
  

  export function useCreateNoti() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (notiData: NotiAdminType) => createNotiAdminData(notiData),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["noti"] });
      },
      onError: (error) => {
        console.error("Lỗi khi tạo notification:", error);
      }
    });
  }
  
  export function useUpdateNoti() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({notiData, notiId}: {notiData: NotiAdminType, notiId: number}) => updateNotiAdminData({notiData, notiId}),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["noti"] });
      },
      onError: (error) => {
        console.error("Lỗi khi cập nhật notification:", error);
      }
    });
  }
