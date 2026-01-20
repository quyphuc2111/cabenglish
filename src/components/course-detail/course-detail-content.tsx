'use client'
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface Unit {
  id: number;
  image: string;
  titleEn: string;
  titleVi: string;
  progress: number;
  slug: string;
}

interface CourseDetailContentProps {
  courseTitle: string;
  units: {
    semester1: Unit[];
    semester2: Unit[];
    summerSemester: Unit[];
  };
}

export default function CourseDetailContent({ courseTitle, units }: CourseDetailContentProps) {
  const [activeTab, setActiveTab] = useState<'semester1' | 'semester2' | 'summerSemester'>('semester1');
  const router = useRouter();

  const handleUnitClick = (slug: string) => {
    router.push(`/khoahoc/tieng-anh-lop-1/unit/${slug}`);
  };

  const currentUnits = units[activeTab];

  return (
    <div className="w-full">
    <div className="flex items-center justify-between">
    <div className="flex items-center gap-4 mb-8">
      <Image
        src="/menu-icons/return_icon.png"
        alt="Course Detail"
        width={35}
        height={35}
      />
      <p className="text-[#BD5353] text-[23px] font-semibold"> Cab KID</p>
     </div>
     <Button 
          className="bg-[#BD5353] text-white rounded-full px-8 hover:bg-[#a04545] shadow-md font-semibold"
          onClick={() => router.push('/')}
        >
          Trang chủ
        </Button>
    </div>
      {/* Tabs */}
      <div className="flex gap-3 mb-8">
        <button
          onClick={() => setActiveTab('semester1')}
          className={cn(
            "px-8 py-6 rounded-[20px] font-semibold text-[25px] transition-all",
            activeTab === 'semester1'
              ? "bg-[#E87D7D] text-white"
              : "bg-[#F9F9F9] text-black"
          )}
        >
          Học kỳ 1
        </button>
        <button
          onClick={() => setActiveTab('semester2')}
          className={cn(
            "px-8 py-6 rounded-[20px] font-semibold text-[25px] transition-all",
            activeTab === 'semester2'
              ? "bg-[#E87D7D] text-white"
              : "bg-[#F9F9F9] text-black"
          )}
        >
          Học kỳ 2
        </button>
        <button
          onClick={() => setActiveTab('summerSemester')}
          className={cn(
            "px-8 py-6 rounded-[20px] font-semibold text-[25px] transition-all",
            activeTab === 'summerSemester'
              ? "bg-[#E87D7D] text-white"
              : "bg-[#F9F9F9] text-black"
          )}
        >
          Học kỳ hè
        </button>
      </div>

      {/* Units Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 gap-y-20 mt-[100px]">
        {currentUnits.map((unit) => (
          <div
            key={unit.id}
            onClick={() => handleUnitClick(unit.slug)}
            className="bg-white border-[5px] border-[#E87D7D] rounded-[50px] cursor-pointer hover:scale-105 transition-transform duration-300 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
          >
            {/* Unit Image */}
            <div className="relative w-full h-[200px] -mt-[100px] px-12">
              <Image
                src={unit.image}
                alt={unit.titleEn}
                fill
                className="object-contain rounded-[20px] px-12"
              />
            </div>

            {/* Unit Content */}
            <div className="p-6 pt-4">
              {/* English Title */}
              <h3 className="text-[#1D5995] font-semibold text-[25px] text-center mb-2 leading-tight">
                {unit.titleEn}
              </h3>

              {/* Vietnamese Title */}
              <p className="text-[#5A6066] font-semibold text-[22px] text-center mb-4">
                {unit.titleVi}
              </p>

              {/* Progress */}
              <div className="mt-6">
                <p className="text-[#C64D4D] font-normal text-[20px] mb-2 text-center">
                  {unit.progress}%
                </p>
                {/* Progress Bar */}
                <div className="w-full bg-[#D9D9D9] rounded-[50px] h-4 overflow-hidden">
                  <div
                    className="bg-[#F68F8F] h-full rounded-[50px] transition-all duration-300"
                    style={{ width: `${unit.progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
