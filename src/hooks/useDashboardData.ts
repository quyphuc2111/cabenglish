import { useState, useEffect } from 'react';
import { DashboardService } from '@/services/dashboard.service';
import { useUserInfo } from '@/hooks/useUserInfo';

export const useDashboardData = (userId: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  
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