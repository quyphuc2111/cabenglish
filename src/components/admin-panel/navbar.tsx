"use client";
import { SheetMenu } from "@/components/admin-panel/sheet-menu";
import { useModal } from "@/hooks/useModalStore";
import { useLogout } from "@/hooks/useLogout";
import { useTranslation } from "@/hooks/useTranslation";
import { NavbarControls } from "./navbar-com/NavbarControls";
import { LogoDecorations } from "./navbar-com/LogoDecorations";
import { useSession } from "next-auth/react";
import { useUserInfo } from "@/hooks/useUserInfo";

export function Navbar() {
  const { t } = useTranslation("", "common");
  const { data: session } = useSession();
  const { data: userInfo } = useUserInfo(session?.user?.userId);
  const currentTheme = userInfo?.theme ?? "theme-red";
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
        />
      </div>
    </header>
  );
}
