"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect, useState } from "react";
import { enableQueryDebugWindow } from "@/lib/debug-query";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () => {
      const client = new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 phút cache - tăng từ 30s
            refetchOnWindowFocus: false, // ❌ Tắt refetch khi focus - NGUYÊN NHÂN CHÍNH
            refetchOnMount: false, // ❌ Tắt refetch khi mount - giảm CPU
            refetchOnReconnect: true, // Giữ lại để sync khi mất kết nối
            retry: 1, // Giảm retry từ 2 → 1
            gcTime: 10 * 60 * 1000, // 10 phút garbage collection
          },
          mutations: {
            onError: (error, variables, context) => {
              console.error('[Mutation Error]', { error, variables, context });
            },
            onSuccess: (data, variables, context) => {
              console.log('[Mutation Success]', { data, variables, context });
            },
          }
        },
      });

      // Subscribe để log query events trong development
      if (process.env.NODE_ENV === 'development') {
        client.getQueryCache().subscribe((event) => {
          if (event?.type === 'updated' && event.action.type === 'error') {
            console.error('[TanStack Query Error]', {
              queryKey: event.query.queryKey,
              error: event.action.error,
            });
          }
          if (event?.type === 'updated' && event.action.type === 'success') {
            console.log('[TanStack Query Success]', {
              queryKey: event.query.queryKey,
            });
          }
        });

        client.getMutationCache().subscribe((event) => {
          if (event?.type === 'updated') {
            console.log('[TanStack Mutation Event]', {
              mutationId: event.mutation.mutationId,
              status: event.mutation.state.status,
            });
          }
        });
      }

      return client;
    }
  );

  // Enable debug tools trong development mode
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      enableQueryDebugWindow(queryClient);
    }
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* TanStack Query Devtools - Bật để debug */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools 
          initialIsOpen={false}
          position="bottom"
        />
      )}
    </QueryClientProvider>
  );
}
