"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  SettingsIcon,
  Home,
  Settings,
  LogOut,
  Globe,
  Palette
} from "lucide-react";
import { useUserInfo } from "@/hooks/useUserInfo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { TeachingModeSwitcher } from "./TeachingModeSwitcher";
import { LogoutButton } from "./LogoutButton";
import { useOrientation } from "@/hooks/useOrientation";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface NavbarMobileProps {
  t: (key: string) => string;
  onChangeTheme: () => void;
  onLogout: () => void;
  userId?: string;
}

export function NavbarMobile({
  t,
  onChangeTheme,
  onLogout,
  userId
}: NavbarMobileProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<string>("theme-red");
  const [isMounted, setIsMounted] = useState(false);
  const isLandscapeMode = useOrientation();
  const isMobile = useMediaQuery("(max-width: 1023px)");
  
  // Check if in landscape mode on mobile device
  const isLandscapeMobile = isLandscapeMode === "landscape" && isMobile;

  const themeClasses = {
    "theme-gold": "bg-theme-gold-primary",
    "theme-blue": "bg-theme-blue-primary",
    "theme-pink": "bg-theme-pink-primary",
    "theme-red": "bg-theme-red-primary"
  } as const;

  const { data: userInfo } = useUserInfo(userId);
  const router = useRouter();

  // Mount component và update theme
  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== "undefined") {
      const dataTheme = document.body.getAttribute("data-theme");
      const theme = dataTheme || userInfo?.theme || "theme-red";
      setCurrentTheme(theme);
    }
  }, [userInfo?.theme]);

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
        <LanguageSwitcher t={t} userId={userId} showText={true} />
      )
    },
    {
      icon: Palette,
      label: t("changeTheme"),
      component: (
        <ThemeSwitcher
          onChangeTheme={onChangeTheme}
          t={t}
          userId={userId}
        />
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
    }
  ];

  const logoutItem = {
    icon: LogOut,
    label: t("logout"),
    component: (
      <LogoutButton onLogout={onLogout} t={t} />
    )
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div
      className="navbar-controls-mobile-wrapper fixed bottom-0 right-0 z-50 xl:hidden"
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
        className="fixed z-50"
        style={{ 
          pointerEvents: "auto",
          bottom: "calc(0.75rem + env(safe-area-inset-bottom, 0px))",
          right: "calc(0.75rem + env(safe-area-inset-right, 0px))"
        }}
      >
        {isOpen && (
          <div 
            className={
              isLandscapeMobile
                ? "absolute flex flex-col gap-1 min-w-max overflow-y-auto overscroll-contain" 
                : "absolute flex flex-col gap-3 sm:gap-4 min-w-max overflow-y-auto overscroll-contain" 
            }
            style={
              isLandscapeMobile
                ? {
                    bottom: 0,
                    right: "calc(100% + 1rem)",
                    maxWidth: "calc(100vw - 2rem - env(safe-area-inset-left, 0px) - env(safe-area-inset-right, 0px))",
                    maxHeight: "calc(100vh - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px) - 2rem)",
                    paddingBottom: "0.5rem"
                  }
                : {
                    bottom: "calc(5rem + env(safe-area-inset-bottom, 0px))",
                    right: 0,
                    maxWidth: "calc(100vw - 2rem - env(safe-area-inset-right, 0px))",
                    maxHeight: "calc(100vh - 7rem - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px))",
                    paddingTop: "0.5rem",
                    paddingBottom: "0.5rem"
                  }
            }
          >
            {menuItems.map((item, index) => (
              <div key={index} className="flex items-center gap-3 sm:gap-4">
                <div className="flex items-center h-11 sm:h-12 bg-white text-gray-800 px-3 sm:px-4 py-2 rounded-xl text-sm sm:text-base font-semibold shadow-lg border border-gray-200 w-1/2  sm:max-w-none">
                  <span className="whitespace-nowrap overflow-hidden text-ellipsis block">
                    {item.label}
                  </span>
                </div>

                {item.component ? (
                  <div className="w-fit min-w-[220px] sm:min-w-1/2 h-14 sm:h-16 rounded-xl flex items-center justify-center overflow-hidden">
                    <div className="scale-90 sm:scale-100 w-full">
                      {item.component}
                    </div>
                  </div>
                ) : (
                  <div className="w-fit min-w-[220px] sm:min-w-[260px] h-[46px] sm:h-[46px] rounded-xl overflow-hidden">
                    <button
                      className={`w-full h-full px-4 sm:px-6 rounded-xl ${
                        item.color || "bg-gray-600"
                      } text-white shadow-lg flex items-center justify-center gap-2 sm:gap-3 hover:shadow-xl transition-all duration-200 hover:scale-105`}
                      onClick={() => {
                        item.onClick?.();
                        setIsOpen(false);
                      }}
                    >
                      <item.icon size={26} className="sm:w-8 sm:h-8 flex-shrink-0" />
                      <span className="font-semibold text-sm sm:text-base whitespace-nowrap">
                        {item.label}
                      </span>
                    </button>
                  </div>
                )}
              </div>
            ))}
            
            {/* Logout item - separated with border */}
            <div className="border-t-2 border-gray-200 pt-3 sm:pt-4 mt-1">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="h-11 sm:h-12 bg-gradient-to-r from-red-50 to-red-100 text-red-700 px-3 sm:px-4 py-2 rounded-xl text-sm sm:text-base font-bold shadow-lg border-2 border-red-200 w-1/2 sm:max-w-none">
                  <span className="whitespace-nowrap overflow-hidden text-ellipsis block">
                    {logoutItem.label}
                  </span>
                </div>

                <div className="w-fit min-w-[220px] sm:min-w-[260px] h-14 sm:h-16 rounded-xl flex items-center justify-center overflow-hidden">
                  <div className="scale-90 sm:scale-100 w-full">
                    {logoutItem.component}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <button
          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full ${
            themeClasses[currentTheme as keyof typeof themeClasses]
          } text-white shadow-xl flex items-center justify-center hover:shadow-2xl transition-all duration-200 hover:scale-105 active:scale-95`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <SettingsIcon size={26} className="sm:w-8 sm:h-8" />
        </button>
      </div>
    </div>
  );
}

