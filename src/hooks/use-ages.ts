import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllAges,
  createAge,
  updateAge,
  deleteAge,
  deleteAges,
  reorderAges
} from "@/app/api/actions/age";
import { getAges } from "@/lib/game-api";
import { GameAgeFormData, ReorderAgeItem, GameAge } from "@/types/admin-game";

interface UseAgesParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
}

// ============ Server-side hooks (for admin panel) ============

export function useGetAges(params: UseAgesParams = {}) {
  return useQuery({
    queryKey: ["ages", params],
    queryFn: () => getAllAges(params),
  });
}

// ============ Client-side hooks (for game list page) ============

/**
 * Hook to fetch all ages from client-side
 * Uses clientFetch instead of serverFetch
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useGetAgesClient({ pageSize: 100 });
 * const ages = data?.data || [];
 * ```
 */
export function useGetAgesClient(params: UseAgesParams = {}) {
  const { pageSize = 100, ...restParams } = params;

  return useQuery({
    queryKey: ["ages-client", { pageSize, ...restParams }],
    queryFn: () => getAges({ pageSize, ...restParams }),
    staleTime: 5 * 60 * 1000, // 5 minutes - ages don't change often
    refetchOnWindowFocus: false,
  });
}

export function useCreateAge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: GameAgeFormData) => createAge(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["ages"],
        exact: false,
        refetchType: "all"
      });
    }
  });
}

export function useUpdateAge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ageId, data }: { ageId: number; data: Partial<GameAgeFormData> }) => 
      updateAge(ageId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["ages"],
        exact: false,
        refetchType: "all"
      });
    },
  });
}

export function useDeleteAge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ageId: number) => deleteAge(ageId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["ages"],
        exact: false,
        refetchType: "all"
      });
    },
  });
}

export function useDeleteAges() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ageIds: number[]) => deleteAges(ageIds),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["ages"],
        exact: false,
        refetchType: "all"
      });
    },
  });
}

export function useReorderAges() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (items: ReorderAgeItem[]) => reorderAges(items),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["ages"],
        exact: false,
        refetchType: "all"
      });
    },
  });
}

