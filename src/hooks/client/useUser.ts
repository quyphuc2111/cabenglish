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
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ["userInfo", variables.userId] 
      });
      
      broadcastUpdate(variables.userId);
    }
  });
};
