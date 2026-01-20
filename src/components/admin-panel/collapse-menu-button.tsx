"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, LucideIcon } from "lucide-react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible";

type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

interface CollapseMenuButtonProps {
  icon: LucideIcon;
  label: string;
  active: boolean;
  submenus: Submenu[];
  isOpen: boolean | undefined;
  href: string;
  iconImage?: string;
  submenuIcons?: Record<string, string>;
}

export function CollapseMenuButton({
  icon: Icon,
  label,
  active,
  submenus,
  isOpen,
  href,
  iconImage,
  submenuIcons = {}
}: CollapseMenuButtonProps) {
  const isSubmenuActive = submenus.some((submenu) => submenu.active);
  // Default to true (expanded) instead of only when submenu is active
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);

  return (
    <Collapsible
      open={isCollapsed}
      onOpenChange={setIsCollapsed}
      className="w-full"
    >
      <CollapsibleTrigger
        className="[&[data-state=open]>div>div>svg]:rotate-180 mb-2 w-full"
        asChild
      >
        <div
          className={cn(
            "flex items-center gap-3 py-3 transition-all relative cursor-pointer",
            isOpen === false ? "justify-center px-0" : "px-4",
            active ? "bg-white/20" : "hover:bg-white/10"
          )}
        >
          <div className="w-[40px] h-[40px] flex items-center justify-center relative z-10 flex-shrink-0">
            {iconImage ? (
              <Image
                src={iconImage}
                alt={label}
                width={40}
                height={40}
                className="object-contain"
              />
            ) : (
              <Icon size={32} className="text-white" />
            )}
          </div>
          <Link href={href} className={cn(
            "relative z-10 transition-all",
            isOpen === false ? "w-0 overflow-hidden" : "flex-1"
          )}>
            <span
              className={cn(
                "text-[20px] font-semibold text-white leading-[1.21]",
                isOpen === false
                  ? "w-0 opacity-0 overflow-hidden"
                  : "w-auto opacity-100"
              )}
            >
              {label}
            </span>
          </Link>
          <div className={cn(
            "relative z-10 transition-all flex-shrink-0",
            isOpen === false ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100"
          )}>
            <ChevronDown
              size={20}
              className="text-white transition-transform duration-200"
            />
          </div>
        </div>
      </CollapsibleTrigger>
      {isOpen !== false && (
        <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
          <div className="space-y-1 pl-6 mt-1">
            {submenus.map(({ href, label, active }, index) => (
              <Link
                key={index}
                href={href}
                className={cn(
                  "flex items-center gap-3 py-2 px-4 transition-all rounded-xl",
                  active ? "bg-white/10" : "hover:bg-white/5"
                )}
              >
                <Image
                  src={submenuIcons[label] || "/placeholder.png"}
                  alt={label}
                  width={24}
                  height={24}
                  className="rounded-full object-contain"
                />
                <span className="text-[18px] font-medium text-white leading-[1.21]">
                  {label}
                </span>
              </Link>
            ))}
          </div>
        </CollapsibleContent>
      )}
    </Collapsible>
  );
}
