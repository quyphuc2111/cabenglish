import * as React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const Toolbar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center space-x-1", className)}
    {...props}
  />
))
Toolbar.displayName = "Toolbar"

const ToolbarButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }
>(({ className, active, ...props }, ref) => (
  <Button
    ref={ref}
    variant={active ? "secondary" : "ghost"}
    size="sm"
    className={cn(
      "h-8 w-8 p-0",
      active && "bg-gray-200 text-gray-900",
      className
    )}
    {...props}
  />
))
ToolbarButton.displayName = "ToolbarButton"

export { Toolbar, ToolbarButton } 