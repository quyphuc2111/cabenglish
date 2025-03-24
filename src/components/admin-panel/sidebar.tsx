import { cn } from "@/lib/utils";
import { useStore } from "@/hooks/use-store";
import { Menu } from "@/components/admin-panel/menu";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import { SidebarToggle } from "@/components/admin-panel/sidebar-toggle";
import AvatarUser from "./avatar-user";
import Image from "next/image";
import { Badge } from "../ui/badge";
import OptimizeImage from "../common/optimize-image";
import { motion } from "framer-motion";
import { useModal } from "@/hooks/useModalStore";
import { NotificationType } from "@/types/notification";

export function Sidebar({notificationList}  : {notificationList: NotificationType[]}) {
  const sidebar = useStore(useSidebarToggle, (state) => state);
  const { onOpen } = useModal();

  if (!sidebar) return null;

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-20 h-screen -translate-x-full lg:translate-x-0 transition-[width] ease-in-out duration-300 bg-[#c35690] text-white bg-menu-texture",
        sidebar?.isOpen === false ? "w-[100px]" : "w-72"
      )}
    >
      <SidebarToggle isOpen={sidebar?.isOpen} setIsOpen={sidebar?.setIsOpen} />
      <div className="relative h-full flex flex-col px-1 py-4">
        <div className="flex justify-between">
          <Image
            src="/bkt_logo.png"
            width={70}
            height={50}
            alt="bkt-logo"
            priority
            quality={75}
          />
          {sidebar?.isOpen && <Badge variant="secondary">Giáo viên</Badge>}
        </div>
        <AvatarUser sidebar={sidebar} />
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
        <Menu isOpen={sidebar?.isOpen} />
        <div className="relative h-full w-full">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
              y: [0, -8, 0]
            }}
            transition={{
              duration: 1.5,
              y: {
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
            className="absolute bottom-4 left-[13%] flex items-start gap-3"
            onClick={() => onOpen("notification", {
              notificationList: notificationList
            })}
          >
            <OptimizeImage
              src="/assets/image/bkt_mascot.webp"
              width={90}
              height={128}
              alt="BKT Mascot"
              className="flex-shrink-0 object-contain"
              priority={true}
            />

            <div className="relative">
              <OptimizeImage
                src="/assets/image/notification.webp"
                width={60}
                height={60}
                alt="Notification Icon"
                className="flex-shrink-0 object-contain"
              />
              <Badge
                variant="destructive"
                className="absolute top-0 right-1 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium"
              >
                {notificationList.filter((item) => item.isRead === false).length}
              </Badge>
            </div>
          </motion.div>
        </div>
      </div>
    </aside>
  );
}
