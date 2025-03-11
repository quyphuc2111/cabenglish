import { useState, useEffect } from 'react';
import { DashboardService } from '@/services/dashboard.service';

export const useDashboardData = (userId: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await DashboardService.fetchDashboardData(userId);
        setDashboardData(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  return { dashboardData, isLoading, error };
}; 