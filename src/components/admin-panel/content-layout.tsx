import { Navbar } from "@/components/admin-panel/navbar";
import { ScrollArea } from "../ui/scroll-area";

interface ContentLayoutProps {
  title: string;
  children: React.ReactNode;
}

export function ContentLayout({ title, children }: ContentLayoutProps) {
  return (
    <>
      <ScrollArea className="h-screen">
        <Navbar title={title} />
        <div className="pt-8 pb-8 px-4 sm:px-8">{children}</div>
      </ScrollArea>
    </>
  );
}
