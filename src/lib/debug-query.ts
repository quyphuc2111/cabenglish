/**
 * Utility để debug TanStack Query trong SSR
 */

import { QueryClient } from '@tanstack/react-query';

/**
 * Log tất cả queries đang active trong QueryClient
 */
export function logAllQueries(queryClient: QueryClient) {
  const queryCache = queryClient.getQueryCache();
  const queries = queryCache.getAll();

  console.group('🔍 [Query Debug] Active Queries');
  console.log('Total queries:', queries.length);
  
  queries.forEach((query) => {
    const { queryKey, state } = query;
    console.group(`Query: ${JSON.stringify(queryKey)}`);
    console.log('Status:', state.status);
    console.log('Data:', state.data);
    console.log('Error:', state.error);
    console.log('Is Stale:', query.isStale());
    console.log('Fetch Status:', state.fetchStatus);
    console.log('Data Updated At:', new Date(state.dataUpdatedAt).toLocaleString());
    console.log('Error Updated At:', new Date(state.errorUpdatedAt).toLocaleString());
    console.groupEnd();
  });
  
  console.groupEnd();
}

/**
 * Log một query cụ thể theo queryKey
 */
export function logQuery(queryClient: QueryClient, queryKey: unknown[]) {
  const query = queryClient.getQueryCache().find({ queryKey });
  
  if (!query) {
    console.warn('🔍 [Query Debug] Query not found:', queryKey);
    return;
  }

  const { state } = query;
  console.group(`🔍 [Query Debug] ${JSON.stringify(queryKey)}`);
  console.log('Status:', state.status);
  console.log('Data:', state.data);
  console.log('Error:', state.error);
  console.log('Is Stale:', query.isStale());
  console.log('Fetch Status:', state.fetchStatus);
  console.log('Data Updated At:', new Date(state.dataUpdatedAt).toLocaleString());
  console.log('Error Updated At:', new Date(state.errorUpdatedAt).toLocaleString());
  console.log('Fetch Failures Count:', state.fetchFailureCount);
  console.groupEnd();
}

/**
 * Hook để debug query trong component
 */
export function debugQuery(queryKey: unknown[], label?: string) {
  if (typeof window === 'undefined') {
    console.log(`🔍 [SSR Debug] ${label || 'Query'}:`, queryKey);
  } else {
    console.log(`🔍 [Client Debug] ${label || 'Query'}:`, queryKey);
  }
}

/**
 * Log tất cả mutations đang pending
 */
export function logPendingMutations(queryClient: QueryClient) {
  const mutationCache = queryClient.getMutationCache();
  const mutations = mutationCache.getAll();
  const pending = mutations.filter(m => m.state.status === 'pending');

  console.group('🔍 [Mutation Debug] Pending Mutations');
  console.log('Total mutations:', mutations.length);
  console.log('Pending mutations:', pending.length);
  
  pending.forEach((mutation) => {
    console.group(`Mutation ID: ${mutation.mutationId}`);
    console.log('Variables:', mutation.state.variables);
    console.log('Status:', mutation.state.status);
    console.groupEnd();
  });
  
  console.groupEnd();
}

/**
 * Monitor query performance
 */
export function monitorQueryPerformance(queryClient: QueryClient) {
  const queryCache = queryClient.getQueryCache();
  
  const unsubscribe = queryCache.subscribe((event) => {
    if (event?.type === 'updated') {
      const query = event.query;
      const duration = query.state.dataUpdatedAt - (query.state as any).fetchMeta?.startedAt;
      
      if (duration) {
        console.log(`⏱️ [Query Performance] ${JSON.stringify(query.queryKey)}: ${duration}ms`);
      }
    }
  });

  return unsubscribe;
}

/**
 * Export để sử dụng trong window (browser console)
 */
export function enableQueryDebugWindow(queryClient: QueryClient) {
  if (typeof window !== 'undefined') {
    (window as any).__DEBUG_QUERY__ = {
      logAllQueries: () => logAllQueries(queryClient),
      logQuery: (queryKey: unknown[]) => logQuery(queryClient, queryKey),
      logPendingMutations: () => logPendingMutations(queryClient),
      queryClient,
      getQueryData: (queryKey: unknown[]) => queryClient.getQueryData(queryKey),
      invalidateQueries: (queryKey: unknown[]) => queryClient.invalidateQueries({ queryKey }),
    };
    
    console.log('🎉 Query debug tools enabled! Use __DEBUG_QUERY__ in console');
    console.log('Available methods:');
    console.log('- __DEBUG_QUERY__.logAllQueries()');
    console.log('- __DEBUG_QUERY__.logQuery(queryKey)');
    console.log('- __DEBUG_QUERY__.logPendingMutations()');
    console.log('- __DEBUG_QUERY__.getQueryData(queryKey)');
    console.log('- __DEBUG_QUERY__.invalidateQueries(queryKey)');
    console.log('- __DEBUG_QUERY__.queryClient');
  }
}

