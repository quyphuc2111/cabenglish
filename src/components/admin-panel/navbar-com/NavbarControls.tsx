"use client";
import { motion, AnimatePresence } from "framer-motion";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { TeachingModeSwitcher } from "./TeachingModeSwitcher";
import { LogoutButton } from "./LogoutButton";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";
import { useState } from "react";
import { Menu, Home, Settings, LogOut, Globe, Palette } from "lucide-react";

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
  const [isOpen, setIsOpen] = useState(false);

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

  const menuItems = [
    {
      icon: Home,
      label: t("homepage"),
      onClick: () => router.push("/"),
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      icon: Globe,
      label: t("language"), 
      component: (
        <LanguageSwitcher 
          t={t} 
          initialLanguage={session?.user.language}
          userId={session?.user.userId}
          updateUserInfo={updateUserInfo}
        />
      )
    },
    {
      icon: Palette,
      label: t("changeTheme"),
      component: <ThemeSwitcher onChangeTheme={onChangeTheme} t={t} />
    },
    {
      icon: Settings,
      label: t("teachingMode"),
      component: (
        <TeachingModeSwitcher
          currentTeachingMode={currentTeachingMode}
          t={t}
          onClick={() => router.push("/che-do-giang-day")}
        />
      )
    },
    {
      icon: LogOut,
      label: t("logout"),
      component: <LogoutButton onLogout={onLogout} t={t} />
    }
  ];

  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden md:block relative">
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
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${themeSecondaryClasses[currentTheme]} rounded-full p-2`}>
          <Button
            className="bg-blue-500 text-white rounded-full shadow-lg z-10 hover:bg-blue-600"
            onClick={() => {
              router.push("/");
            }}
          >
            {t("homepage")}
          </Button>
        </div>
      </div>

      {/* Mobile Floating Menu */}
      <div className="md:hidden">
        {/* Backdrop overlay */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Floating Action Button */}
          <div className="fixed bottom-6 right-6 z-50">
            {/* Menu Items Container */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  className="absolute bottom-16 right-0 flex flex-col-reverse gap-3 min-w-max"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  {menuItems.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{
                        delay: index * 0.05,
                        duration: 0.2,
                        ease: "easeOut"
                      }}
                      className="flex items-center gap-3"
                    >
                      {/* Label */}
                      <div className="bg-white text-gray-800 px-3 py-2 rounded-lg text-sm font-medium shadow-lg border border-gray-200">
                        {item.label}
                      </div>
                      
                      {/* Button */}
                      {item.component ? (
                        <div className="w-fit h-12 rounded-lg bg-white shadow-lg border border-gray-200 flex items-center justify-center">
                          <div className="scale-90">
                            {item.component}
                          </div>
                        </div>
                      ) : (
                        <button
                          className={`w-12 h-12 rounded-lg ${item.color || 'bg-gray-600'} text-white shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow duration-200`}
                          onClick={() => {
                            item.onClick?.();
                            setIsOpen(false);
                          }}
                        >
                          <item.icon size={18} />
                        </button>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
 
            {/* Main FAB */}
            <motion.button
              className={`w-14 h-14 rounded-lg ${themeClasses[currentTheme]} text-white shadow-lg flex items-center justify-center`}
              onClick={() => setIsOpen(!isOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                rotate: isOpen ? 45 : 0
              }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <Menu size={20} />
            </motion.button>
          </div>
      </div>
    </>
  );
}
