"use client";

import React from "react";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "../ui/dialog";
import { useModal } from "@/hooks/useModalStore";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";
import OptimizeImage from "../common/optimize-image";
import { ScrollArea } from "../ui/scroll-area";
import { NotificationType } from "@/types/notification";
import { useSocket } from "@/hooks/useSocket";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNotification } from "@/hooks/client/useNotification";
import { getNotificationListByUserId } from "@/actions/notificationAction";
import { useSession } from "next-auth/react";

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
  const { isOpen, onClose, type } = useModal();
  const [selectedNotification, setSelectedNotification] =
    React.useState<NotificationType | null>(null);

  const { socket, notifications: socketNotifications } = useSocket();
  const { mutate: markAsReadNoti } = useNotification();
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const response = await getNotificationListByUserId({
        userId: session?.user?.userId as string
      });
      return response.data || [];
    },
    enabled: !!session?.user?.userId
  });

  React.useEffect(() => {
    if (socketNotifications.length > 0) {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    }
  }, [socketNotifications, queryClient]);

  const unreadCount = notifications.filter(
    (n: NotificationType) => !n.isRead
  ).length;

  const handleNotificationClick = (notification: NotificationType) => {
    setSelectedNotification(notification);
  };

  const markAllAsRead = async () => {
    // Implement markAllAsRead functionality here
    // After implementation, invalidate notifications query
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  };

  const markAsRead = async (notificationId: number) => {
    await markAsReadNoti({
      notificationId: notificationId
    });
  };

  const renderContent = () => {
    return (
      <ScrollArea className="h-[400px] px-2 py-4 bg-[#E48B8B]/60 ">
        <div className="space-y-3">
          {notifications
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
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
                  <p className="font-medium line-clamp-1 max-w-[500px]">
                    {notification.title}
                  </p>
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
            <DialogTitle />
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
                        <h2 className="text-xl font-bold uppercase line-clamp-3 max-w-[650px]">
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
                        <div>
                          <OptimizeImage
                            src="/assets/image/bkt_mascot.webp"
                            width={120}
                            height={160}
                            alt="BKT Mascot"
                            className="object-contain"
                            priority={true}
                          />
                        </div>
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
                        <div>
                          <OptimizeImage
                            src="/assets/image/bkt_mascot.webp"
                            width={120}
                            height={160}
                            alt="BKT Mascot"
                            className="object-contain"
                            priority={true}
                          />
                        </div>
                      </div>

                      <div className="col-span-3">{renderContent()}</div>
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
