import { useMutation, useQuery, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllGames,
  createGame,
  updateGame,
  deleteGame,
  deleteGames,
  reorderGames
} from "@/app/api/actions/game";
import { GameFormData, ReorderGameItem } from "@/types/admin-game";
import { GameService } from "@/services/game.service";
import { GamesQueryParams } from "@/types/game";
import {
  toggleLikeGame,
  updatePlayTime,
  markGameAsPlayed
} from "@/lib/game-api";

interface UseGamesParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  topicIds?: number[];
  ageIds?: number[];
  difficultyLevel?: "easy" | "medium" | "hard";
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Hook for admin panel - uses API with IDs
export function useGetGames(params: UseGamesParams = {}) {
  return useQuery({
    queryKey: ["games", params],
    queryFn: () => getAllGames(params),
  });
}

// Hook for infinite scroll - uses API with IDs
export function useGetGamesInfinite(
  params: Omit<UseGamesParams, 'page'> = {}
) {
  const { pageSize = 12, ...restParams } = params;

  return useInfiniteQuery({
    queryKey: ["games-infinite", restParams],
    queryFn: ({ pageParam = 1 }) => 
      getAllGames({ 
        ...restParams, 
        page: pageParam,
        pageSize 
      }),
    getNextPageParam: (lastPage) => {
      // Return next page number if there are more pages
      if (lastPage.hasNextPage) {
        return lastPage.currentPage + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

// Hook for game list page - uses GameService with topic names
export function useGetGamesFromService(params: GamesQueryParams = {}) {
  return useQuery({
    queryKey: ["games-service", params],
    queryFn: () => GameService.getGames(params),
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}

export function useCreateGame() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: GameFormData) => {
      console.log("🎯 Mutation received data:", data);
      return createGame(data);
    },
    onSuccess: () => {
      console.log("✅ Create game success - invalidating queries");
      queryClient.invalidateQueries({
        queryKey: ["games"],
        exact: false,
        refetchType: "all"
      });
    },
    onError: (error) => {
      console.error("❌ Create game failed:", error);
    }
  });
}

export function useUpdateGame() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ gameId, data }: { gameId: number; data: Partial<GameFormData> }) => 
      updateGame(gameId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["games"],
        exact: false,
        refetchType: "all"
      });
    },
  });
}

export function useDeleteGame() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (gameId: number) => deleteGame(gameId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["games"],
        exact: false,
        refetchType: "all"
      });
    },
  });
}

export function useDeleteGames() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (gameIds: number[]) => deleteGames(gameIds),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["games"],
        exact: false,
        refetchType: "all"
      });
    },
  });
}

export function useReorderGames() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (items: ReorderGameItem[]) => reorderGames(items),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["games"],
        exact: false,
        refetchType: "all"
      });
    },
  });
}

// ============ Client-side Game Interaction Hooks ============

/**
 * Hook to toggle like/unlike a game
 * Invalidates game queries after successful mutation
 *
 * @example
 * ```tsx
 * const { mutate: toggleLike, isPending } = useToggleLikeGame();
 *
 * const handleLike = (gameId: number) => {
 *   toggleLike(gameId, {
 *     onSuccess: (data) => {
 *       console.log('Like toggled:', data.data.is_liked);
 *     }
 *   });
 * };
 * ```
 */
export function useToggleLikeGame() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (gameId: number) => toggleLikeGame(gameId),
    onSuccess: () => {
      // Invalidate all game-related queries to refetch updated data
      queryClient.invalidateQueries({
        queryKey: ["games"],
        exact: false,
        refetchType: "all"
      });
      queryClient.invalidateQueries({
        queryKey: ["games-infinite"],
        exact: false,
        refetchType: "all"
      });
      queryClient.invalidateQueries({
        queryKey: ["games-service"],
        exact: false,
        refetchType: "all"
      });
    },
    onError: (error) => {
      console.error("❌ Toggle like failed:", error);
    }
  });
}

/**
 * Hook to update play time for a game
 * Invalidates game progress queries after successful mutation
 *
 * @example
 * ```tsx
 * const { mutate: updateTime } = useUpdatePlayTime();
 *
 * const handlePlayTimeUpdate = (gameId: number, seconds: number) => {
 *   updateTime({ gameId, playTimeSeconds: seconds });
 * };
 * ```
 */
export function useUpdatePlayTime() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ gameId, playTimeSeconds }: { gameId: number; playTimeSeconds: number }) =>
      updatePlayTime(gameId, playTimeSeconds),
    onSuccess: () => {
      // Invalidate game progress queries
      queryClient.invalidateQueries({
        queryKey: ["game-progress"],
        exact: false,
        refetchType: "all"
      });
      // Also invalidate game lists in case they show play time
      queryClient.invalidateQueries({
        queryKey: ["games"],
        exact: false,
        refetchType: "all"
      });
      queryClient.invalidateQueries({
        queryKey: ["games-infinite"],
        exact: false,
        refetchType: "all"
      });
    },
    onError: (error) => {
      console.error("❌ Update play time failed:", error);
    }
  });
}

/**
 * Hook to mark a game as played
 * Invalidates game progress and game list queries after successful mutation
 *
 * @example
 * ```tsx
 * const { mutate: markPlayed } = useMarkAsPlayed();
 *
 * const handleGameStart = (gameId: number) => {
 *   markPlayed(gameId);
 * };
 * ```
 */
export function useMarkAsPlayed() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (gameId: number) => markGameAsPlayed(gameId),
    onSuccess: () => {
      // Invalidate game progress queries
      queryClient.invalidateQueries({
        queryKey: ["game-progress"],
        exact: false,
        refetchType: "all"
      });
      // Invalidate game lists to update played status
      queryClient.invalidateQueries({
        queryKey: ["games"],
        exact: false,
        refetchType: "all"
      });
      queryClient.invalidateQueries({
        queryKey: ["games-infinite"],
        exact: false,
        refetchType: "all"
      });
      queryClient.invalidateQueries({
        queryKey: ["games-service"],
        exact: false,
        refetchType: "all"
      });
    },
    onError: (error) => {
      console.error("❌ Mark as played failed:", error);
    }
  });
}

