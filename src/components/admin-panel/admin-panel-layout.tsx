"use client";

import { cn } from "@/lib/utils";
import { useStore } from "@/hooks/use-store";
import { Footer } from "@/components/admin-panel/footer";
import { Sidebar } from "@/components/admin-panel/sidebar";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import Image from "next/image";

export default function AdminPanelLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const sidebar = useStore(useSidebarToggle, (state) => state);

  if (!sidebar) return null;

  return (
    <div className="bg-[#c35690]">
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
          "min-h-screen dark:bg-zinc-900 transition-[margin-left] ease-in-out duration-300 flex-1 h-screen bg-[#f5fcff] lg:rounded-l-[48px] overflow-y-hidden",
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
    </div>
  );
}
