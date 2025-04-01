"use client"

import React, { Fragment, useState } from "react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import SectionTitle from "@/components/common/section-title";
import CourseWrapper from "@/components/common/course-wrapper";
import BackIcon from "@/components/icon/back-icon";
import RightHandIcon from "@/components/icon/right-hand-icon";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import FilterFacet from "@/components/common/filter-facet";
import CourseCard from "@/components/course-card/course-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-cards';

// Thêm CSS tùy chỉnh
const swiperStyles = {
  '.swiper': {
    width: '100%',
    height: '100%',
  },
  '.swiper-slide': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '18px',
    fontSize: '22px',
    fontWeight: 'bold',
    backgroundColor: '#fff',
  }
};

const courseData = [
  {
    courseTitle: "Unit 1 - Bài học: Từ vựng1",
    courseImage: "/modal/course1.png",
    courseWeek: "Tuần học 1",
    courseCategory: "3 - 4 tuổi",
    courseName: "Bảng chữ cái tiếng anh",
    courseProgress: 100,
    courseLike: 668,
    courseStatus: "started"
  },
  {
    courseTitle: "Unit 2 - Bài học: Chào hỏi2",
    courseImage: "/modal/course2.png",
    courseWeek: "Tuần học 2",
    courseCategory: "3 - 4 tuổi",
    courseName: "Giới thiệu bản thân",
    courseProgress: 100,
    courseLike: 568,
    courseStatus: "started"
  },
  {
    courseTitle: "Unit 3 - Bài học: Màu sắc3",
    courseImage: "/modal/course3.png",
    courseWeek: "Tuần học 3",
    courseCategory: "3 - 4 tuổi",
    courseName: "Khám phá các màu sắc",
    courseProgress: 100,
    courseLike: 86,
    courseStatus: "started"
  },
  {
    courseTitle: "Unit 4 - Bài học: Từ vựng4",
    courseImage: "/modal/course4.png",
    courseWeek: "Tuần học 1",
    courseCategory: "3 - 4 tuổi",
    courseName: "Bảng chữ cái tiếng anh",
    courseProgress: 100,
    courseLike: 638,
    courseStatus: "started"
  },
  {
    courseTitle: "Unit 1 - Bài học: Từ vựng5",
    courseImage: "/modal/course1.png",
    courseWeek: "Tuần học 1",
    courseCategory: "3 - 4 tuổi",
    courseName: "Bảng chữ cái tiếng anh",
    courseProgress: 100,
    courseLike: 668,
    courseStatus: "started"
  },
  {
    courseTitle: "Unit 2 - Bài học: Chào hỏi6",
    courseImage: "/modal/course2.png",
    courseWeek: "Tuần học 2",
    courseCategory: "3 - 4 tuổi",
    courseName: "Giới thiệu bản thân",
    courseProgress: 100,
    courseLike: 568,
    courseStatus: "started"
  },
  {
    courseTitle: "Unit 3 - Bài học: Màu sắc7",
    courseImage: "/modal/course3.png",
    courseWeek: "Tuần học 3",
    courseCategory: "3 - 4 tuổi",
    courseName: "Khám phá các màu sắc",
    courseProgress: 100,
    courseLike: 86,
    courseStatus: "started"
  },
  {
    courseTitle: "Unit 4 - Bài học: Từ vựng8",
    courseImage: "/modal/course4.png",
    courseWeek: "Tuần học 1",
    courseCategory: "3 - 4 tuổi",
    courseName: "Bảng chữ cái tiếng anh",
    courseProgress: 100,
    courseLike: 638,
    courseStatus: "started"
  },
  {
    courseTitle: "Unit 1 - Bài học: Từ vựng9",
    courseImage: "/modal/course1.png",
    courseWeek: "Tuần học 1",
    courseCategory: "3 - 4 tuổi",
    courseName: "Bảng chữ cái tiếng anh",
    courseProgress: 100,
    courseLike: 668,
    courseStatus: "started"
  },
  {
    courseTitle: "Unit 2 - Bài học: Chào hỏi10",
    courseImage: "/modal/course2.png",
    courseWeek: "Tuần học 2",
    courseCategory: "3 - 4 tuổi",
    courseName: "Giới thiệu bản thân",
    courseProgress: 100,
    courseLike: 568,
    courseStatus: "started"
  },
  {
    courseTitle: "Unit 3 - Bài học: Màu sắc11",
    courseImage: "/modal/course3.png",
    courseWeek: "Tuần học 3",
    courseCategory: "3 - 4 tuổi",
    courseName: "Khám phá các màu sắc",
    courseProgress: 100,
    courseLike: 86,
    courseStatus: "started"
  },
  {
    courseTitle: "Unit 4 - Bài học: Từ vựng12",
    courseImage: "/modal/course4.png",
    courseWeek: "Tuần học 1",
    courseCategory: "3 - 4 tuổi",
    courseName: "Bảng chữ cái tiếng anh",
    courseProgress: 100,
    courseLike: 638,
    courseStatus: "started"
  }
];

function KhoiTaoLaiBaiGiangPage() {
  const [selectedCourses, setSelectedCourses] = useState<any[]>([]);

  const handleSelectCourse = (course: any) => {
    setSelectedCourses(prev => {
      const isSelected = prev.some(item => item.courseTitle === course.courseTitle);
      if (isSelected) {
        return prev.filter(item => item.courseTitle !== course.courseTitle);
      }
      return [...prev, course];
    });
  };

  const handleSelectAll = () => {
    if (selectedCourses.length === courseData.length) {
      setSelectedCourses([]);
    } else {
      setSelectedCourses([...courseData]);
    }
  };

  return (
    <ContentLayout title="BaiGiangHoanThanh">
      <CourseWrapper>
        <SectionTitle
          title="Khởi tạo lại bài giảng"
          image={{
            src: "/replay_icon.png",
            width: 40,
            height: 40,
            alt: "replay_icon"
          }}
          wrapperClassName="border-[#D84C97] w-full sm:w-[15vw]"
        />

        <div className="flex flex-col lg:flex-row my-10 gap-10 w-full">
          {/* Phần bên trái */}
          <div className="w-full lg:w-1/3 flex flex-col lg:flex-row gap-5">
            <BackIcon width={35} height={35} />
            <div className="flex flex-col gap-5 flex-1 px-4">
              <div className="border border-black rounded-2xl bg-white w-full  2xl:w-80 2xl:h-80 flex items-center justify-center gap-4 flex-col p-4 transition-all duration-300">
                {selectedCourses.length > 0 ? (
                  <div className="w-full h-full">
                    <Swiper
                      effect={'cards'}
                      grabCursor={true}
                      modules={[EffectCards]}
                      className="mySwiper h-full"
                    >
                      {selectedCourses.map((course, index) => (
                        <SwiperSlide key={index}>
                          <CourseCard {...course} className="w-full h-full" />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                ) : (
                  <>
                    <p className="text-center px-12 text-[#736E6E]">
                      Chọn bài giảng trong danh sách bài giảng
                    </p>
                    <RightHandIcon width={80} height={80} />
                  </>
                )}
              </div>
              <Button 
                className="bg-[#4079CE] hover:bg-[#4079CE]/80 lg:w-80"
                disabled={selectedCourses.length === 0}
              >
                Khởi tạo lại bài giảng ({selectedCourses.length})
              </Button>
            </div>
          </div>

          {/* Phần bên phải */}
          <div className="w-full lg:w-2/3">
            <div className="flex flex-col gap-3">
              <Select defaultValue="1">
                <SelectTrigger className="w-full lg:w-[20vw]">
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="1">
                      Danh sách bài giảng đã hoàn thành
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              <div className="bg-[#FEFAFA] py-5 px-2 border border-black rounded-lg h-[50vh] flex flex-col gap-5 lg:gap-8">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-10 px-2 sm:px-10">
                  {/* <FilterFacet /> */}
                  <Button 
                    className={`bg-[#D1F3B1] hover:bg-[#D1F3B1]/80 text-black w-full sm:w-auto ${selectedCourses.length === courseData.length ? "bg-red-500 text-white hover:bg-red-500/80" : ""}`}
                    onClick={handleSelectAll}
                  >
                    {selectedCourses.length === courseData.length ? "Bỏ chọn tất cả" : "Chọn tất cả"}
                  </Button>
                </div>

                <ScrollArea className="h-3/4 px-2 lg:px-[40px]">
                  <div className="flex flex-col gap-5">
                    {courseData.map((courseItem, index) => (
                      <div key={index} className="flex items-center gap-2 w-full">
                        <div className="w-6 h-6 flex items-center justify-center">
                          <input
                            type="checkbox"
                            checked={selectedCourses.some(item => item.courseTitle === courseItem.courseTitle)}
                            onChange={() => handleSelectCourse(courseItem)}
                            className="w-4 h-4"
                          />
                        </div>
                        <CourseCard
                          {...courseItem}
                          horizontal
                          onClick={() => handleSelectCourse(courseItem)}
                          className={cn(
                            "w-full",
                            selectedCourses.some(item => item.courseTitle === courseItem.courseTitle) 
                              ? "border-2 border-[#4079CE]" 
                              : ""
                          )}
                        />
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
        </div>
      </CourseWrapper>
    </ContentLayout>
  );
}

export default KhoiTaoLaiBaiGiangPage;
