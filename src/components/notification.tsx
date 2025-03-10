"use client";
import { useNotification } from "@/hooks/use-notification";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

interface NotificationDetailProps {
  title: string;
  content_html: string;
  created_at: string;
}

const NotificationDetail = ({
  title,
  content_html,
  created_at
}: NotificationDetailProps) => {
  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-500">
        {new Date(created_at).toLocaleString("vi-VN", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        })}
      </div>
      <div
        className="prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: content_html }}
      />
    </div>
  );
};

export const NotificationList = ({ userId }: { userId: string }) => {
  const { notifications, markAsRead } = useNotification(userId);
  const [selectedNotification, setSelectedNotification] = useState<any>(null);

  const handleNotificationClick = (notification: any) => {
    setSelectedNotification(notification);
    if (!notification.is_read) {
      handleMarkAsRead(notification.notification_id);
    }
  };

  const handleMarkAsRead = async (notificationId: number) => {
    await markAsRead(notificationId);
  };

  return (
    <>
      <div className="relative w-full">
        <ScrollArea className="h-[400px] w-full rounded-md">
          <div className="p-4 space-y-3">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-gray-500">
                <svg
                  className="w-12 h-12 mb-2 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <p className="text-sm font-medium">Không có thông báo nào</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.notification_id}
                  className={cn(
                    "group relative",
                    "p-4 rounded-lg",
                    "border border-gray-100",
                    "transition-all duration-200",
                    "hover:shadow-md hover:bg-gray-50",
                    "cursor-pointer",
                    notification.is_read ? "bg-white" : "bg-blue-50"
                  )}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 truncate group-hover:text-blue-600">
                        {notification.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                        {notification.description}
                      </p>
                      {/* Preview của content HTML */}
                      <div className="mt-2 text-xs text-gray-500 line-clamp-1">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: notification.content_html.replace(
                              /<[^>]*>/g,
                              ""
                            )
                          }}
                        />
                      </div>
                      <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>

                        {new Date(notification.created_at).toLocaleString(
                          "vi-VN",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          }
                        )}
                      </div>
                    </div>
                    {!notification.is_read && (
                      <span className="flex-shrink-0 w-2.5 h-2.5 bg-blue-500 rounded-full" />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Dialog hiển thị chi tiết notification */}
      <Dialog
        open={!!selectedNotification}
        onOpenChange={() => setSelectedNotification(null)}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedNotification?.title}</DialogTitle>
          </DialogHeader>
          {selectedNotification && (
            <NotificationDetail
              title={selectedNotification.title}
              content_html={selectedNotification.content_html}
              created_at={selectedNotification.created_at}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
