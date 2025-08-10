import { cn } from "@/lib/utils";
import { useStore } from "@/hooks/use-store";
import { Menu } from "@/components/admin-panel/menu";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import { SidebarToggle } from "@/components/admin-panel/sidebar-toggle";
import AvatarUser from "./avatar-user";
import Image from "next/image";
import { Badge } from "../ui/badge";
import OptimizeImage from "../common/optimize-image";
import { useModal } from "@/hooks/useModalStore";
import { NotificationType } from "@/types/notification";
import { useSocket } from "@/hooks/useSocket";
import { showToast } from "@/utils/toast-config";
import { useEffect, memo } from "react";
import { useSession } from "next-auth/react";
export const Sidebar = memo(function Sidebar({
  notificationList
}: {
  notificationList: NotificationType[];
}) {
  const sidebar = useStore(useSidebarToggle, (state) => state);
  const { socket, notifications: socketNotifications } = useSocket();
  const { onOpen } = useModal();

  const { data: session } = useSession();

  useEffect(() => {
    if (socketNotifications.length > 0) {
      const latestNotification =
        socketNotifications[socketNotifications.length - 1];
      showToast.success(
        <div className="min-w-[320px] max-w-[400px] p-2 font-sans">
          {/* Header */}
          <div className="flex justify-between items-start mb-2">
            <h4 className="text-base font-semibold text-gray-900 leading-tight m-0">
              {latestNotification.title}
            </h4>
            <span className="text-xs text-gray-500 ml-3 whitespace-nowrap">
              {new Date(latestNotification.lastSentTime).toLocaleTimeString(
                "vi-VN"
              )}
            </span>
          </div>

          {/* Content */}
          <div className="text-gray-600">
            {latestNotification.description && (
              <p className="text-sm leading-relaxed mb-2">
                {latestNotification.description}
              </p>
            )}

            {latestNotification.contentHtml && (
              <div
                className="text-sm leading-relaxed prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{
                  __html: latestNotification.contentHtml
                }}
              />
            )}
          </div>
        </div>,
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          className: "bg-white shadow-lg border-l-4 border-green-500"
        }
      );
    }
  }, [socketNotifications]);

  if (!sidebar) return null;

  return (
    <aside
      className={cn(
        "sidebar-responsive force-responsive-transform fixed top-0 left-0 z-20 h-screen -translate-x-full lg:translate-x-0 bg-[#c35690] text-white bg-menu-texture",
        sidebar?.isOpen === false ? "w-[100px]" : "w-72"
      )}
    >
      <SidebarToggle isOpen={sidebar?.isOpen} setIsOpen={sidebar?.setIsOpen} />
      <div className="relative h-full flex flex-col px-1 py-4">
        {/* Header Section */}
        <div className="flex-shrink-0">
          <div className="flex justify-between">
            <Image
              src="/bkt_logo.png"
              width={60}
              height={40}
              alt="bkt-logo"
              priority
              quality={75}
            />
            {sidebar?.isOpen && <Badge variant="secondary">Giáo viên</Badge>}
          </div>
          <AvatarUser sidebar={sidebar} email={session?.user?.email} />
          <div className="w-full border-t-2 border-white mt-8 relative h-[30px]">
            <Image
              src="/menu-icon/ring.png"
              width={30}
              height={30}
              alt="ring"
              loading="lazy"
              quality={60}
              className="absolute left-[0%]"
            />
            <Image
              src="/menu-icon/ring.png"
              width={30}
              height={30}
              alt="ring"
              className="absolute left-[22%] "
            />
            <Image
              src="/menu-icon/unicorn.png"
              width={40}
              height={40}
              alt="unicorn"
              className="absolute left-1/2 -translate-x-1/2 -top-4"
            />
            <Image
              src="/menu-icon/ring.png"
              width={30}
              height={30}
              alt="ring"
              className="absolute right-[22%] "
            />
            <Image
              src="/menu-icon/ring.png"
              width={30}
              height={30}
              alt="ring"
              className="absolute right-0"
            />
          </div>
        </div>

        {/* Menu Section - Takes available space */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <Menu isOpen={sidebar?.isOpen} />
        </div>

        {/* Mascot Section - Fixed at bottom */}
        <div className="flex-shrink-0 relative h-[140px] sm:h-[150px] md:h-[160px] w-full">
          <div
            className="absolute bottom-2 left-[13%] flex items-start gap-3 cursor-pointer"
            onClick={() =>
              onOpen("notification", {
                notificationList: notificationList
              })
            }
          >
            <OptimizeImage
              src="/assets/image/bkt_mascot.webp"
              width={80}
              height={114}
              alt="BKT Mascot"
              className="flex-shrink-0 object-contain"
              priority={true}
            />

            <div className="relative">
              <OptimizeImage
                src="/assets/image/notification.webp"
                width={50}
                height={50}
                alt="Notification Icon"
                className="flex-shrink-0 object-contain"
              />
              <Badge
                variant="destructive"
                className="absolute top-0 right-1 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium"
              >
                {
                  notificationList.filter((item) => item.isRead === false)
                    .length
                }
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
});
