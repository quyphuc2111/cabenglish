import { cn } from "@/lib/utils";

export const LogoSection = () => {
  return (
    <div className="w-fit relative">
      <div className="flex items-center">
        <div className={cn(
          "font-extrabold text-[21px] tracking-[4.20px]",
          "bg-gradient-to-r from-blue-600 via-pink-500 to-purple-600",
          "text-transparent bg-clip-text animate-text-shine"
        )}>
          SMART KID
        </div>
        <span className="ml-2 text-[21px] font-black tracking-[4.20px]"> </span>
        <span className={cn(
          "ml-1 text-[21px] font-black tracking-[4.20px]",
          "bg-gradient-to-br from-amber-500 to-pink-600",
          "text-transparent bg-clip-text"
        )}>
          {new Date().getFullYear()}
        </span>
      </div>
      {/* Các decorative elements */}
    </div>
  )
} 