import { getAllLessonDataByUserId } from "@/actions/lessonAction";
import { fetchFilterData } from "@/actions/filterAction";
import { initializeLocked } from "@/actions/lockedAction";
import {
  initializeProgress,
  resetLessonProgress
} from "@/actions/progressAction";
import { getAllClassroomDataByUserId } from "@/actions/classroomAction";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Types for better type safety
interface DashboardData {
  courseData: any[];
  filterData: any;
  lockedData: any;
  classroomData: any[];
  progressData: any;
}

interface DashboardError extends Error {
  code?: string;
  statusCode?: number;
}

type UserMode = "default" | "free";

// Cache for initialization calls to prevent redundant API calls
const initializationCache = new Map<string, Promise<any>>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Helper function to create cache key
const createCacheKey = (
  userId: string,
  type: string,
  mode?: UserMode
): string => {
  return `${type}:${userId}:${mode || "default"}`;
};

// Helper function to get cached or execute initialization
const getCachedInitialization = async <T>(
  cacheKey: string,
  initFn: () => Promise<T>
): Promise<T> => {
  if (initializationCache.has(cacheKey)) {
    return initializationCache.get(cacheKey);
  }

  const promise = initFn();
  initializationCache.set(cacheKey, promise);

  // Clear cache after TTL
  setTimeout(() => {
    initializationCache.delete(cacheKey);
  }, CACHE_TTL);

  return promise;
};

// Validation helper
const validateUserId = (userId: string): void => {
  if (!userId || typeof userId !== "string" || userId.trim() === "") {
    throw new Error("Invalid userId: userId must be a non-empty string");
  }
};

// Enhanced error handling
const handleDashboardError = (error: unknown, context: string): never => {
  const dashboardError: DashboardError =
    error instanceof Error
      ? (error as DashboardError)
      : new Error(`Unknown error in ${context}`);

  // Add context to error
  dashboardError.message = `[${context}] ${dashboardError.message}`;

  console.error(`Dashboard Service Error - ${context}:`, {
    message: dashboardError.message,
    stack: dashboardError.stack,
    code: dashboardError.code,
    statusCode: dashboardError.statusCode,
    timestamp: new Date().toISOString()
  });

  throw dashboardError;
};

// Core data fetching with optimized initialization
const fetchCoreData = async (userId: string, mode: UserMode) => {
  validateUserId(userId);

  // Use cached initialization to prevent redundant calls
  const [lockedData, progressData] = await Promise.all([
    getCachedInitialization(createCacheKey(userId, "locked", mode), () =>
      initializeLocked({ userId, mode })
    ),
    getCachedInitialization(createCacheKey(userId, "progress"), () =>
      initializeProgress(userId)
    )
  ]);

  // Fetch main data in parallel after initialization
  const [courseData, filterData, classroomData] = await Promise.all([
    getAllLessonDataByUserId({ userId, mode }),
    fetchFilterData({ userId }),
    getAllClassroomDataByUserId({ userId })
  ]);

  return {
    lockedData,
    progressData,
    courseData: courseData.data || [],
    filterData,
    classroomData: classroomData.data || []
  };
};

export const DashboardService = {
  /**
   * Fetch dashboard data with session-based mode detection
   * @param userId - User identifier
   * @returns Promise<DashboardData>
   */
  async fetchDashboardData(userId: string): Promise<DashboardData> {
    try {
      validateUserId(userId);

      const session = await getServerSession(authOptions);
      const mode = (session?.user?.mode as UserMode) || "default";

      console.log(
        `📊 Fetching dashboard data for user: ${userId}, mode: ${mode}`
      );

      return await fetchCoreData(userId, mode);
    } catch (error) {
      handleDashboardError(error, "fetchDashboardData");
    }
  },

  /**
   * Fetch dashboard data with explicit mode
   * @param userId - User identifier
   * @param mode - User mode (default | free)
   * @returns Promise<DashboardData>
   */
  async fetchDashboardDataWithMode(
    userId: string,
    mode: UserMode
  ): Promise<DashboardData> {
    try {
      validateUserId(userId);

      if (!mode || !["default", "free"].includes(mode)) {
        throw new Error(`Invalid mode: ${mode}. Must be 'default' or 'free'`);
      }

      console.log(
        `📊 Fetching dashboard data for user: ${userId}, explicit mode: ${mode}`
      );

      return await fetchCoreData(userId, mode);
    } catch (error) {
      handleDashboardError(error, "fetchDashboardDataWithMode");
    }
  },

  /**
   * Reset lesson progress for specific lessons
   * @param userId - User identifier
   * @param lessonIds - Array of lesson IDs to reset
   * @returns Promise<any>
   */
  async resetLessonProgress(userId: string, lessonIds: number[]): Promise<any> {
    try {
      validateUserId(userId);

      if (!Array.isArray(lessonIds) || lessonIds.length === 0) {
        throw new Error("Invalid lessonIds: must be a non-empty array");
      }

      if (!lessonIds.every((id) => typeof id === "number" && id > 0)) {
        throw new Error("Invalid lessonIds: all IDs must be positive numbers");
      }

      console.log(
        `🔄 Resetting progress for user: ${userId}, lessons: ${lessonIds.join(
          ", "
        )}`
      );

      const response = await resetLessonProgress({ userId, lessonIds });

      // Clear related cache entries after reset
      const progressCacheKey = createCacheKey(userId, "progress");
      initializationCache.delete(progressCacheKey);

      return response;
    } catch (error) {
      handleDashboardError(error, "resetLessonProgress");
    }
  },

  /**
   * Clear all cached initialization data for a user
   * @param userId - User identifier
   */
  clearUserCache(userId: string): void {
    try {
      validateUserId(userId);

      const keysToDelete = Array.from(initializationCache.keys()).filter(
        (key) => key.includes(userId)
      );

      keysToDelete.forEach((key) => initializationCache.delete(key));

      console.log(
        `🗑️ Cleared cache for user: ${userId}, entries: ${keysToDelete.length}`
      );
    } catch (error) {
      console.warn("Error clearing user cache:", error);
    }
  },

  /**
   * Get cache statistics for monitoring
   */
  getCacheStats() {
    return {
      size: initializationCache.size,
      keys: Array.from(initializationCache.keys())
    };
  }
};
