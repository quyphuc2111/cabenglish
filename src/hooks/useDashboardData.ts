import { useState, useEffect, useRef } from 'react';
import { DashboardService } from '@/services/dashboard.service';
import { useUserInfo } from '@/hooks/useUserInfo';

export const useDashboardData = (userId: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);

  // Ref để track lần fetch cuối cùng và tránh duplicate calls
  const lastFetchRef = useRef<{ userId: string; mode: string } | null>(null);

  const { data: userInfo, isLoading: userInfoLoading, error: userInfoError } = useUserInfo(userId);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Đợi userInfo load xong và có mode
        if (!userInfo?.mode) {
          return;
        }

        // Kiểm tra xem có cần fetch lại không (tránh duplicate calls)
        const currentFetch = { userId, mode: userInfo.mode };
        if (lastFetchRef.current &&
            lastFetchRef.current.userId === currentFetch.userId &&
            lastFetchRef.current.mode === currentFetch.mode) {
          setIsLoading(false);
          return;
        }

        lastFetchRef.current = currentFetch;

        const data = await DashboardService.fetchDashboardDataWithMode(userId, userInfo.mode as "default" | "free");
        setDashboardData(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    // Chỉ fetch khi userInfo đã load xong và không có lỗi
    if (!userInfoLoading && !userInfoError && userInfo) {
      fetchData();
    } else if (userInfoError) {
      setError(userInfoError);
      setIsLoading(false);
    }
  }, [userId, userInfo, userInfoLoading, userInfoError]);

  return { 
    dashboardData, 
    isLoading: isLoading || userInfoLoading, 
    error: error || userInfoError 
  };
}; 