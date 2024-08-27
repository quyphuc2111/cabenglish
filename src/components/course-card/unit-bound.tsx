'use client'
import React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Progress } from "../ui/progress";
import { useRouter } from "next/navigation";

function UnitBound({ className }: any) {
  const router = useRouter()

  const handleChooseCourse = () => {
   router.push('/khoahoc/tieng-anh-lop-1/unit/4432')
  };

  return (
    <div
      className={cn(
        "bg-white border shadow-course-inset rounded-3xl p-5 cursor-pointer scale-100 hover:scale-105 transition-transform duration-300",
        className
      )}
      onClick={handleChooseCourse}
    >
      <div className=" flex flex-col items-center gap-2">
        <div>
          <Image
            width={150}
            height={300}
            alt="unit-bound"
            className="rounded-3xl mb-2"
            src="https://static.edupia.vn/dungchung/dungchung/core_cms/resources/uploads/images/2023/01/10/g1u1_thumb_in-the-school-playground.png"
          />
        </div>

        <h2 className="text-lg font-semibold text-center">Unit 1: In the school playground</h2>
        <p className="text-xs text-zinc-400">Bài 1 : Trong sân trường</p>
      </div>

      <div className="mt-8">
        <p className="text-xs mb-2">15%</p>
        <Progress value={15} />
      </div>
    </div>
  );
}

export default UnitBound;
