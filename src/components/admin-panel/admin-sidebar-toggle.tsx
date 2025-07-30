import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useResponsive } from "@/hooks/use-responsive";

interface AdminSidebarToggleProps {
  isOpen: boolean | undefined;
  setIsOpen?: () => void;
}

export function AdminSidebarToggle({ isOpen, setIsOpen }: AdminSidebarToggleProps) {
  const { isMobile } = useResponsive();
  const shouldShowTooltip = isOpen === false || isMobile;

  return (
    <div className="px-2 py-2">
      {/* Separator line */}
      <div className="border-t border-white/20 mb-4"></div>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => setIsOpen?.()}
              className={cn(
                "w-full h-12 bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/30 transition-all duration-300",
                "flex items-center justify-center px-4 rounded-lg relative shadow-sm",
                isOpen === false ? "justify-center" : "justify-between"
              )}
              variant="outline"
            >
                      {isOpen && (
          <span className="text-sm font-medium">
            Ẩn sidebar
          </span>
        )}
              
              <div className="flex items-center">
                {isOpen ? (
                  <ChevronLeft className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </div>
            </Button>
          </TooltipTrigger>
          {shouldShowTooltip && (
            <TooltipContent side="right">
              <p>{isOpen ? "Ẩn sidebar" : "Hiện sidebar"}</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
