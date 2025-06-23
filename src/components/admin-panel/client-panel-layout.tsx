"use client";

import { cn } from "@/lib/utils";
import { useStore } from "@/hooks/use-store";
import { Sidebar } from "@/components/admin-panel/sidebar";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import Image from "next/image";
import { ModalProvider } from "@/providers/modal-provider";
import { useUserTheme } from "@/store/useUserStore";
import { ToastContainer } from 'react-toastify';
import { useQuery } from "@tanstack/react-query";
import { getNotificationListByUserId } from "@/actions/notificationAction";
import { useSession } from "next-auth/react";

export default function ClientPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const currentTheme = (session?.user.theme ?? "theme-red") as keyof typeof themeClasses;
  const sidebar = useStore(useSidebarToggle, (state) => state);

  const { data: notificationList = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const response = await getNotificationListByUserId({
        userId: session?.user?.userId as string
      });
      return response.data || [];
    },
    enabled: !!session?.user?.userId
  });

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

  if (!sidebar) return null;

  return (
    <div className={themeClasses[currentTheme]}>
      <Sidebar notificationList={notificationList} />
      {/* p-3 xl:p-[40px] 2xl:p-[60px] */}
      <main
        className={cn(
          `min-h-screen transition-[margin-left] ease-in-out duration-300 
           flex-1 h-screen ${themeSecondaryClasses[currentTheme]} lg:rounded-l-[48px] 
           overflow-y-hidden `,
          sidebar?.isOpen === false ? "lg:ml-[100px]" : "lg:ml-72"
        )}
      >
        {children}
      </main>
       {/* <ModalProvider /> */}
       <ToastContainer />
    </div>
  );
}
