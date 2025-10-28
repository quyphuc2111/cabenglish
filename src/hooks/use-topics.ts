import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  getAllTopics, 
  createTopic, 
  updateTopic, 
  deleteTopic,
  deleteTopics,
  reorderTopics
} from "@/app/api/actions/topics";
import { GameTopicFormData, ReorderItem, GameTopic } from "@/types/admin-game";

interface UseTopicsParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
}

export function useGetTopics(params: UseTopicsParams = {}) {
  return useQuery({
    queryKey: ["topics", params],
    queryFn: () => getAllTopics(params),
  });
}

export function useCreateTopic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: GameTopicFormData) => createTopic(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["topics"],
        exact: false,
        refetchType: "all"
      });
    }
  });
}

export function useUpdateTopic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ topicId, data }: { topicId: number; data: Partial<GameTopicFormData> }) => 
      updateTopic(topicId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["topics"],
        exact: false,
        refetchType: "all"
      });
    },
  });
}

export function useDeleteTopic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (topicId: number) => deleteTopic(topicId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["topics"],
        exact: false,
        refetchType: "all"
      });
    },
  });
}

export function useDeleteTopics() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (topicIds: number[]) => deleteTopics(topicIds),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["topics"],
        exact: false,
        refetchType: "all"
      });
    },
  });
}

export function useReorderTopics() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (items: ReorderItem[]) => reorderTopics(items),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["topics"],
        exact: false,
        refetchType: "all"
      });
    },
  });
}

