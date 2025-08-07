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
    staleTime: 0,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchInterval: 60 * 1000
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
