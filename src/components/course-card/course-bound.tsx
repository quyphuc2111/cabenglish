"use client"
import Image from "next/image";
import React from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupList,
  AvatarImage,
  AvatarOverflowIndicator
} from "../ui/avatar";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "../ui/tooltip";
import { useRouter } from "next/navigation";

function CourseBound({ className }: any) {
  const router = useRouter();

  const handleChooseCourse = () => {
    router.push('/main/khoa-hoc/tieng-anh-lop-1')
   };

  return (
    <div
    onClick={handleChooseCourse}
      className={cn(
        "px-3 py-5 bg-white rounded-3xl flex flex-col gap-3 shadow-course-inset border relative overflow-hidden",
        className
      )}
    >
      <Image
        src="https://static.edupia.vn/dungchung/dungchung/core_cms/resources/uploads/common/images/2022/11/24/lop-1-ngang.png"
        alt="course-image"
        width={300}
        height={150}
        className="rounded-3xl w-full h-auto "
      />
      <div className="flex flex-col gap-2 ">
        <div className="flex justify-between">
          <h2 className="text-2xl font-bold">Tiếng anh lớp 1</h2>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="text-sm text-gray-500 line-clamp-3 cursor-pointer">
                Khoá học bám sát khung chương trình tiếng Anh lớp 1. Mỗi buổi
                học bao gồm 01 video bài giảng hoặc bài hát, và các bài tập giúp
                con học từ vựng, phát âm, phát triển 04 kỹ năng Nghe - Nói - Đọc
                - Viết. Các con học phát âm các âm đơn cơ bản, chữ cái tiếng
                Anh, nói được các từ vựng đơn chứa âm, và nói các mẫu câu đơn
                ngắn thường gặp về chủ đề đời sống hằng ngày
              </p>
            </TooltipTrigger>
            <TooltipContent className="bg-white text-black">
              <div className="w-[300px] py-5 px-3 rounded-xl shadow-lg">
                <div className="flex justify-between">
                  <h2 className="text-2xl font-bold">Tiếng anh lớp 1</h2>
                </div>
                <p className="text-sm text-gray-500">
                  Khoá học bám sát khung chương trình tiếng Anh lớp 1. Mỗi buổi
                  học bao gồm 01 video bài giảng hoặc bài hát, và các bài tập
                  giúp con học từ vựng, phát âm, phát triển 04 kỹ năng Nghe -
                  Nói - Đọc - Viết. Các con học phát âm các âm đơn cơ bản, chữ
                  cái tiếng Anh, nói được các từ vựng đơn chứa âm, và nói các
                  mẫu câu đơn ngắn thường gặp về chủ đề đời sống hằng ngày
                </p>
                <p className="text-xs font-semibold py-5">
                  Giáo viên giảng dạy
                </p>
                <div className="flex justify-between">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div className="flex gap-2 items-center" key={i}>
                      <Avatar className="w-7 h-7 flex">
                        <AvatarImage
                          src={`https://xsgames.co/randomusers/assets/avatars/female/${i}.jpg`}
                          alt="@shadcn"
                        />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <p className="text-xs font-medium">Adam Lewis</p>
                    </div>
                  ))}
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <p className="text-xs font-semibold">Giáo viên giảng dạy</p>

        <div className="flex justify-between">
          {Array.from({ length: 3 }).map((_, i) => (
            <div className="flex gap-2 items-center" key={i}>
              <Avatar className="w-7 h-7 flex">
                <AvatarImage
                  src={`https://xsgames.co/randomusers/assets/avatars/female/${i}.jpg`}
                  alt="@shadcn"
                />

                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <p className="text-xs font-medium">Adam Lewis</p>
            </div>
          ))}
        </div>
        <Separator />
        <div className="flex gap-1 items-center">
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

        <Button className="start-course-btn">Học ngay</Button>
      </div>
    </div>
  );
}

export default CourseBound;
