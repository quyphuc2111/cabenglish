import Image from "next/image";
import React, { FC } from "react";
import SectionTitle from "./section-title";
import { ScrollArea } from "../ui/scroll-area";

function CourseWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white px-5 py-2 relative rounded-xl max-h-screen h-[78vh]">
      <div className="flex gap-28 absolute -top-1 right-[2vw]">
        <Image src="/rank.gif" alt="rank" width={40} height={40} />
        <Image src="/rank.gif" alt="rank" width={40} height={40} />
        <Image src="/longden_course.png" alt="longden" width={40} height={40} />
      </div>
      {children}
      <div className="flex gap-20 justify-between absolute bottom-0 left-0 right-0">
        <Image src="/kilan_course.png" alt="kilan" width={60} height={60} className=" transform scale-x-[-1]"/>
        <Image src="/kilan_course.png" alt="kilan" width={60} height={60} />
      </div>
    </div>
  );
}

export default CourseWrapper;
