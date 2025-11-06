"use client";

import { Navbar } from "@/components/admin-panel/navbar";
import { NavbarMobile } from "@/components/admin-panel/navbar-com/NavbarMobile";
import { ScrollArea } from "../ui/scroll-area";
import { useModal } from "@/hooks/useModalStore";
import { useLogout } from "@/hooks/useLogout";
import { useTranslation } from "@/hooks/useTranslation";
import { useSession } from "next-auth/react";

interface ContentLayoutProps {
  title: string;
  children: React.ReactNode;
  type?: string;
}

export function ContentLayout({ title, type, children }: ContentLayoutProps) {
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
    <div className="flex flex-col h-screen">
      <div className="flex-shrink-0 px-2 sm:px-1 md:px-6 lg:px-8 mt-safe-top sm:mt-2 lg:mt-5">
        <Navbar />
      </div>
      <ScrollArea
        className="flex-1 px-2 sm:px-4 md:px-6 lg:px-8 mt-2 lg:mt-7 overscroll-contain"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <div 
          className="py-2 sm:py-3 lg:pt-2" 
          style={{ 
            paddingBottom: `calc(env(safe-area-inset-bottom, 0px) + 120px)` 
          }}
        >
          {children}
        </div>
      </ScrollArea>

      {/* Mobile navbar controls - render bên trong ScrollArea để tránh hydration issues */}
      <NavbarMobile
        t={t as (key: string) => string}
        onChangeTheme={handleChangeTheme}
        onLogout={handleLogout}
        userId={session?.user?.userId}
      />
    </div>
  );
}
