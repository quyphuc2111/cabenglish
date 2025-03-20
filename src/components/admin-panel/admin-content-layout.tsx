"use client"

import Navbar from "../admin/navbar";
import { ScrollArea } from "../ui/scroll-area";
interface AdminContentLayoutProps {
  children: React.ReactNode;
  breadcrumb: {
    title: string;
    link: string;
  }[];
}

export function AdminContentLayout({ breadcrumb, children }: AdminContentLayoutProps) {
  
  return (
    <>
      <div className="2xl:px-8 mt-5 ">
        {
          breadcrumb?.length > 0 && (
            <Navbar breadcrumb={breadcrumb} />
          )
        }
      </div>
      <ScrollArea className="h-5/6 2xl:px-8 mt-5 ">
        <div className="lg:pt-2 lg:pb-12">{children}</div>
      </ScrollArea>
    </>
  );
}
