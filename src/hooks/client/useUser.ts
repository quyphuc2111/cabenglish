import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import { updateUserInfo } from "@/actions/userAction";

interface UserInfoParams {
  userId: string;
  userInfo: {
    email: string;
    language: string;
    theme: string;
    mode: string;
    isFirstLogin: boolean;
  };
}

import type { userResponse } from "@/actions/userAction";

export const useUpdateUserInfo = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

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
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: ["lesson", lessonId, classId, unitId] });
      // queryClient.invalidateQueries({ queryKey: ["lessons-by-class-id-unit-id", classId, unitId] });
    }
  });
};
