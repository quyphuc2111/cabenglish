// hooks/useUpdateSession.ts
import { useSession } from "next-auth/react";
import axios from "axios";

export const useUpdateSession = () => {
  const { data: session, update } = useSession();

  const updateUserSession = async () => {
    if (!session?.user.userId || !session?.accessToken) return;

    try {
      const userResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/Users/${session.user.userId}`,
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`
          }
        }
      );

      // Cập nhật session với dữ liệu mới
      await update({
        ...session,
        user: {
          ...session.user,
          mode: userResponse.data.mode,
          theme: userResponse.data.theme,
          isFirstLogin: userResponse.data.is_firstlogin
        }
      });
    } catch (error) {
      console.error("Failed to update session:", error);
    }
  };

  return { updateUserSession };
};