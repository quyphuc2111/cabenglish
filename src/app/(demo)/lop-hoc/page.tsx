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

const courseData = [
  {
    courseTitle: "Unit 1 - Bài học: Từ vựng",
    courseImage: "/modal/course1.png",
    courseWeek: "Tuần học 1",
    courseCategory: "3 - 4 tuổi",
    courseName: "Bảng chữ cái tiếng anh",
    courseProgress: 100,
    courseLike: 668
  },
  {
    courseTitle: "Unit 2 - Bài học: Chào hỏi",
    courseImage: "/modal/course2.png",
    courseWeek: "Tuần học 2",
    courseCategory: "3 - 4 tuổi",
    courseName: "Giới thiệu bản thân",
    courseProgress: 100,
    courseLike: 568
  },
  {
    courseTitle: "Unit 3 - Bài học: Màu sắc",
    courseImage: "/modal/course3.png",
    courseWeek: "Tuần học 3",
    courseCategory: "3 - 4 tuổi",
    courseName: "Khám phá các màu sắc",
    courseProgress: 100,
    courseLike: 86
  },
  {
    courseTitle: "Unit 4 - Bài học: Từ vựng",
    courseImage: "/modal/course4.png",
    courseWeek: "Tuần học 1",
    courseCategory: "3 - 4 tuổi",
    courseName: "Bảng chữ cái tiếng anh",
    courseProgress: 100,
    courseLike: 668
  }
];

export default function DashboardPage() {
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
        <div className="flex gap-24">
        <div className="flex items-center gap-3 border-b-4 border-[#EA69AE]/50 w-fit pr-6 pb-1">
            <Image
              src="/favourite.png"
              alt="favourite"
              width={30}
              height={30}
            />
            <p className="text-lg">Yêu thích</p>
          </div>

          <div className="flex gap-5">
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

          <div className="flex gap-20 absolute top-0 right-[12%]">
            <Image src="/rank.gif" alt="book" width={40} height={40} />
            <Image src="/rank.gif" alt="book" width={40} height={40} />
          </div>
        </div>

          <div className="grid grid-cols-4 gap-8 my-8">
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
          <Image src="/book.gif" alt="book" width={40} height={40} />
          <p className="text-xl text-[#555555] font-medium">
            Danh sách bài giảng
          </p>
        </div>
        <div className="bg-white px-7 py-5 my-2  relative">
        <div className="flex gap-24">
        <div className="flex items-center gap-3 border-b-4 border-[#EA69AE]/50 w-fit pr-6 pb-1">
            <Image
              src="/favourite.png"
              alt="favourite"
              width={30}
              height={30}
            />
            <p className="text-lg">Yêu thích</p>
          </div>

          <div className="flex gap-5">
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

          <div className="flex gap-20 absolute top-0 right-[12%]">
            <Image src="/rank.gif" alt="book" width={40} height={40} />
            <Image src="/rank.gif" alt="book" width={40} height={40} />
          </div>
        </div>

          <div className="grid grid-cols-4 gap-8 my-8">
            {courseData.map((courseItem, index) => (
              <Fragment key={index}>
                <CourseCard {...courseItem} />
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </ContentLayout>
  );
}
