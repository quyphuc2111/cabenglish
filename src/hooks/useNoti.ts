import {
  createNotiAdminData,
  deleteNotiAdminData,
  getAllNotiAdminData,
  getSingleNotiAdminData,
  sendNotiAdminData,
  updateNotiAdminData
} from "@/actions/notiActions";
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
    mutationFn: ({
      notiData,
      notiId
    }: {
      notiData: NotiAdminType;
      notiId: number;
    }) => updateNotiAdminData({ notiData, notiId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["noti"] });
    },
    onError: (error) => {
      console.error("Lỗi khi cập nhật notification:", error);
    }
  });
}

export const useGetSingleNoti = (ntId: string | null) => {
  return useQuery({
    queryKey: ["noti", ntId],
    queryFn: async () => {
      if (!ntId) return null;
      const response = await getSingleNotiAdminData({ 
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

export const useSendNoti = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (notificationId: number) => sendNotiAdminData(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["noti"] });
    },
    onError: (error) => {
      console.error("Lỗi khi gửi notification:", error);
    }
  });
};

export const useDeleteNoti = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (notificationId: number) => deleteNotiAdminData(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["noti"] });
    },
    onError: (error) => {
      console.error("Lỗi khi xóa notification:", error);
    }
  });
};

