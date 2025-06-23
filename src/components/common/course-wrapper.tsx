import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

function CourseWrapper({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn(
      "bg-white px-5 py-8 relative rounded-xl min-h-[80vh] overflow-hidden",
      className
    )}>
      {/* Decorative elements - top right */}
      <div className="absolute -top-1 right-[2vw] flex gap-4 sm:gap-8 lg:gap-28 z-10">
        <Image 
          src="/rank.gif" 
          alt="rank" 
          width={40} 
          height={40} 
          className="w-8 h-8 sm:w-10 sm:h-10"
        />
        <Image 
          src="/rank.gif" 
          alt="rank" 
          width={40} 
          height={40} 
          className="w-8 h-8 sm:w-10 sm:h-10"
        />
        <Image 
          src="/longden_course.png" 
          alt="longden" 
          width={40} 
          height={40} 
          className="w-8 h-8 sm:w-10 sm:h-10"
        />
      </div>

      {/* Main content */}
      <div className="relative z-0 h-full">
        {children}
      </div>

      {/* Decorative elements - bottom */}
      <div className="absolute bottom-0 left-0 right-0 flex gap-4 sm:gap-8 lg:gap-20 justify-between px-4 z-10">
        <Image 
          src="/kilan_course.png" 
          alt="kilan" 
          width={60} 
          height={60} 
          className="w-12 h-12 sm:w-14 sm:h-14 lg:w-15 lg:h-15 transform scale-x-[-1]"
        />
        <Image 
          src="/kilan_course.png" 
          alt="kilan" 
          width={60} 
          height={60} 
          className="w-12 h-12 sm:w-14 sm:h-14 lg:w-15 lg:h-15"
        />
      </div>
    </div>
  );
}

export default CourseWrapper;
