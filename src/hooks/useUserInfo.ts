import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getUserInfo } from '@/actions/userAction';
import { UserInfo } from '@/types/user';


export const useUserInfo = (userId?: string) => {
  return useQuery({
    queryKey: ['userInfo', userId],
    queryFn: async () : Promise<UserInfo> => {
      if (!userId) throw new Error('UserId is required');
      const response = await getUserInfo({ userId });
      if (!response.success) {
        throw new Error(response.error || "Failed to fetch user info");
      }
      return response.data as UserInfo;
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // ✅ Giảm cache từ 5 phút xuống 2 phút để theme update nhanh hơn
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false, // Tắt refetch khi focus - giảm CPU
    refetchOnMount: false, // Tắt refetch khi mount - sử dụng cache
    refetchOnReconnect: true, // ✅ Giữ lại để sync khi mất kết nối
    // refetchInterval: 60 * 1000 // Tắt polling - giảm CPU đáng kể
  });
};

export const useInvalidateUserInfo = () => {
  const queryClient = useQueryClient();

  return (userId?: string) => {
    if (userId) {
      queryClient.invalidateQueries({
        queryKey: ["userInfo", userId]
      });
    }
  };
};

export const useRefreshUserInfo = () => {
  const queryClient = useQueryClient();

  return (userId?: string) => {
    if (userId) {
      // Force refetch ngay lập tức
      queryClient.refetchQueries({
        queryKey: ["userInfo", userId]
      });
    }
  };
};
