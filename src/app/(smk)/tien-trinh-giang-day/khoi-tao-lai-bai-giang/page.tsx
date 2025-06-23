"use client";

import React, { useEffect, useState } from "react";
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
import CourseCard from "@/components/course-card/course-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn, formatProgress } from "@/lib/utils";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-cards";
import { LessonService } from "@/services/lesson.service";
import { useSession } from "next-auth/react";
import { LessonType } from "@/types/lesson";
import { resetLessonProgress } from "@/actions/resetLessonAction";

// const courseData = [
//   {
//     courseTitle: "Unit 1 - Bài học: Từ vựng1",
//     courseImage: "/modal/course1.png",
//     courseWeek: "Tuần học 1",
//     courseCategory: "3 - 4 tuổi",
//     courseName: "Bảng chữ cái tiếng anh",
//     courseProgress: 100,
//     courseLike: 668,
//     courseStatus: "started"
//   },
//   {
//     courseTitle: "Unit 2 - Bài học: Chào hỏi2",
//     courseImage: "/modal/course2.png",
//     courseWeek: "Tuần học 2",
//     courseCategory: "3 - 4 tuổi",
//     courseName: "Giới thiệu bản thân",
//     courseProgress: 100,
//     courseLike: 568,
//     courseStatus: "started"
//   },
//   {
//     courseTitle: "Unit 3 - Bài học: Màu sắc3",
//     courseImage: "/modal/course3.png",
//     courseWeek: "Tuần học 3",
//     courseCategory: "3 - 4 tuổi",
//     courseName: "Khám phá các màu sắc",
//     courseProgress: 100,
//     courseLike: 86,
//     courseStatus: "started"
//   },
//   {
//     courseTitle: "Unit 4 - Bài học: Từ vựng4",
//     courseImage: "/modal/course4.png",
//     courseWeek: "Tuần học 1",
//     courseCategory: "3 - 4 tuổi",
//     courseName: "Bảng chữ cái tiếng anh",
//     courseProgress: 100,
//     courseLike: 638,
//     courseStatus: "started"
//   },
//   {
//     courseTitle: "Unit 1 - Bài học: Từ vựng5",
//     courseImage: "/modal/course1.png",
//     courseWeek: "Tuần học 1",
//     courseCategory: "3 - 4 tuổi",
//     courseName: "Bảng chữ cái tiếng anh",
//     courseProgress: 100,
//     courseLike: 668,
//     courseStatus: "started"
//   },
//   {
//     courseTitle: "Unit 2 - Bài học: Chào hỏi6",
//     courseImage: "/modal/course2.png",
//     courseWeek: "Tuần học 2",
//     courseCategory: "3 - 4 tuổi",
//     courseName: "Giới thiệu bản thân",
//     courseProgress: 100,
//     courseLike: 568,
//     courseStatus: "started"
//   },
//   {
//     courseTitle: "Unit 3 - Bài học: Màu sắc7",
//     courseImage: "/modal/course3.png",
//     courseWeek: "Tuần học 3",
//     courseCategory: "3 - 4 tuổi",
//     courseName: "Khám phá các màu sắc",
//     courseProgress: 100,
//     courseLike: 86,
//     courseStatus: "started"
//   },
//   {
//     courseTitle: "Unit 4 - Bài học: Từ vựng8",
//     courseImage: "/modal/course4.png",
//     courseWeek: "Tuần học 1",
//     courseCategory: "3 - 4 tuổi",
//     courseName: "Bảng chữ cái tiếng anh",
//     courseProgress: 100,
//     courseLike: 638,
//     courseStatus: "started"
//   },
//   {
//     courseTitle: "Unit 1 - Bài học: Từ vựng9",
//     courseImage: "/modal/course1.png",
//     courseWeek: "Tuần học 1",
//     courseCategory: "3 - 4 tuổi",
//     courseName: "Bảng chữ cái tiếng anh",
//     courseProgress: 100,
//     courseLike: 668,
//     courseStatus: "started"
//   },
//   {
//     courseTitle: "Unit 2 - Bài học: Chào hỏi10",
//     courseImage: "/modal/course2.png",
//     courseWeek: "Tuần học 2",
//     courseCategory: "3 - 4 tuổi",
//     courseName: "Giới thiệu bản thân",
//     courseProgress: 100,
//     courseLike: 568,
//     courseStatus: "started"
//   },
//   {
//     courseTitle: "Unit 3 - Bài học: Màu sắc11",
//     courseImage: "/modal/course3.png",
//     courseWeek: "Tuần học 3",
//     courseCategory: "3 - 4 tuổi",
//     courseName: "Khám phá các màu sắc",
//     courseProgress: 100,
//     courseLike: 86,
//     courseStatus: "started"
//   },
//   {
//     courseTitle: "Unit 4 - Bài học: Từ vựng12",
//     courseImage: "/modal/course4.png",
//     courseWeek: "Tuần học 1",
//     courseCategory: "3 - 4 tuổi",
//     courseName: "Bảng chữ cái tiếng anh",
//     courseProgress: 100,
//     courseLike: 638,
//     courseStatus: "started"
//   }
// ];

function KhoiTaoLaiBaiGiangPage() {
  const [selectedCourses, setSelectedCourses] = useState<any[]>([]);
  const [lessonData, setLessonData] = useState<any[]>([]);
  const [isResetting, setIsResetting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const {data: session} = useSession();

  console.log("sessionKhoiTao", session);

  const handleSelectCourse = (course: any) => {
    setSelectedCourses((prev) => {
      const isSelected = prev.some(
        (item) => item.id === course.id || item.lessonId === course.lessonId
      );
      if (isSelected) {
        return prev.filter((item) => item.id !== course.id && item.lessonId !== course.lessonId);
      }
      return [...prev, course];
    });
  };

  const handleSelectAll = () => {
    if (selectedCourses.length === lessonData.length) {
      setSelectedCourses([]);
    } else {
      setSelectedCourses([...lessonData]);
    }
  };

  const handleResetProgress = async () => {
    if (!session?.user?.userId || selectedCourses.length === 0) {
      alert('Vui lòng chọn ít nhất một bài giảng để khởi tạo lại!');
      return;
    }

    setIsResetting(true);
    
    try {
      // Extract lesson IDs from selected courses
      const lessonIds = selectedCourses.map(course => 
        parseInt(course.lessonId) || parseInt(course.id)
      ).filter(id => !isNaN(id));

      if (lessonIds.length === 0) {
        alert('Không thể lấy ID của các bài giảng đã chọn!');
        return;
      }

      console.log('Resetting lessons:', lessonIds);
      
      const result = await resetLessonProgress(session.user.userId, lessonIds);
      
      if (result.success) {
        alert(`Đã khởi tạo lại thành công ${selectedCourses.length} bài giảng!`);
        
        // Clear selections after successful reset
        setSelectedCourses([]);
        
        // Refresh lesson data
        const lessonService = await LessonService.lessonCompleteData(session.user.userId);
        setLessonData(mappingCourseData(lessonService.completeLessons));
        
      } else {
        alert(result.error || 'Có lỗi xảy ra khi khởi tạo lại tiến trình!');
      }
    } catch (error) {
      console.error('Reset progress error:', error);
      alert('Có lỗi xảy ra khi khởi tạo lại tiến trình!');
    } finally {
      setIsResetting(false);
    }
  };

  const mappingCourseData = (courseData: LessonType[]) => {
    return courseData.map((course, index) => ({
      ...course,
      id: course.lessonId || `lesson-${index}`,
      courseTitle: course.lessonName,
      courseImage: course.imageUrl,
      courseWeek: `Tuần học ${course.schoolWeek}`,
      courseCategory: course.className,
      courseLike: course.numLiked,
      courseProgress: formatProgress(course.progress),
      courseName: course.lessonName,
      courseStatus: course.progress === 1 ? "started" : "not_started"
    }));
  }

  useEffect(() => {
    const fetchLessonData = async () => {
      if (!session?.user?.userId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const lessonService = await LessonService.lessonCompleteData(session.user.userId);
        console.log("lessonService.completeLessons", lessonService.completeLessons);
        setLessonData(mappingCourseData(lessonService.completeLessons));
      } catch (error) {
        console.error("Error fetching lesson data:", error);
        setLessonData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLessonData();
  }, [session]);



  return (
    <ContentLayout title="KhoiTaoLaiBaiGiang">
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
          <div className="w-full lg:w-1/3 flex flex-col gap-6">
            {/* Back Icon với container đẹp */}
            <div className="flex justify-start">
              <div className="group relative p-2 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 cursor-pointer">
                <BackIcon width={28} height={28} />
              </div>
            </div>

            {/* Main content area */}
            <div className="flex flex-col gap-5">
              {/* Preview container với enhanced styling */}
              <div className="relative mx-auto">
                {/* Content container */}
                <div className="relative bg-white rounded-2xl border-2 border-gray-200 w-full max-w-sm h-80 lg:h-96 flex items-center justify-center gap-4 flex-col p-6 shadow-lg transition-all duration-300 mx-auto">
                  {selectedCourses.length > 0 ? (
                    <div className="w-full h-full">
                      <Swiper
                        effect={"cards"}
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
                    <div className="flex flex-col items-center justify-center gap-4 text-center">
                      {/* Icon container với animation */}
                      <div className="relative">
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                          <RightHandIcon width={40} height={40} />
                        </div>
                        <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-30"></div>
                      </div>
                      
                      {/* Text với styling đẹp */}
                      <div className="space-y-1">
                        <p className="text-base font-medium text-gray-700">
                          Chưa có bài giảng nào được chọn
                        </p>
                        <p className="text-sm text-gray-500">
                          Hãy chọn bài giảng từ danh sách bên phải để xem trước
                        </p>
                      </div>
                      
                      {/* Decorative dots */}
                      <div className="flex gap-1.5 mt-2">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Selection count badge */}
                {selectedCourses.length > 0 && (
                  <div className="absolute -top-2 -right-2 z-10">
                    <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-lg">
                      {selectedCourses.length}
                    </div>
                  </div>
                )}
              </div>

              {/* Action button với enhanced styling */}
              <div className="space-y-2 max-w-sm mx-auto w-full">
                <Button 
                  className={cn(
                    "w-full h-12 rounded-xl font-medium transition-all duration-300 shadow-md relative overflow-hidden",
                    selectedCourses.length === 0 || isResetting
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed hover:bg-gray-200" 
                      : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200 hover:shadow-lg"
                  )}
                  disabled={selectedCourses.length === 0 || isResetting}
                  onClick={handleResetProgress}
                >
                  <div className="flex items-center justify-center gap-2">
                    {isResetting ? (
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                      </svg>
                    )}
                    <span>
                      {isResetting 
                        ? `Đang khởi tạo lại... (${selectedCourses.length})`
                        : `Khởi tạo lại bài giảng (${selectedCourses.length})`
                      }
                    </span>
                  </div>
                </Button>

                {/* Helper text */}
                <p className="text-xs text-gray-500 text-center">
                  {isResetting 
                    ? "Đang xử lý, vui lòng chờ..."
                    : selectedCourses.length === 0 
                      ? "Vui lòng chọn ít nhất một bài giảng để tiếp tục"
                      : `Đã chọn ${selectedCourses.length} bài giảng để khởi tạo lại`
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Phần bên phải */}
          <div className="w-full lg:w-2/3">
            <div className="flex flex-col gap-6">
              {/* Khu vực chính */}
              <div className="bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50 rounded-2xl border-2 border-blue-100 shadow-lg overflow-hidden">
                {/* Header với thống kê, select và nút chọn tất cả */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-6">
                  {/* Row 1: Title và Select */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <h3 className="text-lg font-semibold text-white">
                        Chọn danh sách bài giảng
                      </h3>
                    </div>
                    
                    <Select defaultValue="1">
                      <SelectTrigger className="w-full sm:w-[320px] h-10 bg-white border-0 rounded-lg shadow-sm hover:shadow-md transition-all">
                        <SelectValue placeholder="Chọn danh sách..." />
                      </SelectTrigger>
                      <SelectContent className="rounded-lg border-0 shadow-xl">
                        <SelectGroup>
                          <SelectItem value="1" className="rounded-md">
                            📚 Danh sách bài giảng đã hoàn thành
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Row 2: Thống kê và Controls */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-4 text-white">
                      <div className="bg-white/20 p-2 rounded-lg">
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold">Tổng số bài giảng</p>
                        <p className="text-blue-100 text-sm">
                          {lessonData.length} bài giảng có sẵn
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-white border border-white/20">
                        <span className="font-medium">Đã chọn:</span>
                        <span className="ml-2 bg-white text-blue-600 px-2 py-0.5 rounded-full text-xs font-bold">
                          {selectedCourses.length}
                        </span>
                      </div>
                      <Button
                        className={cn(
                          "group relative overflow-hidden font-medium px-8 py-3 rounded-2xl transition-all duration-300 shadow-lg transform hover:scale-105",
                          selectedCourses.length === lessonData.length
                            ? "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-red-300/50"
                            : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-emerald-300/50"
                        )}
                        onClick={handleSelectAll}
                      >
                        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12"></div>
                        <div className="relative flex items-center">
                          {selectedCourses.length === lessonData.length ? (
                            <>
                              <svg
                                className="w-5 h-5 mr-2"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Bỏ chọn tất cả
                            </>
                          ) : (
                            <>
                              <svg
                                className="w-5 h-5 mr-2"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Chọn tất cả
                            </>
                          )}
                        </div>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Danh sách bài giảng */}
                <div className="p-6 overflow-visible">
                  <ScrollArea className="h-[60vh] overflow-visible">
                    <div className="flex flex-col gap-4 px-2 py-2">
                      {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          </div>
                          <p className="text-gray-600 font-medium">Đang tải danh sách bài giảng...</p>
                          <p className="text-sm text-gray-400 mt-1">Vui lòng chờ trong giây lát</p>
                        </div>
                      ) : lessonData.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <p className="text-gray-600 font-medium">Chưa có bài giảng nào được hoàn thành</p>
                          <p className="text-sm text-gray-400 mt-1">Hãy hoàn thành một số bài giảng trước để có thể khởi tạo lại</p>
                        </div>
                      ) : (
                        lessonData.map((courseItem, index) => (
                          <div
                            key={index}
                            className={cn(
                              "group relative cursor-pointer rounded-xl border-2 transition-all duration-300 hover:scale-[1.01] hover:-translate-y-0.5",
                              selectedCourses.some(
                                (item) =>
                                  item.id === courseItem.id || item.lessonId === courseItem.lessonId
                              )
                                ? "border-emerald-400 bg-gradient-to-r from-emerald-50 to-teal-50 shadow-lg shadow-emerald-200/30"
                                : "border-gray-200 bg-white hover:border-emerald-200 hover:shadow-md"
                            )}
                            onClick={() => handleSelectCourse(courseItem)}
                          >
                            {/* Selection State Indicator */}
                            <div
                              className={cn(
                                "absolute top-3 left-3 z-[5] w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-300",
                                selectedCourses.some(
                                  (item) =>
                                    item.id === courseItem.id || item.lessonId === courseItem.lessonId
                                )
                                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 scale-100 shadow-sm"
                                  : "bg-gray-200 scale-90 group-hover:bg-emerald-200 group-hover:scale-100"
                              )}
                            >
                              {selectedCourses.some(
                                (item) =>
                                  item.id === courseItem.id || item.lessonId === courseItem.lessonId
                              ) ? (
                                <svg
                                  className="w-3.5 h-3.5 text-white"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              ) : (
                                <div className="w-2 h-2 rounded-sm bg-white group-hover:bg-emerald-500 transition-colors duration-200"></div>
                              )}
                            </div>

                            {/* Selection Badge */}
                            {selectedCourses.some(
                              (item) =>
                                item.id === courseItem.id || item.lessonId === courseItem.lessonId
                            ) && (
                              <div className="absolute top-3 right-3 z-[5]">
                                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-2 py-1 rounded-lg text-xs font-medium shadow-sm">
                                  <span className="flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Đã chọn
                                  </span>
                                </div>
                              </div>
                            )}

                            {/* Course Card */}
                            <div className="p-5 pt-10 relative z-[1]">
                              <CourseCard
                                {...courseItem}
                                horizontal
                                className={cn(
                                  "w-full border-0 shadow-none bg-transparent transition-all duration-300",
                                  selectedCourses.some(
                                    (item) =>
                                      item.id === courseItem.id || item.lessonId === courseItem.lessonId
                                  )
                                    ? "opacity-100"
                                    : "group-hover:opacity-95"
                                )}
                              />
                            </div>

                            {/* Subtle glow effect for selected items */}
                            {selectedCourses.some(
                              (item) =>
                                item.id === courseItem.id || item.lessonId === courseItem.lessonId
                            ) && (
                              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-400/5 via-emerald-400/10 to-teal-400/5"></div>
                            )}

                            {/* Hover glow effect */}
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-400/0 via-emerald-400/5 to-teal-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CourseWrapper>
    </ContentLayout>
  );
}

export default KhoiTaoLaiBaiGiangPage;
