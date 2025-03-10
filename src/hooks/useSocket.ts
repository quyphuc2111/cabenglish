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

const WS_URL = 'wss://smkapi2025.bkt.net.vn/ws';
const MAX_RETRIES = 5;
const INITIAL_RETRY_DELAY = 3000;

export const useSocket = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [notifications, setNotifications] = useState<NotificationMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const connect = useCallback(() => {
    // Tính toán delay dựa trên số lần retry (exponential backoff)
    const retryDelay = INITIAL_RETRY_DELAY * Math.pow(2, retryCount);

    try {
      const ws = new WebSocket(WS_URL);

      ws.onopen = () => {
        console.log('WebSocket đã kết nối thành công');
        setIsConnected(true);
        setRetryCount(0); // Reset retry count khi kết nối thành công
      };

      ws.onmessage = (event) => {
        try {
          let parsedData;
          
          // Đầu tiên parse message để kiểm tra type
          const initialData = JSON.parse(event.data);
          
          // Nếu là message connected thì return luôn
          if (initialData.type === 'connected') {
            console.log('Connected message:', initialData);
            return;
          }

          // Nếu không phải connected message thì xử lý tiếp
          if (typeof event.data === 'string') {
            const cleanData = event.data.replace(/^"|"$/g, '');
            const decodedString = JSON.parse(`"${cleanData}"`);
            parsedData = JSON.parse(decodedString);
          }

          if (parsedData.type === 'ping' || parsedData.type === 'info') {
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

          if (newNotification.notificationId && newNotification.title) {
            setNotifications(prev => {
              const exists = prev.some(n => n.notificationId === newNotification.notificationId);
              return exists ? prev : [...prev, newNotification];
            });
          }
        } catch (error) {
          console.error('Lỗi khi xử lý tin nhắn:', error);
        }
      };

      ws.onclose = (event) => {
        console.log(`WebSocket đóng với code: ${event.code}`);
        setIsConnected(false);

        // Thử kết nối lại nếu chưa vượt quá số lần retry tối đa
        if (retryCount < MAX_RETRIES) {
          console.log(`Đang thử kết nối lại sau ${retryDelay}ms...`);
          // setTimeout(() => {
          //   setRetryCount(prev => prev + 1);
          //   connect();
          // }, retryDelay);
        } else {
          // toast.error("Không thể kết nối đến máy chủ. Vui lòng thử lại sau.", {
          //   position: "top-right",
          //   autoClose: 5000
          // });
          console.error("Không thể kết nối đến máy chủ. Vui lòng thử lại sau.");
        }
      };

      ws.onerror = (error) => {
        console.error('Lỗi WebSocket:', error);
        // Có thể thêm xử lý lỗi cụ thể ở đây nếu cần
      };

      setSocket(ws);
    } catch (error) {
      console.error('Lỗi khi tạo kết nối WebSocket:', error);
      // toast.error("Không thể kết nối đến máy chủ", {
      //   position: "top-right",
      //   autoClose: 3000
      // });
    }
  }, [retryCount]);

  useEffect(() => {
    connect();

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [connect]);

  // Gửi ping định kỳ để giữ kết nối
  useEffect(() => {
    const pingInterval = setInterval(() => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        try {
          socket.send(JSON.stringify({ type: 'ping' }));
        } catch (error) {
          console.error('Lỗi khi gửi ping:', error);
        }
      }
    }, 30000);

    return () => clearInterval(pingInterval);
  }, [socket]);

  const sendMessage = (message: any) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      try {
        socket.send(JSON.stringify(message));
      } catch (error) {
        console.error('Lỗi khi gửi tin nhắn:', error);
        // toast.error("Không thể gửi tin nhắn", {
        //   position: "top-right",
        //   autoClose: 3000
        // });
      }
    } else {
      // toast.warning("Đang mất kết nối, vui lòng thử lại sau", {
      //   position: "top-right",
      //   autoClose: 3000
      // });
      console.warn("Đang mất kết nối, vui lòng thử lại sau");
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
