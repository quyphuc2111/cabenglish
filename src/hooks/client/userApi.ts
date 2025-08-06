import axios from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export interface TokenResponseDto {
  accessToken: string;
  expiresIn: number;
  tokenType: string;
}

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

export async function refreshAccessToken(
  authCookie: string
): Promise<TokenResponseDto> {
  // Extract bkt_account cookie value if it's in the full cookie string
  let bktAccountCookie = authCookie;
  if (authCookie.includes("bkt_account=")) {
    // If it's a full cookie string, extract just the bkt_account part
    const match = authCookie.match(/bkt_account=([^;]+)/);
    if (match) {
      bktAccountCookie = `bkt_account=${match[1]}`;
    }
  } else if (!authCookie.startsWith("bkt_account=")) {
    // If it's just the value, add the name
    bktAccountCookie = `bkt_account=${authCookie}`;
  }

  const response = await axios.post<TokenResponseDto>(
    `${process.env.BKT_ACCOUNT_API_URL}/api/Auth/refresh-token`,
    {},
    {
      headers: {
        Cookie: bktAccountCookie
      },
      withCredentials: true
    }
  );
  return response.data;
}

export async function logout(): Promise<{ message: string }> {
  const session = await getServerSession(authOptions);
  const response = await axios.post<{ message: string }>(
    `${process.env.BKT_ACCOUNT_API_URL}/api/Auth/logout`,
    {},
    {
      headers: {
        Cookie: session?.user.authCookie || ""
      },
      withCredentials: true
    }
  );
  return response.data;
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
