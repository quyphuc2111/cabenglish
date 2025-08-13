"use client";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { TeachingModeSwitcher } from "./TeachingModeSwitcher";
import { LogoutButton } from "./LogoutButton";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  SettingsIcon,
  Home,
  Settings,
  LogOut,
  Globe,
  Palette
} from "lucide-react";
import { useUserInfo } from "@/hooks/useUserInfo";

interface NavbarControlsProps {
  t: (key: string) => string;
  onChangeTheme: () => void;
  onLogout: () => void;
  userId?: string;
}

export function NavbarControls({
  t,
  onChangeTheme,
  onLogout,
  userId
}: NavbarControlsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const themeClasses = {
    "theme-gold": "bg-theme-gold-primary",
    "theme-blue": "bg-theme-blue-primary",
    "theme-pink": "bg-theme-pink-primary",
    "theme-red": "bg-theme-red-primary"
  } as const;

  const { data: userInfo } = useUserInfo(userId);
  const currentTheme = (userInfo?.theme ??
    "theme-red") as keyof typeof themeClasses;
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
      component: <LanguageSwitcher t={t} userId={userId} />
    },
    {
      icon: Palette,
      label: t("changeTheme"),
      component: (
        <ThemeSwitcher onChangeTheme={onChangeTheme} t={t} userId={userId} />
      )
    },
    {
      icon: Settings,
      label: t("teachingMode"),
      component: (
        <TeachingModeSwitcher
          t={t}
          userId={userId}
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
      <div className="hidden xl:block relative">
        <div className="grid grid-cols-3 gap-4 xl:gap-6 w-full md:w-auto items-center">
          <Button
            className="bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 flex items-center gap-2"
            onClick={() => router.push("/")}
          >
            <Home size={16} />
            {t("homepage")}
          </Button>
          <LanguageSwitcher t={t} userId={userId} />
          <ThemeSwitcher onChangeTheme={onChangeTheme} t={t} userId={userId} />
          <TeachingModeSwitcher
            t={t}
            userId={userId}
            onClick={() => {
              router.push("/che-do-giang-day");
            }}
          />
          <LogoutButton onLogout={onLogout} t={t} />
        </div>
      </div>

      <div
        className="fixed bottom-0 right-0 z-50 xl:hidden"
        style={{ pointerEvents: "none" }}
      >
        {isOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
            style={{ pointerEvents: "auto" }}
          />
        )}

        <div
          className="fixed bottom-3 right-3 z-50"
          style={{ pointerEvents: "auto" }}
        >
          {isOpen && (
            <div className="absolute bottom-16 right-0 flex flex-col-reverse gap-2 sm:gap-3 min-w-max max-w-[calc(100vw-2rem)]">
              {menuItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 sm:gap-3"
                >
                  <div className="bg-white text-gray-800 px-2 py-2 rounded-lg text-xs sm:text-sm font-medium shadow-lg border border-gray-200 max-w-[120px] sm:max-w-none">
                    <span className="whitespace-nowrap overflow-hidden text-ellipsis block">
                      {item.label}
                    </span>
                  </div>

                  {item.component ? (
                    <div className="w-fit min-w-[200px] sm:min-w-[240px] h-12 rounded-lg bg-white shadow-lg border border-gray-200 flex items-center justify-center overflow-hidden">
                      <div className="scale-75 sm:scale-90 w-full">
                        {item.component}
                      </div>
                    </div>
                  ) : (
                    <button
                      className={`w-12 h-12 rounded-lg ${
                        item.color || "bg-gray-600"
                      } text-white shadow-lg flex items-center justify-center hover:shadow-xl`}
                      onClick={() => {
                        item.onClick?.();
                        setIsOpen(false);
                      }}
                    >
                      <item.icon size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          <button
            className={`w-12 h-12 rounded-full ${themeClasses[currentTheme]} text-white shadow-lg flex items-center justify-center`}
            onClick={() => setIsOpen(!isOpen)}
          >
            <SettingsIcon size={20} />
          </button>
        </div>
      </div>
    </>
  );
}
