"use client";
import { motion } from "framer-motion";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { TeachingModeSwitcher } from "./TeachingModeSwitcher";
import { LogoutButton } from "./LogoutButton";

interface NavbarControlsProps {
  t: (key: string) => string;
  currentTeachingMode: string | undefined;
  onChangeTheme: () => void;
  onLogout: () => void;
}

export function NavbarControls({
  t,
  currentTeachingMode,
  onChangeTheme,
  onLogout
}: NavbarControlsProps) {
  return (
    <motion.div
      className="grid grid-cols-2 gap-2 sm:gap-3 
        w-full md:w-auto items-center"
      variants={{
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } }
      }}
    >
      <LanguageSwitcher t={t} />
      <ThemeSwitcher onChangeTheme={onChangeTheme} t={t} />
      <TeachingModeSwitcher
        currentTeachingMode={currentTeachingMode}
        t={t}
        onClick={() => {
          window.location.href = "/che-do-giang-day";
        }}
      />
      <LogoutButton onLogout={onLogout} />
    </motion.div>
  );
}
