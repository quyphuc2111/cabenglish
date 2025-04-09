import axios from "axios";
import { getSession } from "next-auth/react";
import { getServerSession } from "next-auth";
import https from "https";
import { authOptions } from "@/lib/auth";
import { AxiosRequestConfig } from "axios";
import { refreshAccessToken } from "@/hooks/client/userApi";

interface ServerFetchOptions extends Omit<AxiosRequestConfig, "url"> {
  headers?: Record<string, string>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// export async function apiRequest(endpoint: string, options: any = {}) {
//   const session = await getSession();

//   const config = {
//     headers: {
//       "Content-Type": "application/json",
//       "Accept": "application/json",
//       ...(session?.accessToken && { Authorization: `Bearer ${session.accessToken}` }),
//       ...options.headers,
//     },
//     withCredentials: true,
//     httpsAgent: new https.Agent({
//       rejectUnauthorized: false
//     }),
//     ...options,
//   };

//   const response = await axios({
//     url: `${API_URL}${endpoint}`,
//     ...config,
//   });

//   return response.data;
// }

export async function clientFetch(endpoint: string, options: any = {}) {
  const session = await getSession();

  const config = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(session?.accessToken && {
        Authorization: `Bearer ${session.accessToken}`
      }),
      ...options.headers
    },
    withCredentials: true,
    ...options
  };

  const response = await axios({
    url: `${API_URL}${endpoint}`,
    ...config
  });

  return response.data;
}

export async function serverFetch(
  endpoint: string,
  options: ServerFetchOptions = {}
) {
  const session = await getServerSession(authOptions);

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

    if (endpoint === "/api/Progress/initialize") {
      console.log("Initialize progress response", response.data);
    }
    if (response.status === 401 && session?.user?.authCookie) {
      try {
        const tokenResponse = await refreshAccessToken(session.user.authCookie);
        headers = {
          ...headers,
          Authorization: `Bearer ${tokenResponse.accessToken}`
        };
        const retryConfig: AxiosRequestConfig = {
          ...axiosConfig,
          headers
        };
        response = await axios(retryConfig);
        console.log("token refresh status", response.status);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        throw refreshError;
      }
    }

    if (response.status >= 400) {
      throw new Error(
        response.data?.message ||
          JSON.stringify(response.data) ||
          `Request failed with status ${response.status}`
      );
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.response?.data ||
        error.message ||
        "Unknown API error";

      throw new Error(`API Error: ${errorMessage}`);
    }
    throw new Error(
      `Unexpected error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
