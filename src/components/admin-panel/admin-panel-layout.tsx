"use client";

import { cn } from "@/lib/utils";
import { useStore } from "@/hooks/use-store";
import { Footer } from "@/components/admin-panel/footer";
import { Sidebar } from "@/components/admin-panel/sidebar";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import Image from "next/image";
import { ModalProvider } from "@/providers/modal-provider";
import { useUserTheme } from "@/store/useUserStore";
import { ToastContainer } from "react-toastify";
import { AdminSidebar } from "./admin-sidebar";
import AdminModalProvider from "@/providers/admin-modal-provider";
import Navbar from "../admin/navbar";
import { useSession } from "next-auth/react";

export default function AdminPanelLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = useSession();
  const currentTheme = session.data?.user.theme;
  const sidebar = useStore(useSidebarToggle, (state) => state);

  
  console.log("currentThemecurrentTheme", currentTheme);
  console.log("sessionsession", session);

  const themeClasses = {
    "theme-gold": "bg-theme-gold-primary",
    "theme-blue": "bg-theme-blue-primary",
    "theme-pink": "bg-theme-pink-primary",
    "theme-red": "bg-theme-red-primary"
  };

  const themeSecondaryClasses = {
    "theme-gold": "bg-theme-gold-secondary",
    "theme-blue": "bg-theme-blue-secondary",
    "theme-pink": "bg-theme-pink-secondary",
    "theme-red": "bg-theme-red-secondary"
  };

  if (!sidebar) return null;


  return (
    <div className={themeClasses[currentTheme ?? "theme-red"]}>
      <AdminSidebar />
      {/* p-3 xl:p-[40px] 2xl:p-[60px] */}
      <main
        className={cn(
          `min-h-screen transition-[margin-left] ease-in-out duration-300 
           flex-1 h-full ${themeSecondaryClasses[currentTheme]} lg:rounded-l-[48px] 
           overflow-y-hidden `,
          sidebar?.isOpen === false ? "lg:ml-[100px]" : "lg:ml-72"
        )}
      >
        {children}
      </main>
      {/* <ModalProvider /> */}
      <AdminModalProvider />
      <ToastContainer />
    </div>
  );
}
