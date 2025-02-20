"use client"

import React, { useState } from "react";
import Image from "next/image";
import { BreadcrumbLayout } from "@/components/admin-panel/breadcrumb-layout";
import CourseDesCard from "@/components/course-card/course-des";
import { useRouter } from "next/navigation";

const courseData = [
  {
    courseImage: "/modal/course1.png",
    courseName: "Lớp nhà trẻ",
    courseDescription:
      "Khóa học được thiết kế một cách khoa học và sinh động, giúp các con tiếp cận tiếng Anh một cách tự nhiên và hiệu quả. Nội dung chính xoay quanh các hoạt động giúp các con làm quen với ngôn ngữ, phát triển 4 kỹ năng Nghe - Nói - Đọc - Viết",
    courseProgress: 100,
    courseLike: 668,
    courseStatus: "started"
  },
  {
    courseImage: "/modal/course1.png",
    courseName: "Lớp 3 - 4 tuổi",
    courseDescription:
      "Khóa học được thiết kế một cách khoa học và sinh động, giúp các con tiếp cận tiếng Anh một cách tự nhiên và hiệu quả. Nội dung chính xoay quanh các hoạt động giúp các con làm quen với ngôn ngữ, phát triển 4 kỹ năng Nghe - Nói - Đọc - Viết",
    courseProgress: 100,
    courseLike: 668,
    courseStatus: "started"
  },
  {
    courseImage: "/modal/course1.png",
    courseName: "Lớp 4 - 5 tuổi",
    courseDescription:
      "Khóa học được thiết kế một cách khoa học và sinh động, giúp các con tiếp cận tiếng Anh một cách tự nhiên và hiệu quả. Nội dung chính xoay quanh các hoạt động giúp các con làm quen với ngôn ngữ, phát triển 4 kỹ năng Nghe - Nói - Đọc - Viết",
    courseProgress: 100,
    courseLike: 668,
    courseStatus: "started"
  },
  {
    courseImage: "/modal/course1.png",
    courseName: "Lớp 5 - 6 tuổi",
    courseDescription:
      "Khóa học được thiết kế một cách khoa học và sinh động, giúp các con tiếp cận tiếng Anh một cách tự nhiên và hiệu quả. Nội dung chính xoay quanh các hoạt động giúp các con làm quen với ngôn ngữ, phát triển 4 kỹ năng Nghe - Nói - Đọc - Viết",
    courseProgress: 100,
    courseLike: 668,
    courseStatus: "started"
  }
];

const naviagtionList = [
  {
    label: "Lớp nhà trẻ",
    href: "/lop-hoc/lop-nha-tre"
  },
  {
    label: "Lớp 3 - 4 tuổi",
    href: "/lop-hoc/lop-3-4-tuoi"
  },
  {
    label: "Lớp 4 - 5 tuổi",
    href: "/lop-hoc/lop-4-5-tuoi"
  },
  {
    label: "Lớp 5 - 6 tuổi",
    href: "/lop-hoc/lop-5-6-tuoi"
  }
]

function LopHocPage() {
  const router = useRouter();
  const [selectedTitle, setSelectedTitle] = useState("Lớp học");

  const handleCourseClick = (index: number) => {
    // setSelectedTitle(naviagtionList[index].label);
    router.push(naviagtionList[index].href);
  };

  return (
    <BreadcrumbLayout title="Lớp học">
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-5">
          <Image
            src="/book_multi.png"
            alt="chong_sach"
            width={40}
            height={40}
          />
          <p className="text-[#555] text-[20px] font-bold">Danh sách lớp học</p>
        </div>
        <div className="bg-white py-10 px-5 rounded-2xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {courseData.map((courseItem, index) => (
            <div key={index}>
              <CourseDesCard
                {...courseItem}
                className="w-full"
                onClick={() => handleCourseClick(index)}
              />
            </div>
          ))}
        </div>
      </div>
    </BreadcrumbLayout>
  );
}

export default LopHocPage;
