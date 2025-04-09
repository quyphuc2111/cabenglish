import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export interface UserCreateRequest {
  user_id: string;
  email: string;
  language: string;
  theme: string;
  mode: string;
}

export interface UserResponse {
  user_id: string;
  email: string;
  language: string;
  theme: string;
  mode: string;
  is_firstlogin: boolean;
}

interface CreateUserParams {
  accessToken: string;
  userCreateRequest: UserCreateRequest;
}

export const useCreateUser = () => {
  return useMutation<UserResponse, any, CreateUserParams>({
    mutationFn: async ({ accessToken, userCreateRequest }) => {
      const response = await axios.post<UserResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/Users`,
        userCreateRequest,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json"
          }
        }
      );
      return response.data;
    }
  });
};
