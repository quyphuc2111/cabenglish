import { ChevronLeft } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarToggleProps {
  isOpen: boolean | undefined;
  setIsOpen?: () => void;
}

export function SidebarToggle({ isOpen, setIsOpen }: SidebarToggleProps) {
  return (
    <div className={`invisible transition-all lg:visible absolute top-[40px]  z-20 text-black ${isOpen ? "right-0" : "-right-11"}`}>
      <Button
        onClick={() => setIsOpen?.()}
        className={` w-11 h-14 ${isOpen ? "rounded-s-xl" : "rounded-e-xl"}`}
        variant="outline"
        size="icon"
      >
        <ChevronLeft
          className={cn(
            "h-4 w-4 transition-transform ease-in-out duration-700",
            isOpen === false ? "rotate-180" : "rotate-0"
          )}
        />
      </Button>
    </div>
  );
}
