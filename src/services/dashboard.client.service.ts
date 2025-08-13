import { getAllLessonDataByUserId } from "@/actions/lessonAction";
import { fetchFilterData } from "@/actions/filterAction";
import { initializeLocked } from "@/actions/lockedAction";
import { initializeProgress } from "@/actions/progressAction";
import { getAllClassroomDataByUserId } from "@/actions/classroomAction";

// Types for better type safety
interface ClientDashboardData {
  lockedData: any;
  progressData: any;
  courseData: any[];
  filterData: any;
  classroomData: any[];
}

interface ClientDashboardError extends Error {
  code?: string;
  statusCode?: number;
}

type UserMode = "default" | "free";

// Client-side cache for initialization calls
const clientInitCache = new Map<
  string,
  { promise: Promise<any>; timestamp: number }
>();
const CLIENT_CACHE_TTL = 3 * 60 * 1000; // 3 minutes for client-side

// Helper function to create cache key
const createClientCacheKey = (
  userId: string,
  type: string,
  mode?: UserMode
): string => {
  return `client:${type}:${userId}:${mode || "default"}`;
};

// Helper function to get cached or execute initialization with TTL check
const getClientCachedInit = async <T>(
  cacheKey: string,
  initFn: () => Promise<T>
): Promise<T> => {
  const cached = clientInitCache.get(cacheKey);
  const now = Date.now();

  // Check if cache exists and is not expired
  if (cached && now - cached.timestamp < CLIENT_CACHE_TTL) {
    return cached.promise;
  }

  // Create new promise and cache it
  const promise = initFn();
  clientInitCache.set(cacheKey, { promise, timestamp: now });

  // Clean up expired entries
  setTimeout(() => {
    const entry = clientInitCache.get(cacheKey);
    if (entry && Date.now() - entry.timestamp >= CLIENT_CACHE_TTL) {
      clientInitCache.delete(cacheKey);
    }
  }, CLIENT_CACHE_TTL);

  return promise;
};

// Validation helper
const validateClientUserId = (userId: string): void => {
  if (!userId || typeof userId !== "string" || userId.trim() === "") {
    throw new Error("Invalid userId: userId must be a non-empty string");
  }
};

// Enhanced error handling for client
const handleClientError = (error: unknown, context: string): never => {
  const clientError: ClientDashboardError =
    error instanceof Error
      ? (error as ClientDashboardError)
      : new Error(`Unknown error in ${context}`);

  // Add context to error
  clientError.message = `[Client ${context}] ${clientError.message}`;

  console.error(`Dashboard Client Service Error - ${context}:`, {
    message: clientError.message,
    stack: clientError.stack,
    code: clientError.code,
    statusCode: clientError.statusCode,
    timestamp: new Date().toISOString(),
    userAgent:
      typeof window !== "undefined" ? window.navigator.userAgent : "server"
  });

  throw clientError;
};

// Performance monitoring
const performanceMonitor = {
  start: (operation: string) => {
    const startTime = performance.now();
    return {
      end: () => {
        const duration = performance.now() - startTime;
        console.log(`⏱️ ${operation} took ${duration.toFixed(2)}ms`);
        return duration;
      }
    };
  }
};

export const DashboardClientService = {
  /**
   * Fetch dashboard data with optimized caching and error handling
   * @param userId - User identifier
   * @param mode - User mode (default | free)
   * @returns Promise<ClientDashboardData>
   */
  async fetchDashboardData(
    userId: string,
    mode: UserMode = "default"
  ): Promise<ClientDashboardData> {
    const monitor = performanceMonitor.start(
      `fetchDashboardData(${userId}, ${mode})`
    );

    try {
      validateClientUserId(userId);

      if (!mode || !["default", "free"].includes(mode)) {
        throw new Error(`Invalid mode: ${mode}. Must be 'default' or 'free'`);
      }

      console.log(
        "📚 Fetching dashboard data with userId:",
        userId,
        "and mode:",
        mode
      );

      // Step 1: Initialize with cached calls to prevent redundancy
      const [lockedData, progressData] = await Promise.all([
        getClientCachedInit(createClientCacheKey(userId, "locked", mode), () =>
          initializeLocked({ userId, mode })
        ),
        getClientCachedInit(createClientCacheKey(userId, "progress"), () =>
          initializeProgress(userId)
        )
      ]);

      // Step 2: Fetch main data in parallel after initialization
      const [courseData, filterData, classroomData] = await Promise.all([
        getAllLessonDataByUserId({ userId, mode }),
        fetchFilterData({ userId }),
        getAllClassroomDataByUserId({ userId })
      ]);

      const result = {
        lockedData,
        progressData,
        courseData: courseData.data || [],
        filterData,
        classroomData: classroomData.data || []
      };

      monitor.end();
      return result;
    } catch (error) {
      monitor.end();
      handleClientError(error, "fetchDashboardData");
    }
  },

  /**
   * Refresh dashboard data by clearing cache and fetching fresh data
   * @param userId - User identifier
   * @param mode - User mode (default | free)
   * @returns Promise<ClientDashboardData>
   */
  async refreshDashboardData(
    userId: string,
    mode: UserMode = "default"
  ): Promise<ClientDashboardData> {
    try {
      validateClientUserId(userId);

      // Clear cache for this user
      this.clearUserCache(userId);

      console.log("🔄 Refreshing dashboard data for user:", userId);

      return await this.fetchDashboardData(userId, mode);
    } catch (error) {
      handleClientError(error, "refreshDashboardData");
    }
  },

  /**
   * Clear cached initialization data for a specific user
   * @param userId - User identifier
   */
  clearUserCache(userId: string): void {
    try {
      validateClientUserId(userId);

      const keysToDelete = Array.from(clientInitCache.keys()).filter((key) =>
        key.includes(userId)
      );

      keysToDelete.forEach((key) => clientInitCache.delete(key));

      console.log(
        `🗑️ Cleared client cache for user: ${userId}, entries: ${keysToDelete.length}`
      );
    } catch (error) {
      console.warn("Error clearing client user cache:", error);
    }
  },

  /**
   * Clear all cached data
   */
  clearAllCache(): void {
    const size = clientInitCache.size;
    clientInitCache.clear();
    console.log(`🗑️ Cleared all client cache, removed ${size} entries`);
  },

  /**
   * Get cache statistics for monitoring
   */
  getCacheStats() {
    const now = Date.now();
    const entries = Array.from(clientInitCache.entries()).map(
      ([key, value]) => ({
        key,
        age: now - value.timestamp,
        expired: now - value.timestamp >= CLIENT_CACHE_TTL
      })
    );

    return {
      size: clientInitCache.size,
      entries,
      expiredCount: entries.filter((e) => e.expired).length
    };
  },

  /**
   * Preload dashboard data for better UX
   * @param userId - User identifier
   * @param mode - User mode (default | free)
   */
  async preloadDashboardData(
    userId: string,
    mode: UserMode = "default"
  ): Promise<void> {
    try {
      validateClientUserId(userId);

      console.log("🚀 Preloading dashboard data for user:", userId);

      // Preload initialization data only
      await Promise.all([
        getClientCachedInit(createClientCacheKey(userId, "locked", mode), () =>
          initializeLocked({ userId, mode })
        ),
        getClientCachedInit(createClientCacheKey(userId, "progress"), () =>
          initializeProgress(userId)
        )
      ]);

      console.log("✅ Preload completed for user:", userId);
    } catch (error) {
      console.warn("Preload failed:", error);
      // Don't throw error for preload failures
    }
  }
};
