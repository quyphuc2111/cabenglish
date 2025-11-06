"use client";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { TeachingModeSwitcher } from "./TeachingModeSwitcher";
import { LogoutButton } from "./LogoutButton";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Home } from "lucide-react";

interface NavbarControlsProps {
  t: (key: string, options?: any) => string | object;
  onChangeTheme: () => void;
  onLogout: () => void;
  userId?: string;
  showText?: boolean;
}

export function NavbarControls({
  t,
  onChangeTheme,
  onLogout,
  userId,
  showText
}: NavbarControlsProps) {
  const router = useRouter();

  return (
    <>
      <div className="hidden xl:block relative">
        <div className="grid grid-cols-6 gap-4 w-full md:w-auto items-center">
          <Button
            className="col-span-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 flex items-center gap-2 h-10 sm:h-12 md:h-14 xl:h-12"
            onClick={() => router.push("/")}
          >
            <Home size={16} />
            {t("homepage") as string}
          </Button>
          <div className="col-span-2">
            <LanguageSwitcher
              t={t as (key: string) => string}
              userId={userId}
              showText={showText}
            />
          </div>
          <div className="col-span-2">
            <ThemeSwitcher
              onChangeTheme={onChangeTheme}
              t={t as (key: string) => string}
              userId={userId}
            />
          </div>
          <div className="col-span-3">
            <TeachingModeSwitcher
              t={t as (key: string) => string}
              userId={userId}
              onClick={() => {
                router.push("/che-do-giang-day");
              }}
            />
          </div>
          <div className="col-span-3">
            <LogoutButton
              onLogout={onLogout}
              t={t as (key: string) => string}
            />
          </div>
        </div>
      </div>
    </>
  );
}
