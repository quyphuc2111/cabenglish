import Link from "next/link";
import { PanelsTopLeft } from "lucide-react";

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
import { AdminMenu } from "./admin-menu";
import { AdminSidebarToggle } from "./admin-sidebar-toggle";

export function AdminSidebar() {
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
      <AdminSidebarToggle isOpen={sidebar?.isOpen} setIsOpen={sidebar?.setIsOpen} />
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
        </div>
        <AdminMenu isOpen={sidebar?.isOpen} />
        
      </div>
    </aside>
  );
}
