'use client';  

import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';

interface NotificationMessage {
  title: string;
  message: string;
}

interface SocketContextType {
  socket: WebSocket | null;
  notifications: NotificationMessage[];
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [notifications, setNotifications] = useState<NotificationMessage[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  
  // const connectWebSocket = useCallback(() => {
  //   if (isConnecting) return;
    
  //   setIsConnecting(true);
  //   const socketInstance = new WebSocket("wss://smkapi2025.bkt.net.vn/ws");

  //   socketInstance.onopen = () => {
  //     console.log('Đã kết nối thành công!');
  //     setIsConnecting(false);
  //     setSocket(socketInstance);
      
  //     // Xóa timeout reconnect nếu có
  //     if (reconnectTimeoutRef.current) {
  //       clearTimeout(reconnectTimeoutRef.current);
  //     }
  //   };

  //   // socketInstance.onmessage = (event) => {
  //   //   try {
  //   //     const data = JSON.parse(event.data);
  //   //     console.log('Nhận được dữ liệu:', data);
        
  //   //     if (data.title && data.message) {
  //   //       const newNotification: NotificationMessage = {
  //   //         title: data.title,
  //   //         message: data.message
  //   //       };
  //   //       setNotifications(prev => [...prev, newNotification]);
  //   //     }
  //   //   } catch (error) {
  //   //     console.error('Lỗi parse dữ liệu:', error);
  //   //   }
  //   // };

  //   socketInstance.onerror = (error) => {
  //     console.log('Lỗi:', error);
  //     socketInstance.close();
  //   };

  //   socketInstance.onclose = () => {
  //     console.log('Kết nối đã đóng - Đang thử kết nối lại...');
  //     setSocket(null);
  //     setIsConnecting(false);

  //     // Thử kết nối lại sau 3 giây
  //     reconnectTimeoutRef.current = setTimeout(() => {
  //       connectWebSocket();
  //     }, 3000);
  //   };
  // }, [isConnecting]);

  // Kết nối lần đầu
  // useEffect(() => {
  //   connectWebSocket();

  //   // Cleanup khi component unmount
  //   return () => {
  //     if (socket) {
  //       socket.close();
  //     }
  //     if (reconnectTimeoutRef.current) {
  //       clearTimeout(reconnectTimeoutRef.current);
  //     }
  //   };
  // }, []);

  // Kiểm tra kết nối định kỳ
  // useEffect(() => {
  //   const pingInterval = setInterval(() => {
  //     if (socket && socket.readyState === WebSocket.OPEN) {
  //       // Gửi ping để giữ kết nối
  //       socket.send(JSON.stringify({ type: 'ping' }));
  //     } else if (!isConnecting) {
  //       // Nếu không có kết nối và không đang trong quá trình kết nối
  //       connectWebSocket();
  //     }
  //   }, 30000); // Kiểm tra mỗi 30 giây

  //   return () => clearInterval(pingInterval);
  // }, [socket, isConnecting, connectWebSocket]);

  return (
    <SocketContext.Provider value={{ socket, notifications }}>
      {children}
    </SocketContext.Provider>
  );
};

// export const useSocket = () => {
//   const context = useContext(SocketContext);
//   if (!context) {
//     throw new Error('useSocket must be used within a SocketProvider');
//   }
//   return {
//     socket: context.socket,
//     notifications: context.notifications
//   };
// };