"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 phút cache - tăng từ 30s
            refetchOnWindowFocus: false, // ❌ Tắt refetch khi focus - NGUYÊN NHÂN CHÍNH
            refetchOnMount: false, // ❌ Tắt refetch khi mount - giảm CPU
            refetchOnReconnect: true, // Giữ lại để sync khi mất kết nối
            retry: 1, // Giảm retry từ 2 → 1
            gcTime: 10 * 60 * 1000 // 10 phút garbage collection
          }
        }
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
}
