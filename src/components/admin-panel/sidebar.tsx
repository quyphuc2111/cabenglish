import Link from "next/link";
import { PanelsTopLeft } from "lucide-react";

import { cn } from "@/lib/utils";
import { useStore } from "@/hooks/use-store";
import { Button } from "@/components/ui/button";
import { Menu } from "@/components/admin-panel/menu";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import { SidebarToggle } from "@/components/admin-panel/sidebar-toggle";
import AvatarUser from "./avatar-user";
import Image from "next/image";
import { Badge } from "../ui/badge";

export function Sidebar() {
  const sidebar = useStore(useSidebarToggle, (state) => state);

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
        {/* <Button
          className={cn(
            "transition-transform ease-in-out duration-300 mb-1",
            sidebar?.isOpen === false ? "translate-x-1" : "translate-x-0"
          )}
          variant="link"
          asChild
        >
          <Link href="/dashboard" className="flex items-center gap-2">
            <PanelsTopLeft className="w-6 h-6 mr-1" />
            <h1
              className={cn(
                "font-bold text-lg whitespace-nowrap transition-[transform,opacity,display] ease-in-out duration-300",
                sidebar?.isOpen === false
                  ? "-translate-x-96 opacity-0 hidden"
                  : "translate-x-0 opacity-100"
              )}
            >
              BKT Kids
            </h1>
          </Link>
        </Button> */}
        <div className="flex justify-between">
          <Image src="/bkt_logo.png" width={70} height={50} alt="bkt-logo" />

{
  sidebar?.isOpen ? (
    <Badge variant="secondary">Giáo viên</Badge>
  ) : (
   <></>
  )
}
        </div>
        <AvatarUser sidebar={sidebar} />
        <div className="w-full border-t-2 border-white mt-8 relative h-[30px]">
          <Image 
            src="/menu-icon/ring.png" 
            width={30} 
            height={30} 
            alt="ring"
            className="absolute left-[0%] " 
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
      </div>
    </aside>
  );
}
