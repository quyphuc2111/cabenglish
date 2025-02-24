"use client"
import Link from "next/link";
import { Suspense } from 'react';

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
import { useTranslation } from "@/hooks/useTranslation";
import { LectureFavouriteList } from "@/components/page/lecture-favourite-list";
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

// async function getData() {
//   try {
//     const response = await fetch("http://localhost:5000/api/lessons", {
//       cache: 'no-store'
//     });
    
//     if (!response.ok) {
//       throw new Error('Không thể tải dữ liệu');
//     }

//     const responseData = await response.json();

//     if (!responseData?.data || !Array.isArray(responseData.data)) {
//       return [];
//     }

//     return responseData.data.map((item: any) => ({
//       courseTitle: item.lesson_name || '',
//       courseImage: '/modal/course1.png',
//       courseWeek: `Tuần học ${item.order || 1}`,
//       courseCategory: "3 - 4 tuổi",
//       courseName: item.lesson_name?.split(":")[1]?.trim() || '',
//       courseProgress: 100,
//       courseLike: item.numliked || 0,
//       courseStatus: 'started',
//     }));

//   } catch (error) {
//     console.error('Lỗi khi tải dữ liệu:', error);
//     return [];
//   }
// }

export default function DashboardPage() {
  // const courseData = await getData();
  const { t } = useTranslation('', 'common')
  const { onOpen } = useModal()

  return (
    <ContentLayout title="Dashboard">
    <Suspense fallback={<div>Đang tải...</div>}>
        {/* <ClassroomContent /> */}
        {/* <div className="">
        <div className="flex items-center gap-2">
          <Image src="/book.gif" alt="book" width={40} height={40} />
          <p className="text-xl text-[#555555] font-medium">
            {t('listOfLecture')}
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
            <p className="text-lg">{t('favourite')}</p>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4 lg:gap-8 my-8">
            {courseData.map((courseItem, index) => (
              <Fragment key={index}>
                <CourseCard {...courseItem} />
              </Fragment>
            ))}
          </div>
        </div>
      </div> */}
      <LectureFavouriteList courseData={courseData} />

      {/* test */}
    
    </Suspense>
    </ContentLayout>
  );
}