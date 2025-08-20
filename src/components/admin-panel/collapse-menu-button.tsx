"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Dot, LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DropdownMenuArrow } from "@radix-ui/react-dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

type Submenu = {
  href: string;
  label: string;
  active: boolean;
  disabled?: boolean;
};

interface CollapseMenuButtonProps {
  icon?: LucideIcon;
  iconSrc: string;
  label: string;
  active: boolean;
  submenus: Submenu[];
  isOpen: boolean | undefined;
  href: string;
  disabled?: boolean;
}

export function CollapseMenuButton({
  // icon: Icon,
  iconSrc,
  label,
  active,
  submenus,
  isOpen,
  href,
  disabled
}: CollapseMenuButtonProps) {
  const router = useRouter();
  const isSubmenuActive = submenus.some((submenu) => submenu.active);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(isSubmenuActive);

  const handleToggleMenu = () => {
    setIsCollapsed((prev) => !prev);
  };

  const handleMainMenuClick = (e: React.MouseEvent) => {
    // Prevent the collapsible trigger from firing
    e.stopPropagation();
    router.push(href);
  };

  return isOpen ? (
    <Collapsible
      open={isCollapsed}
      onOpenChange={setIsCollapsed}
      className="w-full"
    >
      <CollapsibleTrigger
        className="[&[data-state=open]>div>div>svg]:rotate-180 mb-1 text-xl font-semibold"
        asChild
      >
        <Button
          variant={active ? "secondary" : "ghost"}
          className="w-full justify-start h-16"
          disabled={disabled}
        >
          <div className="w-full items-center flex justify-between">
            <div className="flex items-center">
              <div className="mr-4 z-50" onClick={handleToggleMenu}>
                {/* <Icon size={18} /> */}
                <Image
                  src={iconSrc}
                  width={40}
                  height={40}
                  alt="icon"
                  className="object-contain"
                />
              </div>
              {/* <p
                className={cn(
                  "max-w-[150px] truncate",
                  isOpen
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-96 opacity-0"
                )}
              >
                {label}
              </p> */}
              <p
                className={cn(
                  "max-w-[130px] break-words whitespace-normal text-start cursor-pointer",
                  isOpen
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-96 opacity-0"
                )}
                onClick={handleMainMenuClick}
              >
                {label}
              </p>
            </div>
            <div
              className={cn(
                "whitespace-nowrap",
                isOpen
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-96 opacity-0"
              )}
            >
              <ChevronDown size={18} />
            </div>
          </div>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="overflow-hidden">
        {submenus.map(({ href, label, active, disabled }, index) => {
          return disabled ? (
            <Button
              key={index}
              variant={active ? "secondary" : "ghost"}
              className="w-full justify-start h-10 mb-1 text-lg"
              disabled={true}
            >
              <span className="mr-4 ml-4">{/* <Dot size={18} /> */}</span>
              <p
                className={cn(
                  "max-w-[200px] truncate",
                  isOpen
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-96 opacity-0"
                )}
              >
                {label}
              </p>
            </Button>
          ) : (
            <Button
              key={index}
              variant={active ? "secondary" : "ghost"}
              className="w-full justify-start h-10 mb-1 text-lg"
              asChild
            >
              <Link href={href}>
                <span className="mr-4 ml-4">{/* <Dot size={18} /> */}</span>
                <p
                  className={cn(
                    "max-w-[200px] truncate",
                    isOpen
                      ? "translate-x-0 opacity-100"
                      : "-translate-x-96 opacity-0"
                  )}
                >
                  {label}
                </p>
              </Link>
            </Button>
          );
        })}
      </CollapsibleContent>
    </Collapsible>
  ) : (
    <DropdownMenu>
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant={active ? "secondary" : "ghost"}
                className="w-full justify-start mb-1 h-20"
                disabled={disabled}
              >
                <div className="w-full items-center flex justify-between">
                  <div className="flex items-center">
                    {/* <span className={cn(isOpen === false ? "" : "mr-4")}>
                      <Icon size={18} />
                     
                    </span> */}
                    <Image
                      src={iconSrc}
                      width={50}
                      height={50}
                      alt="icon"
                      className="object-contain"
                    />
                    <p
                      className={cn(
                        "max-w-[200px] truncate",
                        isOpen === false ? "opacity-0" : "opacity-100"
                      )}
                    >
                      {label}
                    </p>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="right" align="start" alignOffset={2}>
            {label}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DropdownMenuContent side="right" sideOffset={25} align="start">
        <DropdownMenuLabel className="max-w-[190px] truncate">
          {label}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {submenus.map(({ href, label }, index) => (
          <DropdownMenuItem key={index} asChild>
            <Link className="cursor-pointer" href={href}>
              <p className="max-w-[180px] truncate">{label}</p>
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuArrow className="fill-border" />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
