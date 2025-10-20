"use client";

import { cn } from "@/lib/utils";
import { useStore } from "@/hooks/use-store";
import { Sidebar } from "@/components/admin-panel/sidebar";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import { ToastContainer } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { getNotificationListByUserId } from "@/actions/notificationAction";
import { useSession } from "next-auth/react";
import { memo } from "react";
import { UserProvider, useUser } from "@/contexts/UserContext";
import { SimplePerformanceProvider } from "@/providers/SimplePerformanceProvider";

const ClientPanelLayoutContent = memo(function ClientPanelLayoutContent({
  children
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const { userInfo } = useUser(); 
  
  // ✅ Ưu tiên theme từ data-theme attribute (đã set từ server), sau đó mới đến userInfo
  const dataTheme = typeof document !== 'undefined' 
    ? document.body.getAttribute('data-theme') 
    : null;
  const currentTheme = (dataTheme || userInfo?.theme || session?.user?.theme ||
    "theme-red") as keyof typeof themeClasses;
  const sidebar = useStore(useSidebarToggle, (state) => state);

  const { data: notificationList = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const response = await getNotificationListByUserId({
        userId: session?.user?.userId as string
      });
      return response.data || [];
    },
    enabled: !!session?.user?.userId,
    staleTime: 5 * 60 * 1000, // 5 phút cache
    gcTime: 10 * 60 * 1000, // 10 phút garbage collection
    refetchOnWindowFocus: false, // Tắt refetch khi focus
    refetchOnMount: false, // Tắt refetch khi mount
    refetchOnReconnect: true // Chỉ refetch khi reconnect
  });

  const themeClasses = {
    "theme-gold": "bg-theme-gold-primary",
    "theme-blue": "bg-theme-blue-primary",
    "theme-pink": "bg-theme-pink-primary",
    "theme-red": "bg-theme-red-primary"
  } as const;

  const themeSecondaryClasses = {
    "theme-gold": "bg-theme-gold-secondary",
    "theme-blue": "bg-theme-blue-secondary",
    "theme-pink": "bg-theme-pink-secondary",
    "theme-red": "bg-theme-red-secondary"
  } as const;

  if (!sidebar) return null;

  return (
    <div className={cn(themeClasses[currentTheme], "overflow-hidden flex")}>
      <Sidebar notificationList={notificationList} />
      <main
        className={cn(
          `min-h-screen flex-1 h-screen ${themeSecondaryClasses[currentTheme]} lg:rounded-l-[48px] px-2  2xl:px-0 py-2 md:py-0
           overflow-y-hidden `,
          // sidebar?.isOpen === false ? "lg:ml-[100px]" : "lg:ml-72"
           sidebar?.isOpen === false ? "" : ""
        )}
      >
        {children}
      </main>
    </div>
  );
});

// Wrapper component với UserProvider
const ClientPanelLayout = memo(function ClientPanelLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();

  return (
    <SimplePerformanceProvider>
      <UserProvider userId={session?.user?.userId}>
        <ClientPanelLayoutContent>{children}</ClientPanelLayoutContent>
      </UserProvider>
    </SimplePerformanceProvider>
  );
});

export default ClientPanelLayout;
