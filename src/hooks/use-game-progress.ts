import { useQuery, UseQueryResult } from "@tanstack/react-query";
import {
  getGameProgress,
  GetGameProgressParams,
  GameProgressData
} from "@/lib/game-api";

/**
 * Hook to fetch game progress statistics
 * Supports filtering by topics and ages
 * 
 * @example
 * ```tsx
 * // Get overall progress (no filters)
 * const { data, isLoading } = useGameProgress();
 * 
 * // Get progress filtered by topics
 * const { data } = useGameProgress({ topicIds: [1, 2] });
 * 
 * // Get progress filtered by ages
 * const { data } = useGameProgress({ ageIds: [1] });
 * 
 * // Get progress filtered by both
 * const { data } = useGameProgress({ 
 *   topicIds: [1, 2], 
 *   ageIds: [1] 
 * });
 * ```
 */
export function useGameProgress(
  params: GetGameProgressParams = {},
  options?: {
    enabled?: boolean;
    refetchInterval?: number;
    staleTime?: number;
  }
): UseQueryResult<GameProgressData, Error> {
  const { topicIds = [], ageIds = [] } = params;
  const { enabled = true, refetchInterval, staleTime = 0 } = options || {};

  // Create a stable query key based on filters
  const queryKey = ["game-progress", { topicIds, ageIds }];

  return useQuery<GameProgressData, Error>({
    queryKey,
    queryFn: async () => {
      const response = await getGameProgress({ topicIds, ageIds });
      return response.data;
    },
    enabled,
    staleTime,
    refetchInterval,
    refetchOnWindowFocus: true,
    retry: 1
  });
}

/**
 * Hook to fetch overall game progress (no filters)
 * Convenient wrapper around useGameProgress
 * 
 * @example
 * ```tsx
 * const { data, isLoading } = useOverallGameProgress();
 * console.log(data?.total_active_games);
 * console.log(data?.progress_percentage);
 * ```
 */
export function useOverallGameProgress(
  options?: {
    enabled?: boolean;
    refetchInterval?: number;
  }
) {
  return useGameProgress({}, options);
}

/**
 * Hook to fetch game progress filtered by topics
 * 
 * @example
 * ```tsx
 * const { data } = useGameProgressByTopics([1, 2, 3]);
 * ```
 */
export function useGameProgressByTopics(
  topicIds: number[],
  options?: {
    enabled?: boolean;
    refetchInterval?: number;
  }
) {
  return useGameProgress({ topicIds }, options);
}

/**
 * Hook to fetch game progress filtered by ages
 * 
 * @example
 * ```tsx
 * const { data } = useGameProgressByAges([1]);
 * ```
 */
export function useGameProgressByAges(
  ageIds: number[],
  options?: {
    enabled?: boolean;
    refetchInterval?: number;
  }
) {
  return useGameProgress({ ageIds }, options);
}

