import Link from "next/link";
import { MenuIcon, PanelsTopLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Menu } from "@/components/admin-panel/menu";
import {
  Sheet,
  SheetHeader,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export function SheetMenu() {
  return (
    <Sheet>
      <SheetTrigger className="lg:hidden" asChild>
        <Button className="h-8" variant="outline" size="icon">
          <MenuIcon size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:w-[75vw] sm:max-w-[75vw] px-3 h-full flex flex-col" side="left">
        <SheetHeader className="mb-2 flex-shrink-0">
          <div className="flex justify-center items-center w-full">
            <Link href="/" className="no-underline">
              <div className="flex flex-row items-center">
                <div className={cn(
                  "font-bold text-2xl relative tracking-wide",
                  "bg-gradient-to-r from-pink-500 via-blue-500 to-purple-600",
                  "text-transparent bg-clip-text",
                  "animate-text-shine transition-all duration-300"
                )}>
                  SMART
                </div>
                <div className={cn(
                  "font-bold text-2xl ml-1",
                  "bg-gradient-to-br from-amber-500 to-pink-500 text-transparent bg-clip-text"
                )}>
                  KID
                </div>
               
              </div>
            </Link>
          </div>
        </SheetHeader>
        <div className="flex-1 min-h-0 overflow-hidden">
          <Menu isOpen />
        </div>
      </SheetContent>
    </Sheet>
  );
}

export const animationStyles = `
  @keyframes textShine {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
  
  .animate-text-shine {
    background-size: 200% auto;
    animation: textShine 3s ease-in-out infinite;
  }
`;
