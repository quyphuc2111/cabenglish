"use client";

import Link from "next/link";
import { Ellipsis, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { useMenuList } from "@/lib/menu-list";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CollapseMenuButton } from "@/components/admin-panel/collapse-menu-button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider
} from "@/components/ui/tooltip";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useUserInfo } from "@/hooks/useUserInfo";

interface MenuProps {
  isOpen: boolean | undefined;
  disabled?: boolean;
}

export function Menu({ isOpen, disabled }: MenuProps) {
  const { data: session } = useSession();
  const { data: userInfo } = useUserInfo(session?.user?.userId);
  const currentTeachingMode = userInfo?.mode === "default" ? "defaultMode" : "freeMode";

  const pathname = usePathname();
  const menuList = useMenuList(pathname, currentTeachingMode);

  return (
    <nav className="mt-4 3xl:mt-8 h-full w-full">
      <ScrollArea className="h-full w-full pr-2">
        <ul className="flex flex-col items-start space-y-1 px-2 pb-4">
        {menuList.map(({ groupLabel, menus }, index) => (
          <li
            className={cn("w-full", groupLabel ? "pt-5" : "")}
            key={index}
          >
            {(isOpen && groupLabel) || isOpen === undefined ? (
              <p
                className="text-sm font-medium text-muted-foreground px-4 pb-2 max-w-[248px] truncate"
              >
                {groupLabel}
              </p>
            ) : !isOpen && isOpen !== undefined && groupLabel ? (
              <TooltipProvider>
                <Tooltip delayDuration={100}>
                  <TooltipTrigger className="w-full">
                    <div
                      className="w-full flex justify-center items-center"
                    >
                      <Ellipsis className="h-5 w-5" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{groupLabel}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <p className="pb-2"></p>
            )}
            {menus.map(({ href, label, iconSrc, active, submenus, disabled }, index) =>
              submenus.length === 0 ? (
                <div
                  className="w-full"
                  key={index}
                >
                  <TooltipProvider disableHoverableContent>
                    <Tooltip delayDuration={100}>
                      <TooltipTrigger asChild>
                        <Button
                          variant={active ? "secondary" : "ghost"}
                          className={cn(
                            "w-full justify-start h-16 mb-1",
                            disabled && "opacity-50 cursor-not-allowed"
                          )}
                          disabled={disabled}
                          asChild={!disabled}
                        >
                          {!disabled ? (
                            <Link
                              href={href}
                              className="w-full flex items-center gap-4"
                            >
                              <div>
                                <Image
                                  src={iconSrc}
                                  width={40}
                                  height={40}
                                  alt="icon"
                                  className="max-w-fit"
                                  loading="lazy"
                                  quality={75}
                                  onLoad={(event) => {
                                    if (event.currentTarget instanceof HTMLImageElement) {
                                      event.currentTarget.style.animation = 'none';
                                    }
                                  }}
                                />
                              </div>
                              <p
                                className={cn(
                                  "max-w-[130px] break-words whitespace-normal text-xl font-semibold text-start",
                                  isOpen === false
                                    ? "-translate-x-96 opacity-0"
                                    : "translate-x-0 opacity-100"
                                )}
                              >
                                {label}
                              </p>
                            </Link>
                          ) : (
                            <div className="w-full flex items-center gap-4">
                              <Image
                                src={iconSrc}
                                width={50}
                                height={50}
                                alt="icon"
                                className="max-w-fit opacity-50"
                              />
                              <p className={cn(
                                "max-w-[130px] break-words whitespace-normal text-xl font-semibold text-start",
                                isOpen === false
                                  ? "-translate-x-96 opacity-0"
                                  : "translate-x-0 opacity-100"
                              )}>
                                {label}
                              </p>
                            </div>
                          )}
                        </Button>
                      </TooltipTrigger>
                      {isOpen === false && (
                        <TooltipContent side="right">{label}</TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                </div>
              ) : (
                <div
                  className="w-full"
                  key={index}
                >
                  <CollapseMenuButton
                    iconSrc={iconSrc}
                    label={label}
                    active={active}
                    submenus={submenus}
                    isOpen={isOpen}
                    href={href}
                    disabled={disabled}
                  />
                </div>
              )
            )}
          </li>
        ))}
      </ul>
      </ScrollArea>
    </nav>
  );
}
