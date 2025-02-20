"use client"

import Link from "next/link";

import PlaceholderContent from "@/components/demo/placeholder-content";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import ClassroomContent from "@/components/class/classroom-content";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Fragment } from "react";
import CourseCard from "@/components/course-card/course-card";
import { Progress } from "@/components/ui/progress";
import { useModal } from "@/hooks/useModalStore";

const courseData = [
  {
    courseTitle: "Unit 1 - Bài học: Từ vựng",
    courseImage: "/modal/course1.png",
    courseWeek: "Tuần học 1",
    courseCategory: "3 - 4 tuổi",
    courseName: "Bảng chữ cái tiếng anh",
    courseProgress: 100,
    courseLike: 668,
    courseStatus: 'started'
  },
  {
    courseTitle: "Unit 2 - Bài học: Chào hỏi",
    courseImage: "/modal/course2.png",
    courseWeek: "Tuần học 2",
    courseCategory: "3 - 4 tuổi",
    courseName: "Giới thiệu bản thân",
    courseProgress: 100,
    courseLike: 568,
    courseStatus: 'started'
  },
  {
    courseTitle: "Unit 3 - Bài học: Màu sắc",
    courseImage: "/modal/course3.png",
    courseWeek: "Tuần học 3",
    courseCategory: "3 - 4 tuổi",
    courseName: "Khám phá các màu sắc",
    courseProgress: 100,
    courseLike: 86,
    courseStatus: 'started'
  },
  {
    courseTitle: "Unit 4 - Bài học: Từ vựng",
    courseImage: "/modal/course4.png",
    courseWeek: "Tuần học 1",
    courseCategory: "3 - 4 tuổi",
    courseName: "Bảng chữ cái tiếng anh",
    courseProgress: 100,
    courseLike: 638,
    courseStatus: 'started'
  }
];

export default function DashboardPage() {
  const { onOpen } = useModal();

  return (
    <ContentLayout title="Dashboard">
      {/* <ClassroomContent /> */}
      <div className="">
        <div className="flex items-center gap-2">
          <Image src="/book.gif" alt="book" width={40} height={40} />
          <p className="text-xl text-[#555555] font-medium">
            Danh sách bài giảng
          </p>
        </div>
        <div className="bg-white px-7 py-5 my-2  relative">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-24">
        <div className="flex items-center gap-3 border-b-4 border-[#EA69AE]/50 w-fit pr-6 pb-1">
            <Image
              src="/favourite.png"
              alt="favourite"
              width={30}
              height={30}
            />
            <p className="text-lg">Yêu thích</p>
          </div>

          <div className="flex flex-wrap gap-3 sm:gap-5">
            <div>
              <Select>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="apple">Apple</SelectItem>
                    <SelectItem value="banana">Banana</SelectItem>
                    <SelectItem value="blueberry">Blueberry</SelectItem>
                    <SelectItem value="grapes">Grapes</SelectItem>
                    <SelectItem value="pineapple">Pineapple</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Tuần học" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="apple">Apple</SelectItem>
                    <SelectItem value="banana">Banana</SelectItem>
                    <SelectItem value="blueberry">Blueberry</SelectItem>
                    <SelectItem value="grapes">Grapes</SelectItem>
                    <SelectItem value="pineapple">Pineapple</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Lớp học" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="apple">Apple</SelectItem>
                    <SelectItem value="banana">Banana</SelectItem>
                    <SelectItem value="blueberry">Blueberry</SelectItem>
                    <SelectItem value="grapes">Grapes</SelectItem>
                    <SelectItem value="pineapple">Pineapple</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="hidden lg:flex gap-20 absolute top-0 right-[12%]">
            <Image src="/rank.gif" alt="rank" width={40} height={40} />
            <Image src="/rank.gif" alt="rank" width={40} height={40} />
          </div>
        </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 lg:gap-8 my-8">
            {courseData.map((courseItem, index) => (
              <Fragment key={index}>
                <CourseCard {...courseItem} />
              </Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* test */}
      <div className="mt-5">
        <div className="flex items-center gap-2">
          <Image src="/rank_flag.gif" alt="book" width={40} height={40} />
          <p className="text-xl text-[#555555] font-medium">
            Tiến trình giảng dạy
          </p>
        </div>
        <div className="bg-white px-4 lg:px-7 py-5 my-2 flex flex-col lg:flex-row">

          {/* Thống kế tiến trình  */}
          <div className="w-full lg:w-1/2 px-2 lg:px-5 mb-8 lg:mb-0">
            <div className="flex items-center gap-5 justify-center">
              <Image src="/percent.png" alt="percent" width={40} height={40} priority />
              <p className="text-xl">Thống kê tiến trình giảng dạy</p>
            </div>
            
            <div className="flex items-center gap-3 mt-4">
              <Image src="/check_course.png" alt="check_icon" width={25} height={25} priority />
              <p>Đã hoàn thành</p>
            </div>

            <div className="flex items-center mb-8 mt-6">
              <p className="w-1/6">Năm học:</p>
              <div className="border border-black px-3 py-1 rounded-lg flex items-center gap-5 justify-center w-5/6 relative">
                <Progress value={20} className="h-8 rounded-full [&>*]:bg-[#BEDF9F]"  />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-medium text-sm">
                  20%
                </span>
                <Image 
                  src="/reset_icon.png" 
                  alt="check_icon" 
                  width={45} 
                  height={45} 
                  priority 
                  className="ml-2"
                />
              </div>
            </div>

            <div className="flex items-center ">
              <p className="w-1/6">Unit:</p>
             <div className="flex w-5/6 gap-5">
             <div className="border border-black px-3 py-1 rounded-lg flex items-center gap-5 justify-center w-full relative">
                <Progress value={20} className="h-8 rounded-full [&>*]:bg-[#A7C6F5]"  />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-medium text-sm">
                  20%
                </span>
                <div onClick={() => onOpen("resetUnit")}>
                <Image 
                  src="/reset_icon.png" 
                  alt="check_icon" 
                  width={45} 
                  height={45} 
                  priority
                  className="ml-2" 
                />
                </div>
              </div>
              <Select>
                  <SelectTrigger className="w-[150px] h-[55px] rounded-lg">
                    <SelectValue placeholder="Chọn Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Units</SelectLabel>
                      <SelectItem value="unit1">Unit 1</SelectItem>
                      <SelectItem value="unit2">Unit 2</SelectItem>
                      <SelectItem value="unit3">Unit 3</SelectItem>
                      <SelectItem value="unit4">Unit 4</SelectItem>
                      <SelectItem value="unit5">Unit 5</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
             </div>
            </div>
          </div>

          {/* Bài giảng đang dạy & tiếp theo */}
          <div className="flex flex-col lg:flex-row gap-8 w-full lg:w-1/2">
            <div className="w-full lg:w-1/2 flex flex-col gap-3 lg:border-l border-[#e969ad]/50 lg:px-5">
              <div className="flex items-center gap-3 ">
                <Image 
                  src="/book_light.png" 
                  alt="book_light" 
                  width={35} 
                  height={35} 
                  priority
                />
                <p className="text-xl">Bài giảng đang dạy</p>
              </div>
              <div className=" flex justify-center">
                {courseData.filter(i => i.courseLike == 668).map((courseItem, index) => (
                  <Fragment key={index}>
                    <CourseCard {...courseItem} />
                  </Fragment>
                ))}
              </div>
            </div>

            <div className="w-full lg:w-1/2 flex flex-col gap-3 lg:border-l border-[#e969ad]/50 lg:px-5">
              <div className="flex items-center gap-3 ">
                <Image 
                  src="/person_rank.png" 
                  alt="person_rank" 
                  width={35} 
                  height={35} 
                  priority
                />
                <p className="text-xl">Bài giảng tiếp theo</p>
              </div>
              <div className=" flex justify-center">
                {courseData.filter(i => i.courseLike == 668).map((courseItem, index) => (
                  <Fragment key={index}>
                    <CourseCard {...courseItem} />
                  </Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ContentLayout>
  );
}
