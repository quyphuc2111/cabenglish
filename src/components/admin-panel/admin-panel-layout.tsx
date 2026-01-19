"use client";

import { cn } from "@/lib/utils";
import { useStore } from "@/hooks/use-store";
import { Footer } from "@/components/admin-panel/footer";
import { Sidebar } from "@/components/admin-panel/sidebar";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";

export default function AdminPanelLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const sidebar = useStore(useSidebarToggle, (state) => state);

  if (!sidebar) return null;

  return (
    <div className="lg:bg-[#BD5353]">
      <Sidebar />
      {/* p-3 xl:p-[40px] 2xl:p-[60px] */}
      <main
        className={cn(
          "min-h-screen transition-[margin-left] ease-in-out duration-300 flex-1 h-screen bg-[#f5fcff] lg:rounded-l-[48px] overflow-y-hidden",
          sidebar?.isOpen === false ? "lg:ml-[100px]" : "lg:ml-[426px]"
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
    </div>
  );
}
