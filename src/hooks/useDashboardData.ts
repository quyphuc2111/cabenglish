import { useState, useEffect, useRef, useCallback } from "react";
import { DashboardService } from "@/services/dashboard.service";
import { useUserInfo } from "@/hooks/useUserInfo";

// Types for better type safety
interface DashboardData {
  courseData: any[];
  filterData: any;
  lockedData: any;
  classroomData: any[];
  progressData: any;
}

interface UseDashboardDataReturn {
  dashboardData: DashboardData | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  clearCache: () => void;
}

type UserMode = "default" | "free";

// Enhanced hook with better error handling and performance
export const useDashboardData = (userId: string): UseDashboardDataReturn => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );

  // Ref để track lần fetch cuối cùng và tránh duplicate calls
  const lastFetchRef = useRef<{ userId: string; mode: string } | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const {
    data: userInfo,
    isLoading: userInfoLoading,
    error: userInfoError
  } = useUserInfo(userId);

  // Validate userId
  const isValidUserId =
    userId && typeof userId === "string" && userId.trim() !== "";

  const fetchData = useCallback(
    async (forceRefresh = false) => {
      // Abort previous request if still pending
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      try {
        setIsLoading(true);
        setError(null);

        // Validate inputs
        if (!isValidUserId) {
          throw new Error("Invalid userId provided");
        }

        // Đợi userInfo load xong và có mode
        if (!userInfo?.mode) {
          return;
        }

        // Kiểm tra xem có cần fetch lại không (tránh duplicate calls)
        const currentFetch = { userId, mode: userInfo.mode };
        if (
          !forceRefresh &&
          lastFetchRef.current &&
          lastFetchRef.current.userId === currentFetch.userId &&
          lastFetchRef.current.mode === currentFetch.mode
        ) {
          setIsLoading(false);
          return;
        }

        lastFetchRef.current = currentFetch;

        console.log(
          `🔄 Fetching dashboard data for user: ${userId}, mode: ${userInfo.mode}`
        );

        const startTime = performance.now();
        const data = await DashboardService.fetchDashboardDataWithMode(
          userId,
          userInfo.mode as UserMode
        );
        const duration = performance.now() - startTime;

        console.log(`✅ Dashboard data loaded in ${duration.toFixed(2)}ms`);

        // Check if request was aborted
        if (abortControllerRef.current?.signal.aborted) {
          return;
        }

        setDashboardData(data);
      } catch (err) {
        // Don't set error if request was aborted
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        console.error("❌ Dashboard data fetch failed:", err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    },
    [userId, userInfo, isValidUserId]
  );

  // Refetch function for manual refresh
  const refetch = useCallback(async () => {
    await fetchData(true);
  }, [fetchData]);

  // Clear cache function
  const clearCache = useCallback(() => {
    lastFetchRef.current = null;
    DashboardService.clearUserCache(userId);
    console.log(`🗑️ Cleared dashboard cache for user: ${userId}`);
  }, [userId]);

  useEffect(() => {
    if (!userInfoLoading && !userInfoError && userInfo && isValidUserId) {
      fetchData();
    } else if (userInfoError) {
      setError(userInfoError);
      setIsLoading(false);
    }

    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData, userInfoLoading, userInfoError, userInfo, isValidUserId]);

  // Reset state when userId changes
  useEffect(() => {
    setDashboardData(null);
    setError(null);
    lastFetchRef.current = null;
  }, [userId]);

  return {
    dashboardData,
    isLoading: isLoading || userInfoLoading,
    error: error || userInfoError,
    refetch,
    clearCache
  };
};
