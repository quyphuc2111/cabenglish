/**
 * Safe wrapper for useUserInfo to prevent runtime errors
 */

import { useQuery } from '@tanstack/react-query';
import { getUserInfo } from '@/actions/userAction';
import { UserInfo } from '@/types/user';

// Safe useUserInfo with fallback
export const useSafeUserInfo = (userId?: string) => {
  return useQuery({
    queryKey: ['userInfo', userId],
    queryFn: async (): Promise<UserInfo> => {
      if (!userId) {
        // Return default user info instead of throwing
        return {
          user_id: '',
          email: '',
          language: 'vi',
          theme: 'theme-red',
          mode: 'default',
          is_firstlogin: false,
          progress: {
            units: [],
            lessons: [],
            sections: [],
            classrooms: []
          },
          locked: {
            sections: [],
            section_contents: [],
            lessons: []
          }
        } as UserInfo;
      }
      
      try {
        const response = await getUserInfo({ userId });
        if (!response.success) {
          console.warn('Failed to fetch user info:', response.error);
          // Return default instead of throwing
          return {
            user_id: userId,
            email: '',
            language: 'vi',
            theme: 'theme-red',
            mode: 'default',
            is_firstlogin: false,
            progress: {
              units: [],
              lessons: [],
              sections: [],
              classrooms: []
            },
            locked: {
              sections: [],
              section_contents: [],
              lessons: []
            }
          } as UserInfo;
        }
        return response.data as UserInfo;
      } catch (error) {
        console.warn('Error fetching user info:', error);
        // Return default instead of throwing
        return {
          user_id: userId,
          email: '',
          language: 'vi',
          theme: 'theme-red',
          mode: 'default',
          is_firstlogin: false,
          progress: {
            units: [],
            lessons: [],
            sections: [],
            classrooms: []
          },
          locked: {
            sections: [],
            section_contents: [],
            lessons: []
          }
        } as UserInfo;
      }
    },
    enabled: true, // Always enabled, will return default if no userId
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1, // Only retry once
    retryDelay: 1000,
  });
};

// Export as useUserInfo for compatibility
export const useUserInfo = useSafeUserInfo;

// Hook to invalidate user info cache
export const useInvalidateUserInfo = () => {
  const { useQueryClient } = require('@tanstack/react-query');
  const queryClient = useQueryClient();
  
  return () => {
    queryClient.invalidateQueries({
      queryKey: ['userInfo']
    });
  };
};

export default useSafeUserInfo;
