"use client";

import Link from "next/link";
import { Ellipsis, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { useAdminMenuList, useMenuList } from "@/lib/menu-list";
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

interface MenuProps {
  isOpen: boolean | undefined;
  disabled?: boolean;
}

export function AdminMenu({ isOpen, disabled }: MenuProps) {
  const pathname = usePathname();
  const menuList = useAdminMenuList(pathname);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      x: -20
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const iconVariants = {
    hidden: {
      scale: 0,
      rotate: -180
    },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    }
  };

  return (
    <motion.nav
      className="mt-8 h-full w-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <ScrollArea className="h-[80vh] w-full pr-2">
        <motion.ul className="flex flex-col items-start space-y-1 px-2">
          {menuList.map(({ groupLabel, menus }, index) => (
            <motion.li
              variants={itemVariants}
              className={cn("w-full", groupLabel ? "pt-5" : "")}
              key={index}
            >
              {(isOpen && groupLabel) || isOpen === undefined ? (
                <motion.p
                  variants={itemVariants}
                  className="text-sm font-medium text-muted-foreground px-4 pb-2 max-w-[248px] truncate"
                >
                  {groupLabel}
                </motion.p>
              ) : !isOpen && isOpen !== undefined && groupLabel ? (
                <TooltipProvider>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger className="w-full">
                      <motion.div
                        variants={iconVariants}
                        className="w-full flex justify-center items-center"
                      >
                        <Ellipsis className="h-5 w-5" />
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{groupLabel}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <p className="pb-2"></p>
              )}
              {menus.map(
                ({ href, label, iconSrc, active, submenus, disabled }, index) =>
                  submenus.length === 0 ? (
                    <motion.div
                      variants={itemVariants}
                      className="w-full"
                      key={index}
                    >
                      <TooltipProvider disableHoverableContent>
                        <Tooltip delayDuration={100}>
                          <TooltipTrigger asChild>
                            <Button
                              variant={active ? "secondary" : "ghost"}
                              className={cn(
                                "w-full justify-start h-20 mb-1",
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
                                  <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    <Image
                                      src={iconSrc}
                                      width={50}
                                      height={50}
                                      alt="icon"
                                      className="max-w-fit"
                                      loading="lazy"
                                      quality={75}
                                      onLoad={(event) => {
                                        if (
                                          event.currentTarget instanceof
                                          HTMLImageElement
                                        ) {
                                          event.currentTarget.style.animation =
                                            "none";
                                        }
                                      }}
                                    />
                                  </motion.div>
                                  <motion.p
                                    className={cn(
                                      "max-w-[200px] break-words whitespace-normal text-xl font-semibold text-start",
                                      isOpen === false
                                        ? "-translate-x-96 opacity-0"
                                        : "translate-x-0 opacity-100"
                                    )}
                                    animate={{
                                      x: isOpen === false ? -384 : 0,
                                      opacity: isOpen === false ? 0 : 1
                                    }}
                                    transition={{
                                      duration: 0.3
                                    }}
                                  >
                                    {label}
                                  </motion.p>
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
                                </div>
                              )}
                            </Button>
                          </TooltipTrigger>
                          {isOpen === false && (
                            <TooltipContent side="right">
                              {label}
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    </motion.div>
                  ) : (
                    <motion.div
                      variants={itemVariants}
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
                    </motion.div>
                  )
              )}
            </motion.li>
          ))}
        </motion.ul>
      </ScrollArea>
    </motion.nav>
  );
}
