"use client";

import React from "react";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "../ui/dialog";
import { useModal } from "@/hooks/useModalStore";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";
import OptimizeImage from "../common/optimize-image";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { NotificationMessage, NotificationType } from "@/types/notification";
import { useSocket } from "@/hooks/useSocket";

// Thêm các animation variants
const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      duration: 0.5,
      bounce: 0.3
    }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.2
    }
  }
};

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 50 : -50,
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 50 : -50,
    opacity: 0
  })
};

function NotificationModal() {
  const { isOpen, onClose, type, data } = useModal();
  const [isLoading, setIsLoading] = React.useState(true);
  const [notifications, setNotifications] = React.useState<NotificationType[]>(
    []
  );
  const [selectedNotification, setSelectedNotification] =
    React.useState<NotificationType | null>(null);
  const { socket, notifications: socketNotifications } = useSocket();

  React.useEffect(() => {
    if (data?.notificationList) {
      setNotifications(data.notificationList);
      setIsLoading(false);
    }
  }, [data?.notificationList]);

  React.useEffect(() => {
    console.log("socketNotifi123213213cations", socketNotifications);
    if (socketNotifications.length > 0) {
      const latestNotification =
        socketNotifications[socketNotifications.length - 1];

      const newNotification: NotificationType = {
        notificationId: latestNotification.notificationId,
        type: latestNotification.type,
        title: latestNotification.title,
        description: latestNotification.description,
        contentHtml: latestNotification.contentHtml,
        createdAt: latestNotification.lastSentTime,
        isRead: false
      };

      setNotifications((prev) => {
        const exists = prev.some(
          (n) => n.notificationId === newNotification.notificationId
        );
        if (!exists) {
          return [newNotification, ...prev];
        }
        return prev;
      });
    }
  }, [socketNotifications]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleNotificationClick = (notification: NotificationType) => {
    setSelectedNotification(notification);
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const markAsRead = (notificationId: number) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.notificationId === notificationId ? { ...n, isRead: true } : n
      )
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-[400px]">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full"
          />
        </div>
      );
    }

    return (
      <ScrollArea className="h-[400px] px-2 py-4 bg-[#E48B8B]/60 ">
        <div className="space-y-3">
          {notifications
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map((notification) => (
              <motion.div
                key={notification.notificationId}
                whileHover={{ scale: 1.01 }}
                className={`bg-white p-4 rounded-lg shadow-sm cursor-pointer mx-2
                  ${notification.isRead ? "opacity-80" : "opacity-100"}`}
                onClick={() => {
                  handleNotificationClick(notification);
                  markAsRead(notification.notificationId);
                }}
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium line-clamp-1">{notification.title}</p>
                  {!notification.isRead && (
                    <div className="w-2 h-2 rounded-full bg-blue-600" />
                  )}
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                  {notification.description}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  {new Date(notification.createdAt).toLocaleString("vi-VN")}
                </p>
              </motion.div>
            ))}
        </div>
      </ScrollArea>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && type === "notification" && (
        <Dialog open={true} onOpenChange={onClose}>
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <DialogContent className="max-w-4xl !rounded-3xl overflow-hidden">
              <div className="p-4 space-y-4">
                {selectedNotification ? (
                  <motion.div
                    key="detail"
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    custom={1}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30
                    }}
                    className="flex flex-col gap-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <OptimizeImage
                          src="/assets/image/noti_icon.webp"
                          width={35}
                          height={35}
                          alt="Notification Icon"
                          className="flex-shrink-0 object-contain"
                        />
                        <h2 className="text-xl font-bold uppercase line-clamp-1">
                          {selectedNotification.title}
                        </h2>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedNotification(null)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        Quay lại
                      </Button>
                    </div>

                    <div className="grid grid-cols-4 gap-6">
                      <div className="col-span-1">
                        <motion.div
                          animate={{ y: [0, -8, 0] }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          <OptimizeImage
                            src="/assets/image/bkt_mascot.webp"
                            width={120}
                            height={160}
                            alt="BKT Mascot"
                            className="object-contain"
                            priority={true}
                          />
                        </motion.div>
                      </div>

                      <div className="col-span-3 bg-[#E48B8B]/60 rounded-lg p-6">
                        <ScrollArea className="h-[350px] overflow-y-auto">
                          <div className="bg-white rounded-lg p-6 shadow-sm">
                            <div
                              className="text-gray-700 leading-relaxed"
                              dangerouslySetInnerHTML={{
                                __html: selectedNotification.contentHtml
                              }}
                            />
                            <p className="text-sm text-gray-400 mt-4">
                              {new Date(
                                selectedNotification.createdAt
                              ).toLocaleString("vi-VN")}
                            </p>
                          </div>
                        </ScrollArea>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="list"
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    custom={-1}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30
                    }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <OptimizeImage
                          src="/assets/image/noti_icon.webp"
                          width={35}
                          height={35}
                          alt="Notification Icon"
                          className="flex-shrink-0 object-contain"
                        />
                        <h2 className="text-xl font-bold uppercase">
                          Thông báo ({unreadCount}/{notifications.length})
                        </h2>
                      </div>
                      <Button
                        variant="ghost"
                        onClick={markAllAsRead}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        Đánh dấu tất cả đã đọc
                      </Button>
                    </div>

                    <div className="grid grid-cols-4 gap-6">
                      <div className="col-span-1">
                        <motion.div
                          animate={{
                            y: [0, -8, 0]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          <OptimizeImage
                            src="/assets/image/bkt_mascot.webp"
                            width={120}
                            height={160}
                            alt="BKT Mascot"
                            className="object-contain"
                            priority={true}
                          />
                        </motion.div>
                      </div>

                      <div className="col-span-3">
                        {/* <ScrollArea className="h-[400px] px-2 py-4 bg-[#E48B8B]/60 ">
                          <div className="space-y-3">
                            
                          </div>
                        </ScrollArea> */}
                        {renderContent()}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </DialogContent>
          </motion.div>
        </Dialog>
      )}
    </AnimatePresence>
  );
}

export default NotificationModal;
