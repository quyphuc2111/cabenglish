"use client";
import { SheetMenu } from "@/components/admin-panel/sheet-menu";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { navbarAnimations } from "@/constants/animation-variants";
import { useModal } from "@/hooks/useModalStore";
import { useUserTheme, useUserMode } from "@/store/useUserStore";
import { useTranslation } from "@/hooks/useTranslation";
import { NavbarControls } from "./navbar-com/NavbarControls";
import { LogoDecorations } from "./navbar-com/LogoDecorations";

interface NavbarProps {
  title: string;
  type?: string;
}

export function Navbar({ title, type }: NavbarProps) {
  const { t } = useTranslation("", "common");
  const currentTheme = useUserTheme() ?? "theme-gold";
  const { onOpen } = useModal();
  const router = useRouter();
  const currentTeachingMode = useUserMode() ?? "defaultMode";

  const handleChangeTheme = () => {
    onOpen("changeTheme");
  };

  const handleLogout = () => {
    // TODO: Add logout logic here
    console.log("Logout clicked");
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
