import { useSession } from 'next-auth/react';
import { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';

interface NotificationMessage {
  notificationId: number;
  type: string;
  title: string;
  description: string;
  contentHtml: string;
  lastSentTime: string;
}

// const WS_URL = 'wss://smkapi2025.bkt.net.vn/ws';
const MAX_RETRIES = 5;
const INITIAL_RETRY_DELAY = 3000;

export const useSocket = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [notifications, setNotifications] = useState<NotificationMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [retryTimeoutId, setRetryTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const session = useSession();
  const token = session?.data?.accessToken;

  const connect = useCallback(() => {
    if (retryTimeoutId) {
      clearTimeout(retryTimeoutId);
      setRetryTimeoutId(null);
    }

    try {
      if (socket) {
        socket.close();
        setSocket(null);
      }

      const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}?token=${token}`);

      ws.onopen = () => {
        console.log('=== WebSocket Event: onopen ===');
        console.log('WebSocket đã kết nối thành công');
        console.log('URL:', process.env.NEXT_PUBLIC_WS_URL);
        console.log('Trạng thái:', ws.readyState);
        setIsConnected(true);
        setRetryCount(0);
      };

      ws.onmessage = (event) => {
        try {
          console.log('=== WebSocket Event: onmessage ===');
          console.log('Raw event:', event);
          
          let parsedData;
          const rawData = event.data.trim();
          
          try {
            console.log('Raw data type:', typeof rawData);
            console.log('Raw data value:', rawData);

            if (typeof rawData === 'object') {
              parsedData = rawData;
            } else {
              let firstParse = JSON.parse(rawData);
              
              if (typeof firstParse === 'string') {
                parsedData = JSON.parse(firstParse);
              } else {
                parsedData = firstParse;
              }
            }
            
            console.log('Final parsed data:', parsedData);
            console.log('Final parsed data type:', typeof parsedData);
            
          } catch (parseError) {
            console.error('Parse error:', parseError);
            const cleanData = rawData
              .replace(/^"|"$/g, '')
              .replace(/\\"/g, '"')
              .replace(/\\/g, '');
            parsedData = JSON.parse(cleanData);
            console.log('Parsed data after cleanup:', parsedData);
          }

          if (parsedData.type === 'connected') {
            console.log('Connected message received:', parsedData);
            return;
          }

          if (parsedData.type === 'ping' || parsedData.type === 'info') {
            console.log('Ping/Info message received:', parsedData);
            return;
          }
          
          const newNotification: NotificationMessage = {
            notificationId: parsedData.NotificationId,
            type: parsedData.NotificationType?.toLowerCase() || 'info',
            title: parsedData.Title,
            description: parsedData.Description,
            contentHtml: parsedData.ContentHtml,
            lastSentTime: parsedData.LastSentTime
          };
          console.log('New notification created:', newNotification);

          if (newNotification.notificationId && newNotification.title) {
            setNotifications(prev => {
              const exists = prev.some(n => n.notificationId === newNotification.notificationId);
              console.log('Notification exists:', exists);
              return exists ? prev : [...prev, newNotification];
            });
          }
        } catch (error) {
          console.error('=== WebSocket Error in onmessage ===');
          console.error('Error details:', error);
          console.error('Raw event data:', event.data);
        }
      };

      ws.onclose = (event) => {
        console.log('=== WebSocket Event: onclose ===');
        console.log('Close event:', {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean
        });
        setIsConnected(false);

        if (retryCount < MAX_RETRIES) {
          const retryDelay = INITIAL_RETRY_DELAY * Math.pow(2, retryCount);
          console.log(`Retry attempt ${retryCount + 1}/${MAX_RETRIES} in ${retryDelay}ms`);
          const timeoutId = setTimeout(() => {
            setRetryCount(prev => prev + 1);
            // connect();
          }, retryDelay);
          setRetryTimeoutId(timeoutId);
        } else {
          console.error('=== WebSocket: Max retries reached ===');
          toast.error("Không thể kết nối đến máy chủ. Vui lòng thử lại sau.", {
            position: "top-right",
            autoClose: 5000
          });
        }
      };

      ws.onerror = (error) => {
        console.error('=== WebSocket Event: onerror ===');
        console.error('Error details:', error);
      };

      setSocket(ws);
    } catch (error) {
      console.error('Lỗi khi tạo kết nối WebSocket:', error);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      connect();
    }

    return () => {
      if (retryTimeoutId) {
        clearTimeout(retryTimeoutId);
      }
      if (socket) {
        socket.close();
      }
    };
  }, [token]);

  useEffect(() => {
    const pingInterval = setInterval(() => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        try {
          socket.send(JSON.stringify({ type: 'ping' }));
        } catch (error) {
          console.error('Lỗi khi gửi ping:', error);
        }
      }
    }, 14400000);

    return () => clearInterval(pingInterval);
  }, [socket]);

  const sendMessage = (message: any) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      try {
        console.log('=== Sending WebSocket Message ===');
        console.log('Message:', message);
        socket.send(JSON.stringify(message));
      } catch (error) {
        console.error('=== Error Sending Message ===');
        console.error('Message:', message);
        console.error('Error:', error);
      }
    } else {
      console.warn('=== WebSocket Not Connected ===');
      console.warn('Current socket state:', socket?.readyState);
      console.warn('Message not sent:', message);
    }
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return {
    socket,
    isConnected,
    notifications,
    sendMessage,
    clearNotifications
  };
};
