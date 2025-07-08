import { useQuery } from "@tanstack/react-query";
import { fetchUserByEmail, UserResponse } from "./userApi";

interface UseGetUserByEmailParams {
  email: string;
  accessToken: string;
}

export const useGetUserByEmail = ({
  email,
  accessToken
}: UseGetUserByEmailParams) => {
  return useQuery<UserResponse | null>({
    queryKey: ["user-by-email", email],
    queryFn: async () => {
      if (!email) return null;
      return await fetchUserByEmail(email, accessToken);
    },
    enabled: !!email && !!accessToken
  });
};
