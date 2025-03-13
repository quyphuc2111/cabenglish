import axios from "axios";
import { getSession } from "next-auth/react";
import { getServerSession } from "next-auth";
import https from "https";
import { authOptions } from "@/lib/auth";
import { AxiosRequestConfig } from 'axios';


interface ServerFetchOptions extends Omit<AxiosRequestConfig, 'url'> {
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
      "Accept": "application/json",
      ...(session?.accessToken && { Authorization: `Bearer ${session.accessToken}` }),
      ...options.headers,
    },
    withCredentials: true,
    ...options,
  };

  const response = await axios({
    url: `${API_URL}${endpoint}`,
    ...config,
  });

  return response.data;
}

export async function serverFetch(
  endpoint: string, 
  options: ServerFetchOptions = {}
) {
  const session = await getServerSession(authOptions);
  
  // Tách headers riêng để tránh conflict
  const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    ...(session?.accessToken && { Authorization: `Bearer ${session.accessToken}` }),
    ...options.headers,
  };

  try {
    const response = await axios({
      url: `${API_URL}${endpoint}`,
      // httpsAgent: new https.Agent({
      //   rejectUnauthorized: false
      // }),
      ...options,
      headers, // ghi đè headers sau cùng
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Xử lý lỗi cụ thể từ Axios
      throw new Error(
        `API Error: ${error.response?.status} - ${error.response?.data?.message || error.message}`
      );
    }
    // Xử lý các lỗi khác
    throw error;
  }
} 


