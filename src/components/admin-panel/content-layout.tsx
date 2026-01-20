import { Navbar } from "@/components/admin-panel/navbar";
import { ScrollArea } from "../ui/scroll-area";

interface ContentLayoutProps {
  title: string;
  children: React.ReactNode;
  type?: string;
}

export function ContentLayout({ title, type,  children }: ContentLayoutProps) {
  return (
    <>
      <ScrollArea className="h-full xl:p-[20px] ">
        {/* <Navbar title={title} type={type}  /> */}
        <div className="lg:pt-2 lg:pb-12 md:px-4 px-0">{children}</div>
      </ScrollArea>
    </>
  );
}
