import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteNotiTypeAdminData,
  getAllNotiTypeAdminData,
  getSingleNotiTypeAdminData,
  updateNotiTypeAdminData
} from "@/actions/notificationAction";
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
    onError: (error) => {
      console.error("Error creating notitype:", error);
    }
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
    enabled: !!ntId
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
    mutationFn: (ntId: number) => deleteNotiTypeAdminData({ ntId: ntId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notitypes"] });
    }
  });
};

export const useDeleteMultipleNotiTypes = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ntIds: number[]) => {
      // Xóa từng loại thông báo một cách tuần tự
      const deletePromises = ntIds.map(id => 
        deleteNotiTypeAdminData({ ntId: parseInt(id) })
      );
      
      const results = await Promise.allSettled(deletePromises);
      
      // Kiểm tra xem có lỗi nào không
      const failures = results.filter(result => result.status === 'rejected');
      if (failures.length > 0) {
        throw new Error(`Không thể xóa ${failures.length}/${ntIds.length} loại thông báo`);
      }
      
      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notitypes"] });
    }
  });
};

// Cache cho dữ liệu notitype để tránh gọi API nhiều lần
let notiTypeCache: any[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 phút

export async function checkNotiTypeExists(value: string | number) {
  const now = Date.now();
  
  // Kiểm tra cache còn hiệu lực không
  if (!notiTypeCache || (now - cacheTimestamp) > CACHE_DURATION) {
    const response = await getAllNotiTypeAdminData();
    if (!response.data) return false;
    notiTypeCache = response.data;
    cacheTimestamp = now;
  }
  
  return notiTypeCache.some((notitype: any) => notitype.value === value);
}

// Hàm batch validation để kiểm tra nhiều giá trị cùng lúc
export async function checkMultipleNotiTypeExists(values: (string | number)[]): Promise<boolean[]> {
  const now = Date.now();
  
  // Kiểm tra cache còn hiệu lực không
  if (!notiTypeCache || (now - cacheTimestamp) > CACHE_DURATION) {
    const response = await getAllNotiTypeAdminData();
    if (!response.data) return values.map(() => false);
    notiTypeCache = response.data;
    cacheTimestamp = now;
  }
  
  return values.map(value => {
    // Chuyển đổi cả giá trị cần kiểm tra và giá trị trong cache về string để so sánh
    const normalizedValue = String(value).trim();
    const exists = notiTypeCache!.some((notitype: any) => {
      const cacheValue = String(notitype.value).trim();
      return cacheValue === normalizedValue;
    });
    
    return exists;
  });
}

// Hàm để clear cache khi cần
export function clearNotiTypeCache() {
  notiTypeCache = null;
  cacheTimestamp = 0;
}
