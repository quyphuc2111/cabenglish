"use client";

import { cn } from "@/lib/utils";
import { useStore } from "@/hooks/use-store";
import { Sidebar } from "@/components/admin-panel/sidebar";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import { ToastContainer } from 'react-toastify';
import { useQuery } from "@tanstack/react-query";
import { getNotificationListByUserId } from "@/actions/notificationAction";
import { useSession } from "next-auth/react";
import { useUserInfo } from "@/hooks/useUserInfo";

export default function ClientPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const { data: userInfo } = useUserInfo(session?.user?.userId);
  const currentTheme = (userInfo?.theme ?? "theme-red") as keyof typeof themeClasses;
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
      <main
        className={cn(
          `min-h-screen transition-[margin-left] ease-in-out duration-300 
           flex-1 h-screen ${themeSecondaryClasses[currentTheme]} lg:rounded-l-[48px] px-2  2xl:px-0 py-2 md:py-0
           overflow-y-hidden `,
          sidebar?.isOpen === false ? "lg:ml-[100px]" : "lg:ml-72"
        )}
      >
        {children}
      </main>
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
         containerId="client-toast-container"
       />
    </div>
  );
}
