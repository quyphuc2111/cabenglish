"use client";

import { cn } from "@/lib/utils";
import { useStore } from "@/hooks/use-store";
import { Footer } from "@/components/admin-panel/footer";
import { Sidebar } from "@/components/admin-panel/sidebar";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import Image from "next/image";
import { ModalProvider } from "@/providers/modal-provider";
import { useThemeStore } from "@/store/useThemeStore";
import { ToastContainer } from 'react-toastify';

export default function AdminPanelLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const { currentTheme } = useThemeStore();
  const sidebar = useStore(useSidebarToggle, (state) => state);

  const themeClasses = {
    'theme-gold': 'bg-theme-gold-primary',
    'theme-blue': 'bg-theme-blue-primary',
    'theme-pink': 'bg-theme-pink-primary',
    'theme-red': 'bg-theme-red-primary'
  };

  const themeSecondaryClasses = {
    'theme-gold': 'bg-theme-gold-secondary',
    'theme-blue': 'bg-theme-blue-secondary',
    'theme-pink': 'bg-theme-pink-secondary',
    'theme-red': 'bg-theme-red-secondary'
  };

  if (!sidebar) return null;

  return (
    <div className={themeClasses[currentTheme]}>
       {/* <Image 
    src="/menu_icon/pattern.png"
    alt="Background pattern"
    layout="fill"
    objectFit="cover"
    className="opacity-50 z-50"
  /> */}
      <Sidebar />
      {/* p-3 xl:p-[40px] 2xl:p-[60px] */}
      <main
        className={cn(
          `min-h-screen transition-[margin-left] ease-in-out duration-300 
           flex-1 h-screen ${themeSecondaryClasses[currentTheme]} lg:rounded-l-[48px] 
           overflow-y-hidden`,
          sidebar?.isOpen === false ? "lg:ml-[100px]" : "lg:ml-72"
        )}
      >
        {children}
      </main>
      {/* <footer
        className={cn(
          "transition-[margin-left] ease-in-out duration-300",
          sidebar?.isOpen === false ? "lg:ml-[90px]" : "lg:ml-72"
        )}
      >
        <Footer />
      </footer> */}
       <ModalProvider />
       <ToastContainer />
    </div>
  );
}
