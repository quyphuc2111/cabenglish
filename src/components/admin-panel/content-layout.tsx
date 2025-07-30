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
      <div className="px-4 sm:px-6 md:px-8 2xl:px-8 mt-5 mt-safe-top">
        <Navbar title={title} type={type} />
      </div>
      <ScrollArea 
        className="h-[calc(100vh-150px-env(safe-area-inset-top)-env(safe-area-inset-bottom))] sm:h-[calc(100vh-170px-env(safe-area-inset-top)-env(safe-area-inset-bottom))] md:h-[calc(100vh-170px-env(safe-area-inset-top)-env(safe-area-inset-bottom))] px-4 sm:px-6 md:px-8 2xl:px-[40px] mt-2 md:mt-7 pb-safe-bottom overscroll-contain"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div className="py-2 sm:py-3 lg:pt-2 lg:pb-12 px-safe-left pr-safe-right">{children}</div>
      </ScrollArea>
    </>
  );
}
