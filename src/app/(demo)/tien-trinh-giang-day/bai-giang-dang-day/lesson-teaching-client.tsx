"use client"
import React from "react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import SectionTitle from "@/components/common/section-title";
import FilterFacet from "@/components/common/filter-facet";
import Image from "next/image";
import CourseCard from "@/components/course-card/course-card";
import { PaginatedContent } from "@/components/common/paginated-content";
import { Button } from "@/components/ui/button";
import { LessonType } from "@/types/lesson";
import LessonCard from "@/components/lesson/lesson-card";

const courseData = [
    {
      courseTitle: "Unit 1 - Bài học: Từ vựng",
      courseImage: "/modal/course1.png",
      courseWeek: "Tuần học 1",
      courseCategory: "3 - 4 tuổi",
      courseName: "Bảng chữ cái tiếng anh",
      courseProgress: 0,
      courseLike: 668,
      courseStatus: 'not_started'
    },
    {
      courseTitle: "Unit 2 - Bài học: Chào hỏi",
      courseImage: "/modal/course2.png",
      courseWeek: "Tuần học 2",
      courseCategory: "3 - 4 tuổi",
      courseName: "Giới thiệu bản thân",
      courseProgress: 0,
      courseLike: 568,
      courseStatus: 'not_started'
    },
    {
      courseTitle: "Unit 3 - Bài học: Màu sắc",
      courseImage: "/modal/course3.png",
      courseWeek: "Tuần học 3",
      courseCategory: "3 - 4 tuổi",
      courseName: "Khám phá các màu sắc",
      courseProgress: 0,
      courseLike: 86,
      courseStatus: 'not_started'
    },
    {
      courseTitle: "Unit 4 - Bài học: Từ vựng",
      courseImage: "/modal/course4.png",
      courseWeek: "Tuần học 1",
      courseCategory: "3 - 4 tuổi",
      courseName: "Bảng chữ cái tiếng anh",
      courseProgress: 0,
      courseLike: 638,
      courseStatus: 'not_started'
    },
    {
      courseTitle: "Unit 1 - Bài học: Từ vựng",
      courseImage: "/modal/course1.png",
      courseWeek: "Tuần học 1",
      courseCategory: "3 - 4 tuổi",
      courseName: "Bảng chữ cái tiếng anh",
      courseProgress: 0,
      courseLike: 668,
      courseStatus: 'not_started'
    },
    {
      courseTitle: "Unit 2 - Bài học: Chào hỏi",
      courseImage: "/modal/course2.png",
      courseWeek: "Tuần học 2",
      courseCategory: "3 - 4 tuổi",
      courseName: "Giới thiệu bản thân",
      courseProgress: 0,
      courseLike: 568,
      courseStatus: 'not_started'
    },
    {
      courseTitle: "Unit 3 - Bài học: Màu sắc",
      courseImage: "/modal/course3.png",
      courseWeek: "Tuần học 3",
      courseCategory: "3 - 4 tuổi",
      courseName: "Khám phá các màu sắc",
      courseProgress: 0,
      courseLike: 86,
      courseStatus: 'not_started'
    },
    {
      courseTitle: "Unit 4 - Bài học: Từ vựng",
      courseImage: "/modal/course4.png",
      courseWeek: "Tuần học 1",
      courseCategory: "3 - 4 tuổi",
      courseName: "Bảng chữ cái tiếng anh",
      courseProgress: 0,
      courseLike: 638,
      courseStatus: 'not_started'
    },
    {
      courseTitle: "Unit 1 - Bài học: Từ vựng",
      courseImage: "/modal/course1.png",
      courseWeek: "Tuần học 1",
      courseCategory: "3 - 4 tuổi",
      courseName: "Bảng chữ cái tiếng anh",
      courseProgress: 0,
      courseLike: 668,
      courseStatus: 'not_started'
    },
    {
      courseTitle: "Unit 2 - Bài học: Chào hỏi",
      courseImage: "/modal/course2.png",
      courseWeek: "Tuần học 2",
      courseCategory: "3 - 4 tuổi",
      courseName: "Giới thiệu bản thân",
      courseProgress: 0,
      courseLike: 568,
      courseStatus: 'not_started'
    },
    {
      courseTitle: "Unit 3 - Bài học: Màu sắc",
      courseImage: "/modal/course3.png",
      courseWeek: "Tuần học 3",
      courseCategory: "3 - 4 tuổi",
      courseName: "Khám phá các màu sắc",
      courseProgress: 0,
      courseLike: 86,
      courseStatus: 'not_started'
    },
    {
      courseTitle: "Unit 4 - Bài học: Từ vựng",
      courseImage: "/modal/course4.png",
      courseWeek: "Tuần học 1",
      courseCategory: "3 - 4 tuổi",
      courseName: "Bảng chữ cái tiếng anh",
      courseProgress: 0,
      courseLike: 638,
      courseStatus: 'not_started'
    }
  ];
  
  const courseTest =   {
      courseTitle: "Unit 1 - Bài học: Từ vựng",
      courseImage: "/modal/course1.png",
      courseWeek: "Tuần học 1",
      courseCategory: "3 - 4 tuổi",
      courseName: "Bảng chữ cái tiếng anh",
      courseProgress: 100,
      courseLike: 668,
      courseStatus: 'started'
    }

interface LessonTeachingClientProps {
    teachingLessons: LessonType;
    upcomingLessons: LessonType[];
}
  
function LessonTeachingClient({ teachingLessons, upcomingLessons }: LessonTeachingClientProps) {

  return (
    <ContentLayout title="BaiGiangDangDay">
      <div className="flex gap-16">
        <div className="bg-white h-fit px-4 py-2 flex flex-col gap-5 rounded-xl">
          <SectionTitle
            title="Bài giảng đang dạy"
            image={{
              src: "/assets/gif/book_animate.gif",
              width: 40,
              height: 40,
              alt: "book_animate"
            }}
            wrapperClassName="border-[#4079CE]"
          />
          <LessonCard {...teachingLessons} classRoomName={teachingLessons.className} />

          <Button className="bg-[#4079CE] w-full">Tiếp tục học</Button>
        </div>
        <div className="bg-white px-5 py-2 relative rounded-xl flex-1 min-h-[500px]">
          <div className="flex gap-20 absolute top-0 right-[12%]">
            <Image src="/rank.gif" alt="rank" width={40} height={40} />
            <Image src="/rank.gif" alt="rank" width={40} height={40} />
          </div>
          <div className="flex items-center gap-8">
            <SectionTitle
              title="Bài giảng tiếp theo"
              image={{
                src: "/assets/gif/book_animate.gif",
                width: 40,
                height: 40,
                alt: "book_animate"
              }}
              wrapperClassName="border-[#D4CD66]"
            />
          </div>

          <PaginatedContent
            items={upcomingLessons}
            itemsPerPage={6}
            rowPerPage={3}
            renderItem={(courseItem) => <LessonCard  {...courseItem} classRoomName={courseItem.className} />}
          />
        </div>
      </div>
    </ContentLayout>
  );
}

export default LessonTeachingClient;
