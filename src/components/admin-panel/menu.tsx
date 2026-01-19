"use client";

import Link from "next/link";
import { Ellipsis } from "lucide-react";
import { usePathname } from "next/navigation";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { getMenuList } from "@/lib/menu-list";
import { Button } from "@/components/ui/button";
import { CollapseMenuButton } from "@/components/admin-panel/collapse-menu-button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider
} from "@/components/ui/tooltip";

interface MenuProps {
  isOpen: boolean | undefined;
}

// Map menu labels to icon paths
const menuIcons: Record<string, string> = {
  "Lớp học": "/menu-icons/lop-hoc.png",
  "Khoá học": "/menu-icons/khoa-hoc.png",
  "Mở rộng": "/menu-icons/mo-rong.png",
  "Quà tặng": "/menu-icons/qua-tang.png"
};

// Map submenu labels to icon paths
const submenuIcons: Record<string, string> = {
  "CAB Kid 1": "/menu-icons/cab-kid-1.png",
  "CAB Kid 2": "/menu-icons/cab-kid-2.png",
  "CAB Kid 3": "/menu-icons/cab-kid-3.png",
  "CAB Kid 4": "/menu-icons/cab-kid-4.png"
};

export function Menu({ isOpen }: MenuProps) {
  const pathname = usePathname();
  const menuList = getMenuList(pathname);

  return (
    <nav className="h-full w-full flex flex-col ">
      <ul className="flex flex-col items-start space-y-2 px-0 flex-1 bg-[#BD5353]/80">
        {menuList.map(({ groupLabel, menus }, index) => (
          <li className={cn("w-full", groupLabel ? "pt-5" : "")} key={index}>
            {(isOpen && groupLabel) || isOpen === undefined ? (
              <p className="text-sm font-medium text-muted-foreground px-4 pb-2 max-w-[248px] truncate">
                {groupLabel}
              </p>
            ) : !isOpen && isOpen !== undefined && groupLabel ? (
              <TooltipProvider>
                <Tooltip delayDuration={100}>
                  <TooltipTrigger className="w-full">
                    <div className="w-full flex justify-center items-center">
                      <Ellipsis className="h-5 w-5" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{groupLabel}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <p className="pb-0"></p>
            )}
            {menus.map(
              ({ href, label, icon: Icon, active, submenus }, index) =>
                submenus.length === 0 ? (
                  <div className="w-full mb-2" key={index}>
                    <TooltipProvider disableHoverableContent>
                      <Tooltip delayDuration={100}>
                        <TooltipTrigger asChild>
                          <Link href={href} className="block w-full">
                            <div
                              className={cn(
                                "flex items-center gap-3 py-3 px-4 transition-all relative rounded-2xl",
                                active
                                  ? "bg-white/20"
                                  : "hover:bg-white/10"
                              )}
                            >
                              <div className="w-[40px] h-[40px] flex items-center justify-center relative z-10">
                                <Image
                                  src={menuIcons[label] || "/placeholder.png"}
                                  alt={label}
                                  width={40}
                                  height={40}
                                  className="object-contain"
                                />
                              </div>
                              <span
                                className={cn(
                                  "text-[20px] font-semibold text-white relative z-10 leading-[1.21]",
                                  isOpen === false
                                    ? "-translate-x-96 opacity-0"
                                    : "translate-x-0 opacity-100"
                                )}
                              >
                                {label}
                              </span>
                            </div>
                          </Link>
                        </TooltipTrigger>
                        {isOpen === false && (
                          <TooltipContent side="right">
                            {label}
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                ) : (
                  <div className="w-full mb-2" key={index}>
                    <CollapseMenuButton
                      icon={Icon}
                      label={label}
                      active={active}
                      submenus={submenus}
                      isOpen={isOpen}
                      href={href}
                      iconImage={menuIcons[label]}
                      submenuIcons={submenuIcons}
                    />
                  </div>
                )
            )}
          </li>
        ))}
      </ul>

      {/* Notification Button at Bottom */}
      <div className="flex px-4 pb-8 mt-auto justify-between gap-3 items-end">
        <div>
        <Image
            src="/home/noti_icon.png"
            alt="notification"
            width={200}
            height={35}
            className="object-contain"
          />
        </div>
        <Button
          variant="outline"
          className="w-full h-[100px]   bg-white text-[#D12828] flex-col border-none rounded-[50px] py-8 hover:bg-white/90 shadow-md flex items-center justify-center gap-3"
        >
          <Image
            src="/menu-icons/bells.png"
            alt="notification"
            width={48}
            height={35}
            className="object-contain"
          />
          <span className="text-[32px] font-bold leading-[1.21]">Thông báo</span>
        </Button>
      </div>
    </nav>
  );
}
