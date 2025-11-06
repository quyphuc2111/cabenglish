"use client";
import { SheetMenu } from "@/components/admin-panel/sheet-menu";
import { useModal } from "@/hooks/useModalStore";
import { useLogout } from "@/hooks/useLogout";
import { useTranslation } from "@/hooks/useTranslation";
import { NavbarControls } from "./navbar-com/NavbarControls";
import { LogoDecorations } from "./navbar-com/LogoDecorations";
import { useSession } from "next-auth/react";
import { useUserInfo } from "@/hooks/useUserInfo";
import { useState, useEffect } from "react";

export function Navbar() {
  const { t } = useTranslation("", "common");
  const { data: session } = useSession();
  const { data: userInfo } = useUserInfo(session?.user?.userId);
  const { onOpen } = useModal();
  const { logout } = useLogout();

  // ✅ Khởi tạo theme từ server-side data-theme attribute để tránh hydration mismatch
  const [currentTheme, setCurrentTheme] = useState<string>(() => {
    // Trong quá trình SSR, luôn dùng theme-red mặc định
    if (typeof window === "undefined") {
      return "theme-red";
    }
    // Trong client, đọc từ data-theme attribute (đã được set từ server)
    return document.body.getAttribute("data-theme") || "theme-red";
  });

  // Update theme khi userInfo hoặc session thay đổi
  useEffect(() => {
    if (typeof window !== "undefined") {
      const dataTheme = document.body.getAttribute("data-theme");
      const theme = dataTheme || userInfo?.theme || session?.user?.theme || "theme-red";
      setCurrentTheme(theme);
    }
  }, [userInfo?.theme, session?.user?.theme]);

  const handleChangeTheme = () => {
    onOpen("changeTheme");
  };

  const handleLogout = async () => {
    await logout({
      showToastMessages: true
    });
  };

  return (
    <header className="z-10 w-full max-w-[1920px] mx-auto">
      <div className="flex xl:flex-row xl:align-center xl:items-center justify-between gap-2 sm:gap-4 md:gap-6 lg:gap-10">
        <SheetMenu />
        <div className="flex-1 w-full rounded-xl overflow-hidden h-full">
          <LogoDecorations currentTheme={currentTheme} />
        </div>
        <NavbarControls
          t={t}
          onChangeTheme={handleChangeTheme}
          onLogout={handleLogout}
          userId={session?.user.userId}
          showText={true}
        />
      </div>
    </header>
  );
}
