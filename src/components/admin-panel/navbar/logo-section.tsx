import { cn } from "@/lib/utils";

export const LogoSection = () => {
  return (
    <div className="w-fit relative">
      <div className="flex items-center">
        <div
          className={cn(
            "font-extrabold text-[14px] sm:text-[16px] lg:text-[20px] xl:text-[13px] 2xl:text-[22px] tracking-[2px] sm:tracking-[3px] lg:tracking-[4.20px]",
            "bg-gradient-to-r from-blue-600 via-pink-500 to-purple-600",
            "text-transparent bg-clip-text animate-text-shine"
          )}
        >
          SMART KID
        </div>
        <span className="ml-1 sm:ml-2 text-[14px] sm:text-[16px] lg:text-[21px] xl:text-[13px] 2xl:text-[22px] font-black tracking-[2px] sm:tracking-[3px] lg:tracking-[4.20px]">
          {" "}
        </span>
        <span
          className={cn(
            "ml-1 text-[14px] sm:text-[16px] lg:text-[21px] xl:text-[13px] 2xl:text-[22px] font-black tracking-[2px] sm:tracking-[3px] lg:tracking-[4.20px]",
            "bg-gradient-to-br from-amber-500 to-pink-600",
            "text-transparent bg-clip-text"
          )}
        >
          {new Date().getFullYear()}
        </span>
      </div>
    </div>
  );
};
