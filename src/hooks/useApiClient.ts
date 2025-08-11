import { useCallback } from 'react';
import apiClient from '@/lib/axios-interceptor';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

interface UseApiClientReturn {
  get: <T = any>(url: string, config?: AxiosRequestConfig) => Promise<T>;
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => Promise<T>;
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => Promise<T>;
  delete: <T = any>(url: string, config?: AxiosRequestConfig) => Promise<T>;
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => Promise<T>;
}

/**
 * Hook to use API client with automatic token refresh
 * This replaces the need to use clientFetch directly
 */
export const useApiClient = (): UseApiClientReturn => {
  const get = useCallback(async <T = any>(
    url: string, 
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const response: AxiosResponse<T> = await apiClient.get(url, config);
    return response.data;
  }, []);

  const post = useCallback(async <T = any>(
    url: string, 
    data?: any, 
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const response: AxiosResponse<T> = await apiClient.post(url, data, config);
    return response.data;
  }, []);

  const put = useCallback(async <T = any>(
    url: string, 
    data?: any, 
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const response: AxiosResponse<T> = await apiClient.put(url, data, config);
    return response.data;
  }, []);

  const deleteMethod = useCallback(async <T = any>(
    url: string, 
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const response: AxiosResponse<T> = await apiClient.delete(url, config);
    return response.data;
  }, []);

  const patch = useCallback(async <T = any>(
    url: string, 
    data?: any, 
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const response: AxiosResponse<T> = await apiClient.patch(url, data, config);
    return response.data;
  }, []);

  return {
    get,
    post,
    put,
    delete: deleteMethod,
    patch
  };
};

export default useApiClient;
