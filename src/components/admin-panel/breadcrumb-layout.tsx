import { ScrollArea } from "../ui/scroll-area";
import { BreadcrumbNavbar } from "./breadcrumb-navbar";

interface BreadcrumbLayoutProps {
  title: string;
  children: React.ReactNode;
  type?: string;
}

export function BreadcrumbLayout({ title, type, children }: BreadcrumbLayoutProps) {
  return (
    <>
      <div className="2xl:px-6 mt-5 ">
        <BreadcrumbNavbar title={title} type={type} />
      </div>
      <ScrollArea className="h-5/6 2xl:px-[40px] mt-7 ">
        <div className="lg:pt-2 lg:pb-12">{children}</div>
      </ScrollArea>
    </>
  );
}
