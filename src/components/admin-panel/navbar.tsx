import { ModeToggle } from "@/components/mode-toggle";
import { UserNav } from "@/components/admin-panel/user-nav";
import { SheetMenu } from "@/components/admin-panel/sheet-menu";
import { Button } from "../ui/button";

interface NavbarProps {
  title: string;
}

export function Navbar({ title }: NavbarProps) {
  return (
    <header className="sticky top-0 z-10 w-full backdrop-blur supports-[backdrop-filter]:bg-background/60 ">
      <div className="mx-4 sm:mx-8 flex h-14 items-center">
        {title != "GiftShop" && (
          <div className="flex items-center space-x-4 lg:space-x-0">
            <SheetMenu />
            <h2 className="text-2xl font-semibold">Lớp 5C187</h2>
            <Button className="btn-orange-head">Kết quả</Button>
            <Button className="btn-orange-head ">Vinh danh</Button>
          </div>
        )}
        <div className="flex flex-1 items-center space-x-2 justify-end">
          {/* <ModeToggle /> */}
          {/* <UserNav /> */}
          <Button>Kết quả</Button>
          <Button>Trang chủ</Button>
        </div>
      </div>
    </header>
  );
}
