import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { useStore } from "@/hooks/use-store";
import { Menu } from "@/components/admin-panel/menu";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import { SidebarToggle } from "@/components/admin-panel/sidebar-toggle";
import AvatarUser from "./avatar-user";

export function Sidebar() {
  const sidebar = useStore(useSidebarToggle, (state) => state);
  
  if(!sidebar) return null;

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-20 h-screen -translate-x-full lg:translate-x-0 transition-[width] ease-in-out duration-300",
        "bg-gradient-to-b from-[#BD5353]/66 to-[#BD5353]/66",
        "rounded-r-[50px]",
        sidebar?.isOpen === false ? "w-[100px]" : "w-[400px]"
      )}
      style={{
        backgroundImage: "url('/home/patten.png')",
        backgroundSize: "cover",
        backgroundPosition: "bottom"
      }}
    >
       <div className="absolute inset-0 bg-white/50  pointer-events-none "></div>
        
      <SidebarToggle isOpen={sidebar?.isOpen} setIsOpen={sidebar?.setIsOpen} />
      <div className="relative h-full flex flex-col  pt-4">
        {/* Logo */}
        <div className={cn(
          "mb-8 transition-all flex justify-center",
          sidebar?.isOpen === false ? "px-0" : "px-2"
        )}>
          <Image
            src="/sidebar/logo.svg"
            alt="Logo"
            width={sidebar?.isOpen === false ? 50 : 57}
            height={sidebar?.isOpen === false ? 50 : 57}
            className="object-contain"
          />
        </div>

        {/* Avatar User */}
        <AvatarUser sidebar={sidebar} />
        
        {/* Menu */}
        <Menu isOpen={sidebar?.isOpen} />
      </div>
    </aside>
  );
}
