'use client';

import { useEffect } from 'react';
import { useUserStore } from '@/store/useUserStore';
import { getUserInfo } from '@/actions/userAction';

interface UserStoreProviderProps {
  userId: string;
  children: React.ReactNode;
}

export default function UserStoreProvider({ userId, children }: UserStoreProviderProps) {
  const { setUser, user, setLoading, setError } = useUserStore();

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!userId) return;
      
      // Chỉ fetch nếu chưa có user hoặc userId khác
      if (!user || user.user_id !== userId) {
        setLoading(true);
        setError(null);
        
        try {
          const response = await getUserInfo({ userId });
          
          if (response.success && response.data) {
            setUser({
              user_id: response.data.user_id,
              email: response.data.email,
              language: response.data.language,
              theme: response.data.theme,
              mode: response.data.mode,
              is_firstlogin: response.data.is_firstlogin,
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
            });
          } else {
            setError(response.error || 'Không thể lấy thông tin người dùng');
          }
        } catch (error) {
          setError('Có lỗi xảy ra khi lấy thông tin người dùng');
          console.error('Error fetching user info:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserInfo();
  }, [userId, setUser, user, setLoading, setError]);

  return <>{children}</>;
} 