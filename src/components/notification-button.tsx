"use client";
import React, { useMemo, useState } from "react";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useNotification } from "@/hooks/use-notification";
import { cn } from "@/lib/utils";
import { ScrollArea } from "./ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

const NOTIFICATIONS_PER_PAGE = 99;

function NotificationButton({
  showNotifications,
  setShowNotifications,
  userId = "1",
  className
}: {
  showNotifications: boolean;
  setShowNotifications: (showNotifications: boolean) => void;
  userId: string;
  className?: string;
}) {
  // const { notifications, markAsRead, markAllAsRead } = useNotification(userId);
  const [selectedNotification, setSelectedNotification] = React.useState<any>(null);
  const [expandedId, setExpandedId] = React.useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  // const unreadCount = useMemo(() => {
  //   return notifications.filter(notification => !notification.is_read).length;
  // }, [notifications]);

  // const displayedNotifications = useMemo(() => {
  //   if (showAll) {
  //     return notifications;
  //   }
  //   return notifications.slice(0, NOTIFICATIONS_PER_PAGE);
  // }, [notifications, showAll]);

  // const hasMoreNotifications = notifications.length > NOTIFICATIONS_PER_PAGE;

  // const handleNotificationClick = async (notification: any) => {
  //   setSelectedNotification(notification);
  //   setExpandedId(expandedId === notification.notification_id ? null : notification.notification_id);
  //   if (!notification.is_read) {
  //     await markAsRead(notification.notification_id);
  //   }
  // };

  // Thêm ref cho dropdown container
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  // Thêm useEffect để handle click outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        buttonRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setShowNotifications]);

  return (
    <div>123</div>
    // <>
    //   <div className={cn("relative", className)}>
    //     <Button
    //       ref={buttonRef}
    //       variant="outline"
    //       className={cn(
    //         "h-full px-4 flex items-center gap-2 bg-white",
    //         "hover:bg-gray-50 border border-gray-200",
    //         "shadow-sm hover:shadow-md transition-all duration-200 w-full",
    //         "relative"
    //       )}
    //       onClick={() => setShowNotifications(!showNotifications)}
    //     >
    //       <div className="flex items-center gap-2">
    //         <svg
    //           className="w-5 h-5"
    //           fill="none"
    //           stroke="currentColor"
    //           viewBox="0 0 24 24"
    //         >
    //           <path
    //             strokeLinecap="round"
    //             strokeLinejoin="round"
    //             strokeWidth={2}
    //             d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
    //           />
    //         </svg>
    //         <span>Thông báo</span>
    //       </div>

    //       {/* Animated Badge */}
    //       <AnimatePresence>
    //         {unreadCount > 0 && (
    //           <motion.span
    //             initial={{ scale: 0 }}
    //             animate={{ scale: 1 }}
    //             exit={{ scale: 0 }}
    //             className={cn(
    //               "absolute -top-1 -right-2",
    //               "w-5 h-5 bg-red-500 text-white",
    //               "rounded-full text-xs",
    //               "flex items-center justify-center",
    //               "font-medium"
    //             )}
    //           >
    //             {unreadCount}
    //           </motion.span>
    //         )}
    //       </AnimatePresence>
    //     </Button>

    //     {/* Dropdown with AnimatePresence */}
    //     <AnimatePresence>
    //       {showNotifications && (
    //         <motion.div
    //           ref={dropdownRef}
    //           initial={{ opacity: 0, y: -10 }}
    //           animate={{ opacity: 1, y: 0 }}
    //           exit={{ opacity: 0, y: -10 }}
    //           className={cn(
    //             "absolute right-0 mt-2",
    //             "w-96 bg-white rounded-lg",
    //             "shadow-xl border border-gray-100",
    //             "z-50 overflow-hidden"
    //           )}
    //         >
    //           <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
    //             <div className="flex items-center gap-2">
    //               <h3 className="font-semibold text-gray-800">Thông báo</h3>
    //               <span className="text-xs text-gray-500">
    //                 ({notifications.length})
    //               </span>
    //             </div>
    //             {unreadCount > 0 && (
    //               <Button
    //                 variant="ghost"
    //                 size="sm"
    //                 className="text-sm text-blue-600 hover:text-blue-700 font-medium"
    //                 onClick={markAllAsRead}
    //               >
    //                 Đánh dấu tất cả đã đọc
    //               </Button>
    //             )}
    //           </div>

    //           <ScrollArea className="h-[600px]">
    //             <div className="p-4 space-y-4">
    //               {notifications.length === 0 ? (
    //                 <div className="flex flex-col items-center justify-center py-8 text-gray-500">
    //                   <svg 
    //                     className="w-16 h-16 mb-4 text-gray-300" 
    //                     fill="none" 
    //                     stroke="currentColor" 
    //                     viewBox="0 0 24 24"
    //                   >
    //                     <path 
    //                       strokeLinecap="round" 
    //                       strokeLinejoin="round" 
    //                       strokeWidth={1.5} 
    //                       d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
    //                     />
    //                   </svg>
    //                   <p className="text-sm font-medium">Không có thông báo nào</p>
    //                 </div>
    //               ) : (
    //                 <>
    //                   {displayedNotifications.map(notification => (
    //                     <motion.div 
    //                       key={notification.notification_id}
    //                       layout
    //                       className={cn(
    //                         "group relative",
    //                         "rounded-xl",
    //                         "border",
    //                         "transition-all duration-200",
    //                         "hover:shadow-lg",
    //                         "cursor-pointer",
    //                         expandedId === notification.notification_id
    //                           ? "border-blue-200 bg-blue-50/50 shadow-md"
    //                           : "border-gray-100 hover:border-gray-200",
    //                         notification.is_read ? 'bg-white' : 'bg-blue-50/80'
    //                       )}
    //                       onClick={() => handleNotificationClick(notification)}
    //                     >
    //                       <div className="p-4">
    //                         <div className="flex items-start justify-between gap-4">
    //                           <div className="flex-1 min-w-0">
    //                             <h3 className={cn(
    //                               "font-semibold text-gray-900",
    //                               "group-hover:text-blue-600",
    //                               "line-clamp-1",
    //                               expandedId === notification.notification_id && "text-blue-700"
    //                             )}>
    //                               {notification.title}
    //                             </h3>
    //                             <p className="mt-1 text-sm text-gray-600 line-clamp-2">
    //                               {notification.description}
    //                             </p>
    //                             <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
    //                               <svg 
    //                                 className="w-4 h-4" 
    //                                 fill="none" 
    //                                 stroke="currentColor" 
    //                                 viewBox="0 0 24 24"
    //                               >
    //                                 <path 
    //                                   strokeLinecap="round" 
    //                                   strokeLinejoin="round" 
    //                                   strokeWidth={2} 
    //                                   d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
    //                                 />
    //                               </svg>
    //                               {new Date(notification.created_at).toLocaleString('vi-VN', {
    //                                 year: 'numeric',
    //                                 month: 'long',
    //                                 day: 'numeric',
    //                                 hour: '2-digit',
    //                                 minute: '2-digit'
    //                               })}
    //                             </div>
    //                           </div>
    //                           {!notification.is_read && (
    //                             <span className="flex-shrink-0 w-2.5 h-2.5 bg-blue-500 rounded-full mt-2"/>
    //                           )}
    //                         </div>

    //                         <div 
    //                                 className="text-sm text-gray-400 line-clamp-1"
    //                                 dangerouslySetInnerHTML={{ __html: notification.content_html }} 
    //                               />
    //                       </div>
    //                     </motion.div>
    //                   ))}

    //                   {/* Nút Xem thêm */}
    //                   {hasMoreNotifications && !showAll && (
    //                     <motion.div
    //                       initial={{ opacity: 0 }}
    //                       animate={{ opacity: 1 }}
    //                       className="pt-2"
    //                     >
    //                       <Button
    //                         variant="outline"
    //                         className={cn(
    //                           "w-full py-2 text-sm text-blue-600",
    //                           "border border-blue-200 bg-blue-50/50",
    //                           "hover:bg-blue-100/50 hover:border-blue-300",
    //                           "transition-all duration-200"
    //                         )}
    //                         onClick={() => setShowAll(true)}
    //                       >
    //                         <div className="flex items-center justify-center gap-2">
    //                           <span>Xem thêm</span>
    //                           <span className="text-xs text-gray-500">
    //                             ({notifications.length - NOTIFICATIONS_PER_PAGE} thông báo)
    //                           </span>
    //                         </div>
    //                       </Button>
    //                     </motion.div>
    //                   )}
    //                 </>
    //               )}
    //             </div>
    //           </ScrollArea>
    //         </motion.div>
    //       )}
    //     </AnimatePresence>
    //   </div>

    //   {/* Dialog hiển thị chi tiết notification */}
    //   <Dialog 
    //     open={!!selectedNotification} 
    //     onOpenChange={() => setSelectedNotification(null)}
    //   >
    //     <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
    //       <DialogHeader>
    //         <DialogTitle>{selectedNotification?.title}</DialogTitle>
    //       </DialogHeader>
    //       {selectedNotification && (
    //         <div className="space-y-4">
    //           <div className="text-sm text-gray-500">
    //             {new Date(selectedNotification.created_at).toLocaleString('vi-VN', {
    //               year: 'numeric',
    //               month: 'long',
    //               day: 'numeric',
    //               hour: '2-digit',
    //               minute: '2-digit'
    //             })}
    //           </div>
    //           <div 
    //             className="prose prose-sm max-w-none"
    //             dangerouslySetInnerHTML={{ __html: selectedNotification.content_html }} 
    //           />
    //         </div>
    //       )}
    //     </DialogContent>
    //   </Dialog>
    // </>
  );
}

export default NotificationButton;
