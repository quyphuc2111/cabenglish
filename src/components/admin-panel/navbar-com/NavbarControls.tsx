"use client";
import { motion } from "framer-motion";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { TeachingModeSwitcher } from "./TeachingModeSwitcher";
import { LogoutButton } from "./LogoutButton";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";

interface NavbarControlsProps {
  t: (key: string) => string;
  currentTeachingMode: string | undefined;
  onChangeTheme: () => void;
  onLogout: () => void;
  updateUserInfo?: ({language}: {language: string}) => Promise<any>;
}

export function NavbarControls({
  t,
  currentTeachingMode,
  onChangeTheme,
  onLogout,
  updateUserInfo
}: NavbarControlsProps) {

  const themeClasses = {
    'theme-gold': 'bg-theme-gold-primary',
    'theme-blue': 'bg-theme-blue-primary',
    'theme-pink': 'bg-theme-pink-primary',
    'theme-red': 'bg-theme-red-primary'
  } as const;

  const themeSecondaryClasses = {
    'theme-gold': 'bg-theme-gold-secondary',
    'theme-blue': 'bg-theme-blue-secondary',
    'theme-pink': 'bg-theme-pink-secondary',
    'theme-red': 'bg-theme-red-secondary'
  } as const;

  

  const { data: session } = useSession();
  const currentTheme = (session?.user.theme ?? "theme-red") as keyof typeof themeClasses;
  const router = useRouter();

  return (
    <div className="relative">
      <motion.div
        className="grid grid-cols-2 gap-6 w-full md:w-auto items-center"
        variants={{
          hidden: { opacity: 0, y: -20 },
          visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } }
        }}
      >
        <LanguageSwitcher 
          t={t} 
          initialLanguage={session?.user.language}
          userId={session?.user.userId}
          updateUserInfo={updateUserInfo}
        />
        <ThemeSwitcher onChangeTheme={onChangeTheme} t={t} />
        <TeachingModeSwitcher
          currentTeachingMode={currentTeachingMode}
          t={t}
          onClick={() => {
            router.push("/che-do-giang-day");
          }}
        />
        <LogoutButton onLogout={onLogout} t={t} />
      </motion.div>
      <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2   ${themeSecondaryClasses[currentTheme]} rounded-full p-2`}>
        <Button
          className=" bg-blue-500 text-white rounded-full shadow-lg z-10  hover:bg-blue-600"
          onClick={() => {
            router.push("/");
          }}
        >
          {t("homepage")}
        </Button>
      </div>
    </div>
  );
}
