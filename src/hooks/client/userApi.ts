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
    const match = authCookie.match(/bkt_account=([^;,]+)/);
    if (match) {
      // Don't decode here as the backend expects it encoded
      bktAccountCookie = `bkt_account=${match[1]}`;
    }
  } else if (!authCookie.startsWith("bkt_account=")) {
    // If it's just the value, add the name
    bktAccountCookie = `bkt_account=${authCookie}`;
  }

  try {
    const response = await axios.post<TokenResponseDto>(
      `${process.env.BKT_ACCOUNT_API_URL}/api/Auth/refresh-token`,
      {},
      {
        headers: {
          Cookie: bktAccountCookie
        },
        withCredentials: true,
        timeout: 10000 // 10 second timeout
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Log more detailed error info for debugging
      console.error("Refresh token error details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        cookieLength: bktAccountCookie.length,
        hasBktAccount: bktAccountCookie.includes("bkt_account=")
      });

      // If it's a 401, the refresh token is expired
      if (error.response?.status === 401) {
        throw new Error("Refresh token expired");
      }
    }
    throw error;
  }
}

// Helper function to validate if refresh token is likely valid
export function isRefreshTokenValid(authCookie?: string): boolean {
  if (!authCookie) return false;

  // Check if cookie has the expected format
  const hasValidFormat = authCookie.includes("bkt_account=") && authCookie.length > 20;

  // Additional validation: check if it's not obviously expired or malformed
  try {
    // Extract the cookie value
    const match = authCookie.match(/bkt_account=([^;,]+)/);
    if (!match) return false;

    const cookieValue = match[1];

    // Basic checks for cookie value format
    if (cookieValue.length < 10) return false; // Too short
    if (!/^[A-Za-z0-9+/=%-]+$/.test(cookieValue)) return false; // Invalid characters

    return hasValidFormat;
  } catch (error) {
    console.error("Error validating refresh token:", error);
    return false;
  }
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
