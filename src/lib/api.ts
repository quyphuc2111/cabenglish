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

    // TEMPORARILY DISABLED: Refresh token logic
    // if (response.status === 401 && session?.user?.authCookie) {
    //   try {
    //     const tokenResponse = await refreshAccessToken(session.user.authCookie);
    //     headers = {
    //       ...headers,
    //       Authorization: `Bearer ${tokenResponse.accessToken}`
    //     };

    //     const retryConfig: AxiosRequestConfig = {
    //       ...axiosConfig,
    //       headers
    //     };
    //     response = await axios(retryConfig);
    //   } catch (refreshError) {
    //     console.error("Token refresh failed:", refreshError);
    //     console.warn("Refresh token temporarily disabled");
    //   }
    // }

    if (response.status >= 400) {
      // Nếu là lỗi authentication, return null thay vì throw
      if (response.status === 401) {
        console.warn("Authentication required for:", endpoint);
        return null;
      }

      // ✅ Return full error response để caller có thể xử lý
      // Đảm bảo có statusCode, message, errors
      console.warn(`API returned error status ${response.status} for ${endpoint}:`, response.data);
      return {
        success: false,
        statusCode: response.status,
        message: response.data?.message || `Request failed with status ${response.status}`,
        errors: response.data?.errors || [],
        data: response.data?.data || null
      };
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Nếu là lỗi authentication, return null
      if (error.response?.status === 401) {
        console.warn("Authentication error for:", endpoint);
        return null;
      }

      // ✅ Return structured error response thay vì throw
      console.error("Axios error for:", endpoint, error.response?.data);
      return {
        success: false,
        statusCode: error.response?.status || 500,
        message: error.response?.data?.message || error.message || "API Error",
        errors: error.response?.data?.errors || [],
        data: null
      };
    }

    // Kiểm tra nếu là lỗi authentication trong message
    if (
      error instanceof Error &&
      error.message.includes("Chưa được xác thực")
    ) {
      console.warn("Authentication error detected:", error.message);
      return null;
    }

    // ✅ Return structured error response thay vì throw
    console.error("Unexpected error for:", endpoint, error);
    return {
      success: false,
      statusCode: 500,
      message: error instanceof Error ? error.message : "Unknown error",
      errors: [],
      data: null
    };
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
