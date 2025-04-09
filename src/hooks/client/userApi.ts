import axios from "axios";

export interface UserResponse {
  user_id: string;
  email: string;
  language: string;
  theme: string;
  mode: string;
  is_firstlogin: boolean;
}

export interface UserCreateRequest {
  user_id?: string;
  email: string;
  language?: string;
  theme?: string;
  mode?: string;
}

export async function fetchUserByEmail(
  email: string,
  accessToken: string
): Promise<UserResponse> {
  console.log("Fetching user by email:", email);
  const response = await axios.get<UserResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/api/Users/by-email`,
    {
      params: { email },
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  );
  return response.data;
}

export async function createUser(
  userData: UserCreateRequest,
  accessToken: string
): Promise<UserResponse> {
  console.log("Creating user:", userData);
  const response = await axios.post<UserResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/api/Users`,
    userData,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      }
    }
  );
  return response.data;
}
