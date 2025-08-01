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
    <>
      <div className="px-2 sm:px-4 md:px-6 lg:px-8 mt-safe-top md:mt-5">
        <Navbar title={title} type={type} />
      </div>
      <ScrollArea 
        className="h-[calc(100vh-150px-env(safe-area-inset-top)-env(safe-area-inset-bottom))] sm:h-[calc(100vh-170px-env(safe-area-inset-top)-env(safe-area-inset-bottom))] md:h-[calc(100vh-170px-env(safe-area-inset-top)-env(safe-area-inset-bottom))] px-2 sm:px-4 md:px-6 lg:px-8 mt-2 md:mt-7 pb-safe-bottom overscroll-contain"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div className="py-2 sm:py-3 lg:pt-2 lg:pb-12 px-safe-left pr-safe-right">{children}</div>
      </ScrollArea>
    </>
  );
}
