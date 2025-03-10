"use client";

import React, { Fragment } from "react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import SectionTitle from "@/components/common/section-title";
import FilterFacet from "@/components/common/filter-facet";
import Image from "next/image";
import CourseCard from "@/components/course-card/course-card";
import { PaginatedContent } from "@/components/common/paginated-content";

const courseData = [
  {
    courseTitle: "Unit 1 - Bài học: Từ vựng",
    courseImage: "/modal/course1.png",
    courseWeek: "Tuần học 1",
    courseCategory: "3 - 4 tuổi",
    courseName: "Bảng chữ cái tiếng anh",
    courseProgress: 100,
    courseLike: 668,
    courseStatus: "started"
  },
  {
    courseTitle: "Unit 2 - Bài học: Chào hỏi",
    courseImage: "/modal/course2.png",
    courseWeek: "Tuần học 2",
    courseCategory: "3 - 4 tuổi",
    courseName: "Giới thiệu bản thân",
    courseProgress: 100,
    courseLike: 568,
    courseStatus: "started"
  },
  {
    courseTitle: "Unit 3 - Bài học: Màu sắc",
    courseImage: "/modal/course3.png",
    courseWeek: "Tuần học 3",
    courseCategory: "3 - 4 tuổi",
    courseName: "Khám phá các màu sắc",
    courseProgress: 100,
    courseLike: 86,
    courseStatus: "started"
  },
  {
    courseTitle: "Unit 4 - Bài học: Từ vựng",
    courseImage: "/modal/course4.png",
    courseWeek: "Tuần học 1",
    courseCategory: "3 - 4 tuổi",
    courseName: "Bảng chữ cái tiếng anh",
    courseProgress: 100,
    courseLike: 638,
    courseStatus: "started"
  },
  {
    courseTitle: "Unit 1 - Bài học: Từ vựng",
    courseImage: "/modal/course1.png",
    courseWeek: "Tuần học 1",
    courseCategory: "3 - 4 tuổi",
    courseName: "Bảng chữ cái tiếng anh",
    courseProgress: 100,
    courseLike: 668,
    courseStatus: "started"
  },
  {
    courseTitle: "Unit 2 - Bài học: Chào hỏi",
    courseImage: "/modal/course2.png",
    courseWeek: "Tuần học 2",
    courseCategory: "3 - 4 tuổi",
    courseName: "Giới thiệu bản thân",
    courseProgress: 100,
    courseLike: 568,
    courseStatus: "started"
  },
  {
    courseTitle: "Unit 3 - Bài học: Màu sắc",
    courseImage: "/modal/course3.png",
    courseWeek: "Tuần học 3",
    courseCategory: "3 - 4 tuổi",
    courseName: "Khám phá các màu sắc",
    courseProgress: 100,
    courseLike: 86,
    courseStatus: "started"
  },
  {
    courseTitle: "Unit 4 - Bài học: Từ vựng",
    courseImage: "/modal/course4.png",
    courseWeek: "Tuần học 1",
    courseCategory: "3 - 4 tuổi",
    courseName: "Bảng chữ cái tiếng anh",
    courseProgress: 100,
    courseLike: 638,
    courseStatus: "started"
  },
  {
    courseTitle: "Unit 1 - Bài học: Từ vựng",
    courseImage: "/modal/course1.png",
    courseWeek: "Tuần học 1",
    courseCategory: "3 - 4 tuổi",
    courseName: "Bảng chữ cái tiếng anh",
    courseProgress: 100,
    courseLike: 668,
    courseStatus: "started"
  },
  {
    courseTitle: "Unit 2 - Bài học: Chào hỏi",
    courseImage: "/modal/course2.png",
    courseWeek: "Tuần học 2",
    courseCategory: "3 - 4 tuổi",
    courseName: "Giới thiệu bản thân",
    courseProgress: 100,
    courseLike: 568,
    courseStatus: "started"
  },
  {
    courseTitle: "Unit 3 - Bài học: Màu sắc",
    courseImage: "/modal/course3.png",
    courseWeek: "Tuần học 3",
    courseCategory: "3 - 4 tuổi",
    courseName: "Khám phá các màu sắc",
    courseProgress: 100,
    courseLike: 86,
    courseStatus: "started"
  },
  {
    courseTitle: "Unit 4 - Bài học: Từ vựng",
    courseImage: "/modal/course4.png",
    courseWeek: "Tuần học 1",
    courseCategory: "3 - 4 tuổi",
    courseName: "Bảng chữ cái tiếng anh",
    courseProgress: 100,
    courseLike: 638,
    courseStatus: "started"
  }
];

function BaiGiangHoanThanhPage() {
  return (
    <ContentLayout title="BaiGiangHoanThanh">
      <p className="text-[#736E6E] text-md ml-8">
        Đã hoàn thành <span className="text-[#3EC474]">3</span>/68 bài học
      </p>
      <div className="bg-white px-5 py-2 relative rounded-xl">
        <div className="flex gap-20 absolute top-0 right-[12%]">
          <Image src="/rank.gif" alt="rank" width={40} height={40} />
          <Image src="/rank.gif" alt="rank" width={40} height={40} />
        </div>
        <div className="flex items-center gap-8">
          <SectionTitle
            title="Bài giảng hoàn thành"
            image={{
              src: "/assets/gif/book_animate.gif",
              width: 40,
              height: 40,
              alt: "book_animate"
            }}
            wrapperClassName="border-[#3EC474]"
          />
          {/* <FilterFacet /> */}
        </div>

        <PaginatedContent
          items={courseData}
          itemsPerPage={8}
          renderItem={(courseItem) => <CourseCard {...courseItem} />}
        />
      </div>
    </ContentLayout>
  );
}

export default BaiGiangHoanThanhPage;
