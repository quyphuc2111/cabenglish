import { ScrollArea } from "../ui/scroll-area";
import { BreadcrumbNavbar } from "./breadcrumb-navbar";
import { cn } from "@/lib/utils";

interface BreadcrumbLayoutProps {
  title: string;
  children: React.ReactNode;
  type?: string;
}

export function BreadcrumbLayout({ title, type, children }: BreadcrumbLayoutProps) {
  return (
    <>
      <div className="px-3 sm:px-4 md:px-6 2xl:px-8 mt-safe-top sm:mt-5">
        <BreadcrumbNavbar title={title} type={type} />
      </div>
      <ScrollArea 
        className={cn(
          "h-[calc(100vh-150px-env(safe-area-inset-top)-env(safe-area-inset-bottom))]",
          "sm:h-[calc(100vh-170px-env(safe-area-inset-top)-env(safe-area-inset-bottom))]", 
          "md:h-[calc(100vh-170px-env(safe-area-inset-top)-env(safe-area-inset-bottom))]",
          "px-3 sm:px-4 md:px-6 2xl:px-8 mt-2 md:mt-7 pb-safe-bottom",
          "overscroll-contain"
        )}
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div className="py-2 sm:py-3 lg:pt-2 lg:pb-12 px-safe-left pr-safe-right">
          {children}
        </div>
      </ScrollArea>
    </>
  );
}
