'use client'
import Image from "next/image";
import React from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupList,
  AvatarImage,
  AvatarOverflowIndicator
} from "../ui/avatar";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

function CourseNew({ className }: any) {
  const router = useRouter();

  const handleChooseCourse = () => {
    router.push('/main/khoa-hoc/tieng-anh-lop-1')
   };

  return (
    <div onClick={handleChooseCourse} className={cn("w-full 2xl:w-2/5 px-3 py-5 bg-white rounded-3xl flex gap-3 shadow-course-inset border overflow-hidden", className)}>
     <div className="relative ">
     <Image
        src="https://static.edupia.vn/uploads/v3/assets/images/thumb-math.png"
        alt="course-image"
        width={240}
        height={150}
        layout="responsive"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="rounded-3xl "
      />
     </div>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <h2 className="text-xl font-bold">Edupia Toán học</h2>
          <Badge className="px-1 py-0 h-5" variant="destructive">New</Badge>
        </div>
        <p className="text-sm text-gray-500">
          Học Toán Online với giáo viên giỏi từ trường điểm
        </p>
      <div className="flex gap-1 items-center flex-1">
      <AvatarGroup limit={3} className="justify-start">
          <AvatarGroupList>
            {Array.from({ length: 5 }).map((_, i) => (
              <Avatar key={i} className="w-5 h-5">
                <AvatarImage
                  src={`https://xsgames.co/randomusers/assets/avatars/female/${i}.jpg`}
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            ))}
          </AvatarGroupList>
          {/* <AvatarOverflowIndicator /> */}
        </AvatarGroup>
        <span className="text-xs font-medium">100.000.000 bạn đang học</span>
      </div>

        <Button className="bg-[#ff9213] shadow-course-inset py-6 text-lg font-semibold">Học ngay</Button>
      </div>
    </div>
  );
}

export default CourseNew;
