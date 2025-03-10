import { useEffect, useState, useCallback } from 'react';
import { useSocket } from '../providers/socket-provider';

interface Notification {
  notification_id: number;
  title: string;
  description: string;
  content_html: string;
  created_at: string;
  is_read: boolean;
}

export const useNotification = (userId: string) => {
  const socket = useSocket();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:3005/api/notifications/${userId}`);
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  }, [userId]);

  // Cải thiện markAsRead để trả về Promise
  const markAsRead = useCallback(async (notificationId: number) => {
    try {
      // Optimistic update
      setNotifications(prev =>
        prev.map(notification =>
          notification.notification_id === notificationId
            ? { ...notification, is_read: true }
            : notification
        )
      );

      // API call
      await fetch(`http://localhost:3005/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      // Rollback on error
      await fetchNotifications();
      return false;
    }
  }, [userId, fetchNotifications]);

  // Thêm hàm markAllAsRead
  const markAllAsRead = useCallback(async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.is_read);
      
      // Optimistic update
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, is_read: true }))
      );

      // Gọi API cho từng notification
      await Promise.all(
        unreadNotifications.map(notification =>
          fetch(`http://localhost:3005/api/notifications/${notification.notification_id}/read`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }),
          })
        )
      );

      // Refresh để đảm bảo đồng bộ
      await fetchNotifications();
    } catch (error) {
      console.error('Error marking all as read:', error);
      // Rollback on error
      await fetchNotifications();
    }
  }, [notifications, userId, fetchNotifications]);

  useEffect(() => {
    if (!socket || !userId) return;

    const handleNewNotification = (notification: Notification) => {
      setNotifications(prev => [notification, ...prev]);
    };

    socket.on('connect', () => {
      socket.emit('register_user', userId);
    });

    socket.on('new_notification', handleNewNotification);
    
    fetchNotifications();

    return () => {
      socket.off('new_notification', handleNewNotification);
    };
  }, [socket, userId, fetchNotifications]);

  return {
    notifications,
    markAsRead,
    markAllAsRead,
    fetchNotifications,
  };
};
