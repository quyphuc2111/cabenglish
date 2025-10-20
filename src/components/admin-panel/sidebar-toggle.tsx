import { ChevronLeft } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarToggleProps {
  isOpen: boolean | undefined;
  setIsOpen?: () => void;
}

export function SidebarToggle({ isOpen, setIsOpen }: SidebarToggleProps) {
  return (
    <div className={cn(
      "invisible lg:visible absolute top-24 z-20 text-black transition-[right] duration-200 ease-in-out",
      isOpen ? "right-0" : "-right-11"
    )}>
      <Button
        onClick={() => setIsOpen?.()}
        className={cn(
          "w-11 h-14 transition-[border-radius] duration-200",
          isOpen ? "rounded-s-xl" : "rounded-e-xl"
        )}
        variant="outline"
        size="icon"
      >
        <ChevronLeft
          className={cn(
            "h-4 w-4 transition-transform duration-200",
            isOpen === false ? "rotate-180" : "rotate-0"
          )}
        />
      </Button>
    </div>
  );
}
