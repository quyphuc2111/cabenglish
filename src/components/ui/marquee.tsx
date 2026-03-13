import { cn } from "@/lib/utils";

interface MarqueeProps {
  children: React.ReactNode;
  className?: string;
  speed?: "slow" | "normal" | "fast";
  pauseOnHover?: boolean;
  reverse?: boolean;
}

export function Marquee({
  children,
  className,
  speed = "normal",
  pauseOnHover = true,
  reverse = false,
}: MarqueeProps) {
  const speedMap = {
    slow: "40s",
    normal: "25s",
    fast: "15s",
  };

  return (
    <div className={cn("relative flex overflow-hidden", className)}>
      <div
        className={cn(
          "flex gap-8 animate-marquee",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
        style={{
          animationDuration: speedMap[speed],
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {children}
        {children}
      </div>
    </div>
  );
}
