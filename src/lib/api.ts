import axios from "axios";
import { getServerSession } from "next-auth";
import https from "https";
import { authOptions } from "@/lib/auth";
import { AxiosRequestConfig } from "axios";
import { refreshAccessToken } from "@/hooks/client/userApi";
import apiClient from "@/lib/axios-interceptor";

interface ServerFetchOptions extends Omit<AxiosRequestConfig, "url"> {
  headers?: Record<string, string>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function clientFetch(endpoint: string, options: any = {}) {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options.headers
    },
    ...options
  };

  const response = await apiClient({
    url: endpoint,
    ...config
  });

  return response.data;
}

export async function serverFetch(
  endpoint: string,
  options: ServerFetchOptions = {}
) {
  const session = await getServerSession(authOptions);

  // Nếu không có session, return null thay vì throw error
  if (!session) {
    console.warn("No session found for serverFetch");
    return null;
  }

  let headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(session?.accessToken && {
      Authorization: `Bearer ${session.accessToken}`
    }),
    ...options.headers
  };

  try {
    const axiosConfig: AxiosRequestConfig = {
      url: `${API_URL}${endpoint}`,
      headers,
      timeout: 10000,
      validateStatus: (status) => status < 500,
      withCredentials: true,
      ...options
    };

    let response = await axios(axiosConfig);

    if (response.status === 401 && session?.user?.authCookie) {
      try {
        const tokenResponse = await refreshAccessToken(session.user.authCookie);
        headers = {
          ...headers,
          Authorization: `Bearer ${tokenResponse.accessToken}`
        };

        // TODO: Consider updating session with new token
        // This would require implementing a session update mechanism
        // For now, the JWT callback will handle the refresh on next request

        const retryConfig: AxiosRequestConfig = {
          ...axiosConfig,
          headers
        };
        response = await axios(retryConfig);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);

        // If refresh token is expired (401), don't retry with old token
        if (
          axios.isAxiosError(refreshError) &&
          refreshError.response?.status === 401
        ) {
          console.warn("Refresh token expired, authentication required");
          return null; // Return null thay vì throw error
        }

        // For other refresh errors, continue with original response
        // This allows the request to complete even if refresh fails
        console.warn(
          "Continuing with original response due to refresh failure"
        );
      }
    }

    if (response.status >= 400) {
      // Nếu là lỗi authentication, return null thay vì throw
      if (response.status === 401) {
        console.warn("Authentication required for:", endpoint);
        return null;
      }

      throw new Error(
        response.data?.message ||
          JSON.stringify(response.data) ||
          `Request failed with status ${response.status}`
      );
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Nếu là lỗi authentication, return null
      if (error.response?.status === 401) {
        console.warn("Authentication error for:", endpoint);
        return null;
      }

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.response?.data ||
        error.message ||
        "Unknown API error";

      throw new Error(`API Error: ${errorMessage}`);
    }

    // Kiểm tra nếu là lỗi authentication trong message
    if (
      error instanceof Error &&
      error.message.includes("Chưa được xác thực")
    ) {
      console.warn("Authentication error detected:", error.message);
      return null;
    }

    throw new Error(
      `Unexpected error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

// Helper function để check xem có nên gọi API hay không
export async function safeServerFetch(
  endpoint: string,
  options: ServerFetchOptions = {}
) {
  try {
    const result = await serverFetch(endpoint, options);
    return result;
  } catch (error) {
    console.warn(`Safe server fetch failed for ${endpoint}:`, error);
    return null;
  }
}
