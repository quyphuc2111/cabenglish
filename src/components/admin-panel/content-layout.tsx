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
      <div className="2xl:px-10 mt-5 ">
        <Navbar title={title} type={type} />
      </div>
      <ScrollArea className="h-5/6 2xl:px-[40px] mt-7 ">
        <div className="lg:pt-2 lg:pb-12">{children}</div>
      </ScrollArea>
    </>
  );
}
