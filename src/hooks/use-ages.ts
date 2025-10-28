import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  getAllAges, 
  createAge, 
  updateAge, 
  deleteAge,
  deleteAges,
  reorderAges
} from "@/app/api/actions/age";
import { GameAgeFormData, ReorderAgeItem, GameAge } from "@/types/admin-game";

interface UseAgesParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
}

export function useGetAges(params: UseAgesParams = {}) {
  return useQuery({
    queryKey: ["ages", params],
    queryFn: () => getAllAges(params),
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

