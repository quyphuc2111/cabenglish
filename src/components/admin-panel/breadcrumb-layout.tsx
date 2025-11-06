"use client";

import { ScrollArea } from "../ui/scroll-area";
import { BreadcrumbNavbar } from "./breadcrumb-navbar";
import { NavbarMobile } from "./navbar-com/NavbarMobile";
import { cn } from "@/lib/utils";
import { useModal } from "@/hooks/useModalStore";
import { useLogout } from "@/hooks/useLogout";
import { useTranslation } from "@/hooks/useTranslation";
import { useSession } from "next-auth/react";

interface BreadcrumbLayoutProps {
  title: string;
  children: React.ReactNode;
  type?: string;
}

export function BreadcrumbLayout({ title, type, children }: BreadcrumbLayoutProps) {
  const { t } = useTranslation("", "common");
  const { data: session } = useSession();
  const { onOpen } = useModal();
  const { logout } = useLogout();

  const handleChangeTheme = () => {
    onOpen("changeTheme");
  };

  const handleLogout = async () => {
    await logout({
      showToastMessages: true
    });
  };

  return (
    <>
      <div className="px-3 sm:px-4 md:px-6 2xl:px-8 mt-safe-top sm:mt-5">
        <BreadcrumbNavbar title={title} type={type} />
      </div>
      <ScrollArea 
        className={cn(
          "h-[calc(100vh-150px-env(safe-area-inset-top)-env(safe-area-inset-bottom))]",
          "sm:h-[calc(100vh-170px-env(safe-area-inset-top)-env(safe-area-inset-bottom))]", 
          "md:h-[calc(100vh-170px-env(safe-area-inset-top)-env(safe-area-inset-bottom))]",
          "px-3 sm:px-4 md:px-6 2xl:px-8 mt-2 md:mt-7 pb-safe-bottom",
          "overscroll-contain"
        )}
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div className="py-2 sm:py-3 lg:pt-2 lg:pb-12 px-safe-left pr-safe-right">
          {children}
        </div>
      </ScrollArea>

      {/* Mobile navbar controls */}
      <NavbarMobile
        t={t as (key: string) => string}
        onChangeTheme={handleChangeTheme}
        onLogout={handleLogout}
        userId={session?.user?.userId}
        showText={true}
      />
    </>
  );
}
