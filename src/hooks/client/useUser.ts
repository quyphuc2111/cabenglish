import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import { updateUserInfo } from "@/actions/userAction";
import { useBroadcastSync } from "@/hooks/useBroadcastSync";

interface UserInfoParams {
  userId: string;
  userInfo: {
    email: string;
    language: string;
    theme: string;
    mode: string;
    is_firstlogin: boolean;
  };
}

import type { userResponse } from "@/actions/userAction";

export const useUpdateUserInfo = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const { broadcastUpdate } = useBroadcastSync();

  return useMutation<userResponse, Error, UserInfoParams>({
    mutationFn: async (data: UserInfoParams) => {
      if (!session) {
        throw new Error("Không tìm thấy session");
      }

      return await updateUserInfo({
        userId: session.user.userId ?? "",
        userInfo: data.userInfo
      });
    },
    // ✅ Thêm optimistic update để UI phản hồi ngay lập tức
    onMutate: async (variables) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["userInfo", variables.userId] });

      // Snapshot the previous value
      const previousUserInfo = queryClient.getQueryData(["userInfo", variables.userId]);

      // Optimistically update to the new value
      queryClient.setQueryData(["userInfo", variables.userId], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          ...variables.userInfo
        };
      });

      // Return a context object with the snapshotted value
      return { previousUserInfo };
    },
    onSuccess: (data, variables) => {
      // ✅ Force invalidate để đảm bảo data fresh từ server
      queryClient.invalidateQueries({
        queryKey: ["userInfo", variables.userId],
        exact: true
      });

      // ✅ Refetch ngay lập tức để đảm bảo sync
      queryClient.refetchQueries({
        queryKey: ["userInfo", variables.userId],
        exact: true
      });

      broadcastUpdate(variables.userId);
    },
    // ✅ Rollback optimistic update nếu có lỗi
    onError: (err, variables, context) => {
      if (context?.previousUserInfo) {
        queryClient.setQueryData(["userInfo", variables.userId], context.previousUserInfo);
      }
    }
  });
};
