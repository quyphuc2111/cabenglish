/**
 * Custom hook để debug TanStack Query trong components
 */

import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

interface UseQueryDebugOptions {
  /** Tên của component để dễ nhận biết trong log */
  componentName?: string;
  /** Query key cần theo dõi */
  queryKey?: unknown[];
  /** Có log mỗi khi component re-render không */
  logOnRender?: boolean;
  /** Có log query state không */
  logQueryState?: boolean;
}

/**
 * Hook để debug queries và component lifecycle
 */
export function useQueryDebug(options: UseQueryDebugOptions = {}) {
  const {
    componentName = 'Unknown Component',
    queryKey,
    logOnRender = false,
    logQueryState = true,
  } = options;

  const queryClient = useQueryClient();
  const renderCount = useRef(0);
  const mountTime = useRef(Date.now());

  useEffect(() => {
    console.log(`🎬 [${componentName}] Mounted at ${new Date().toLocaleTimeString()}`);

    return () => {
      const lifetime = Date.now() - mountTime.current;
      console.log(`🎬 [${componentName}] Unmounted after ${lifetime}ms (${renderCount.current} renders)`);
    };
  }, [componentName]);

  useEffect(() => {
    renderCount.current += 1;

    if (logOnRender) {
      console.log(`🔄 [${componentName}] Render #${renderCount.current}`);
    }

    if (queryKey && logQueryState) {
      const query = queryClient.getQueryCache().find({ queryKey });
      
      if (query) {
        const { state } = query;
        console.group(`🔍 [${componentName}] Query State - Render #${renderCount.current}`);
        console.log('Query Key:', queryKey);
        console.log('Status:', state.status);
        console.log('Is Fetching:', state.isFetching);
        console.log('Is Stale:', query.isStale());
        console.log('Has Data:', !!state.data);
        console.log('Has Error:', !!state.error);
        if (state.error) {
          console.error('Error:', state.error);
        }
        console.groupEnd();
      } else {
        console.warn(`⚠️ [${componentName}] Query not found:`, queryKey);
      }
    }
  });

  return {
    renderCount: renderCount.current,
    queryClient,
  };
}

/**
 * Hook để log props changes
 */
export function usePropsDebug<T extends Record<string, any>>(
  props: T,
  componentName: string = 'Component'
) {
  const previousProps = useRef<T>(props);

  useEffect(() => {
    const changedProps = Object.keys(props).reduce((acc, key) => {
      if (props[key] !== previousProps.current[key]) {
        return {
          ...acc,
          [key]: {
            from: previousProps.current[key],
            to: props[key],
          },
        };
      }
      return acc;
    }, {});

    if (Object.keys(changedProps).length > 0) {
      console.group(`📊 [${componentName}] Props Changed`);
      console.table(changedProps);
      console.groupEnd();
    }

    previousProps.current = props;
  });
}

/**
 * Hook để track query cache changes
 */
export function useQueryCacheDebug(componentName: string = 'Component') {
  const queryClient = useQueryClient();

  useEffect(() => {
    const queryCache = queryClient.getQueryCache();
    
    const unsubscribe = queryCache.subscribe((event) => {
      if (event) {
        console.log(`🔄 [${componentName}] Query Cache Event:`, {
          type: event.type,
          query: event.query?.queryKey,
        });
      }
    });

    return unsubscribe;
  }, [queryClient, componentName]);
}

/**
 * Hook để measure component render time
 */
export function useRenderTimeDebug(componentName: string = 'Component') {
  const renderStartTime = useRef(Date.now());

  useEffect(() => {
    const renderTime = Date.now() - renderStartTime.current;
    if (renderTime > 16) { // Chỉ log nếu render time > 16ms (1 frame)
      console.warn(`⏱️ [${componentName}] Slow render: ${renderTime}ms`);
    }
  });

  renderStartTime.current = Date.now();
}

