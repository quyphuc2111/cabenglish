import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export const useBroadcastSync = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Kiểm tra browser support
    if (typeof window === 'undefined' || !window.BroadcastChannel) {
      return;
    }

    const channel = new BroadcastChannel('user-data-sync');

    // Lắng nghe messages từ các tab khác
    channel.onmessage = (event) => {
      const { type, userId } = event.data;
      
      if (type === 'USER_DATA_UPDATED' && userId) {
        // Invalidate cache khi có update từ tab khác
        queryClient.invalidateQueries({
          queryKey: ['userInfo', userId]
        });
      }
    };

    return () => {
      channel.close();
    };
  }, [queryClient]);

  // Function để broadcast update đến các tab khác
  const broadcastUpdate = (userId: string) => {
    if (typeof window !== 'undefined' && window.BroadcastChannel) {
      const channel = new BroadcastChannel('user-data-sync');
      channel.postMessage({
        type: 'USER_DATA_UPDATED',
        userId,
        timestamp: Date.now()
      });
      channel.close();
    }
  };

  return { broadcastUpdate };
}; 