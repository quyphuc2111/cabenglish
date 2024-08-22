import { Navbar } from "@/components/admin-panel/navbar";
import { ScrollArea } from "../ui/scroll-area";

interface ContentLayoutProps {
  title: string;
  children: React.ReactNode;
  type: string;
}

export function ContentLayout({ title, type,  children }: ContentLayoutProps) {
  return (
    <>
      <ScrollArea className="h-full ">
        <Navbar title={title} type={type}  />
        <div className="pt-8 pb-12 px-4 sm:px-8">{children}</div>
      </ScrollArea>
    </>
  );
}
