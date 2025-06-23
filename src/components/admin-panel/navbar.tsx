"use client";
import { SheetMenu } from "@/components/admin-panel/sheet-menu";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { navbarAnimations } from "@/constants/animation-variants";
import { useModal } from "@/hooks/useModalStore";
import { useUserMode } from "@/store/useUserStore";
import { useTranslation } from "@/hooks/useTranslation";
import { NavbarControls } from "./navbar-com/NavbarControls";
import { LogoDecorations } from "./navbar-com/LogoDecorations";
import { signOut, useSession } from "next-auth/react";
import { logoutAction } from "@/actions/authAction"; 
import axios from "axios";

interface NavbarProps {
  title: string;
  type?: string;
}

export function Navbar({ title, type }: NavbarProps) {
  const { t } = useTranslation("", "common");
  const { data: session } = useSession();
  const currentTheme = session?.user.theme ?? "theme-red";
  const { onOpen } = useModal();
  const router = useRouter();
  const sessionMode = session?.user.mode;
  const currentTeachingMode = sessionMode === "default" ? "defaultMode" : "freeMode";

  const handleChangeTheme = () => {
    onOpen("changeTheme");
  };

  const handleLogout = async () => {
    onOpen("logout");
  };

  return (
    <motion.header
      className="z-10 w-full max-w-[1920px] mx-auto "
      variants={navbarAnimations.container}
      initial="hidden"
      animate="visible"
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 lg:gap-10">
        <SheetMenu />
        <LogoDecorations currentTheme={currentTheme} />
        <NavbarControls
          t={t}
          currentTeachingMode={currentTeachingMode}
          onChangeTheme={handleChangeTheme}
          onLogout={handleLogout}
        />
      </div>
    </motion.header>
  );
}
