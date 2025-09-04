"use client";

import { cn } from "@/lib/utils";
import { useStore } from "@/hooks/use-store";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import { ToastContainer } from "react-toastify";
import { AdminSidebar } from "./admin-sidebar";
import { MobileAdminMenu } from "./mobile-admin-menu";
import AdminModalProvider from "@/providers/admin-modal-provider";
import { useSession } from "next-auth/react";
import { useEffect } from "react";


export default function AdminPanelLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const sidebar = useStore(useSidebarToggle, (state) => state);
//Cái này thêm vào để sử dụng toast ở admin hehe
  useEffect(() => {
    document.body.classList.remove("performance-mode");

    return () => {
      document.body.classList.add("performance-mode");
    };
  }, []);

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
    <div className={themeClasses["theme-red"]}>
      <AdminSidebar />
      <MobileAdminMenu />

      <main
        className={cn(
          `min-h-screen transition-[margin-left] ease-in-out duration-300 px-3
           flex-1 h-full ${themeSecondaryClasses["theme-red"]} lg:rounded-l-[48px]
           overflow-y-hidden `,
          sidebar?.isOpen === false
            ? "ml-0 lg:ml-[100px] pl-5"
            : "ml-0 lg:ml-72"
        )}
      >
        {children}
      </main>
      {/* <ModalProvider /> */}
      <AdminModalProvider />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        limit={3}
        containerId="admin-toast-container"
      />
    </div>
  );
}
