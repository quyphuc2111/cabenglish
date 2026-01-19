"use client"
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

const grades = [
  {
    id: 1,
    label: "Lớp 1",
    image: "/grade-selection/grade-1.png",
    href: "/lop-hoc?grade=1"
  },
  {
    id: 2,
    label: "Lớp 2",
    image: "/grade-selection/grade-2.png",
    href: "/lop-hoc?grade=2"
  },
  {
    id: 3,
    label: "Lớp 3",
    image: "/grade-selection/grade-3.png",
    href: "/lop-hoc?grade=3"
  },
  {
    id: 4,
    label: "Lớp 4",
    image: "/grade-selection/grade-4.png",
    href: "/lop-hoc?grade=4"
  },
  {
    id: 5,
    label: "Lớp 5",
    image: "/grade-selection/grade-5.png",
    href: "/lop-hoc?grade=5"
  }
];

function GradeSelection() {
  const router = useRouter();

  return (
    <div className="space-y-8">
          <div className="flex justify-between">
             <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="bg-[#E99240] text-white border-none rounded-full px-6 hover:bg-[#d17f2f] shadow-md font-semibold"
          >
            Kết quả
          </Button>
          <Button 
            variant="outline" 
            className="bg-[#E99240] text-white border-none rounded-full px-6 hover:bg-[#d17f2f] shadow-md font-semibold"
          >
            Vinh danh
          </Button>
        </div>
         <Button 
          className="bg-[#BD5353] text-white rounded-full px-8 hover:bg-[#a04545] shadow-md font-semibold"
          onClick={() => router.push('/')}
        >
          Trang chủ
        </Button>
          </div>
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/grade-selection/list-icon.png"
            alt="list"
            width={53}
            height={53}
            className="object-contain"
          />
          <h1 className="text-[32px] font-bold text-[#D12828] leading-[1.21]">
            Danh sách lớp học
          </h1>
        </div>
      </div>

      {/* Grade Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 pt-8">
        {grades.map((grade) => (
          <div
            key={grade.id}
            className="bg-white rounded-[50px] border-[5px] border-[#E87D7D] p-6 shadow-lg cursor-pointer hover:shadow-xl transition-all hover:scale-105"
            onClick={() => router.push(grade.href)}
          >
            <h2 className="text-[32px] font-extrabold text-[#1D5995] mb-4 leading-[1.21]">
              {grade.label}
            </h2>
            <div className="rounded-[20px] overflow-hidden">
              <Image
                src={grade.image}
                alt={grade.label}
                width={205}
                height={137}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="h-16"></div>
    </div>
  );
}

export default GradeSelection;
