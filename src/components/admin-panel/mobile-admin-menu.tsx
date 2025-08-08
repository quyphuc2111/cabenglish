"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { AdminMenu } from "./admin-menu";
import { AdminSidebarToggle } from "./admin-sidebar-toggle";
import { useStore } from "@/hooks/use-store";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";

export function MobileAdminMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const sidebar = useStore(useSidebarToggle, (state) => state);

  if (!sidebar) return null;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden fixed top-4 left-4 z-50 bg-[#c35690]/90 backdrop-blur-sm text-white hover:bg-[#c35690] border border-white/20 shadow-lg"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-80 p-0 !bg-[#c35690] text-white border-r-0 bg-menu-texture "
      >
        <div className="h-full flex flex-col">
          <SheetHeader className="px-4 py-4 border-b border-white/20">
            <SheetTitle className="text-left">
              <div className="flex items-center gap-3">
                <Image
                  src="/bkt_logo.png"
                  width={60}
                  height={45}
                  alt="bkt-logo"
                  priority
                  quality={75}
                  loading="eager"
                />
                <span className="text-white text-lg font-semibold">
                  SmartKids
                </span>
              </div>
            </SheetTitle>
          </SheetHeader>

          {/* Menu content */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <AdminMenu isOpen={true} />
            </ScrollArea>
          </div>

          {/* Toggle button ở dưới cùng */}
          <div className="mt-auto mb-4">
            <AdminSidebarToggle
              isOpen={sidebar?.isOpen}
              setIsOpen={() => {
                sidebar?.setIsOpen();
                setIsOpen(false); // Đóng sheet khi toggle
              }}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
