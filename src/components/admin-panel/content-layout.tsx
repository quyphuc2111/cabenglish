"use client";

import { Navbar } from "@/components/admin-panel/navbar";
import { ScrollArea } from "../ui/scroll-area";

interface ContentLayoutProps {
  title: string;
  children: React.ReactNode;
  type?: string;
}

export function ContentLayout({ title, type, children }: ContentLayoutProps) {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-shrink-0 px-2 sm:px-1 md:px-6 lg:px-8 mt-safe-top sm:mt-2 lg:mt-5">
        <Navbar />
      </div>
      <ScrollArea
        className="flex-1 px-2 sm:px-4 md:px-6 lg:px-8 mt-2 lg:mt-7 overscroll-contain"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <div 
          className="py-2 sm:py-3 lg:pt-2" 
          style={{ 
            paddingBottom: `calc(env(safe-area-inset-bottom, 0px) + 120px)` 
          }}
        >
          {children}
        </div>
      </ScrollArea>
    </div>
  );
}
