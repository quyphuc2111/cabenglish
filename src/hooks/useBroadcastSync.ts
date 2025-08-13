import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { PerformanceConfig } from '@/config/performance';

export const useBroadcastSync = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // ❌ DISABLE nếu performance config tắt
    if (!PerformanceConfig.enableBroadcastSync) return;

    // Kiểm tra browser support
    if (typeof window === 'undefined' || !window.BroadcastChannel) {
      return;
    }

    const channel = new BroadcastChannel('user-data-sync');

    // Debounce invalidateQueries để tránh spam
    let invalidateTimeout: NodeJS.Timeout;

    // Lắng nghe messages từ các tab khác
    channel.onmessage = (event) => {
      const { type, userId, timestamp } = event.data;

      if (type === 'USER_DATA_UPDATED' && userId) {
        // Debounce để tránh multiple invalidates
        clearTimeout(invalidateTimeout);
        invalidateTimeout = setTimeout(() => {
          // Chỉ invalidate nếu tab đang active
          if (document.visibilityState === 'visible') {
            queryClient.invalidateQueries({
              queryKey: ['userInfo', userId]
            });
          }
        }, 200); // Debounce 200ms
      }
    };

    return () => {
      clearTimeout(invalidateTimeout);
      channel.close();
    };
  }, [queryClient]);

  // Function để broadcast update đến các tab khác
  const broadcastUpdate = (userId: string) => {
    // ❌ DISABLE nếu performance config tắt
    if (!PerformanceConfig.enableBroadcastSync) return;

    if (typeof window !== 'undefined' && window.BroadcastChannel) {
      // Throttle để tránh spam broadcasts
      const lastBroadcast = (window as any).lastBroadcastTime || 0;
      const now = Date.now();

      if (now - lastBroadcast < 1000) { // Throttle 1 giây
        return;
      }

      (window as any).lastBroadcastTime = now;

      const channel = new BroadcastChannel('user-data-sync');
      channel.postMessage({
        type: 'USER_DATA_UPDATED',
        userId,
        timestamp: now
      });
      channel.close();
    }
  };

  return { broadcastUpdate };
}; 