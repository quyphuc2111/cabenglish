"use client"
import React, { useState } from "react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LessonType } from "@/types/lesson";
import LessonCard from "@/components/lesson/lesson-card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

import "swiper/css";
import "swiper/css/navigation";
import { useRouter } from "next/navigation";

// Mock data đã được loại bỏ - sử dụng data thực từ service

interface LessonTeachingClientProps {
    teachingLessons: LessonType[];
    upcomingLessons: LessonType[];
    classroomData: any[];
}
  
function LessonTeachingClient({ teachingLessons, upcomingLessons, classroomData }: LessonTeachingClientProps) {
  const [selectedClassroom, setSelectedClassroom] = useState<string>("all");
  const [currentSwiper, setCurrentSwiper] = useState<any>(null);
  const [nextSwiper, setNextSwiper] = useState<any>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [nextSlideIndex, setNextSlideIndex] = useState<number>(0);
  const router = useRouter();

  // Filter data theo classroom được chọn
  const getFilteredDataByClassroom = (data: any[]) => {
    return data.filter((course) => {
      if (!selectedClassroom || selectedClassroom === "all") return true;
      return course.classId === parseInt(selectedClassroom);
    });
  };

  // Lọc bài giảng đang dạy
  const filteredTeachingLessons = getFilteredDataByClassroom(teachingLessons || [])
    .sort((a, b) => {
      if (a.classId !== b.classId) return a.classId - b.classId;
      if (a.unitId !== b.unitId) return a.unitId - b.unitId;
      return a.lessonId - b.lessonId;
    });

  // Lọc bài giảng tiếp theo
  const filteredUpcomingLessons = getFilteredDataByClassroom(upcomingLessons || [])
    .sort((a, b) => {
      if (a.classId !== b.classId) return a.classId - b.classId;
      if (a.unitId !== b.unitId) return a.unitId - b.unitId;
      return a.lessonId - b.lessonId;
    });

  return (
    <ContentLayout title="BaiGiangDangDay">
      <div className="flex gap-8 flex-col">
        {/* Thanh lọc */}
        <div className="bg-white rounded-xl p-6">
          <div className="w-full sm:w-auto min-w-[280px]">
            <Select
              value={selectedClassroom}
              onValueChange={setSelectedClassroom}
            >
              <SelectTrigger className="w-full bg-white/80 backdrop-blur-sm border-2 border-purple-200 hover:border-purple-300 rounded-xl h-12 px-4">
                <SelectValue placeholder="🏫 Chọn lớp học" />
              </SelectTrigger>
              <SelectContent className="bg-white/95 backdrop-blur-sm border-purple-200">
                <SelectGroup>
                  <SelectItem value="all" className="text-gray-600">
                    📚 Tất cả lớp học
                  </SelectItem>
                  {(classroomData || []).map((classroom) => (
                    <SelectItem
                      key={classroom.class_id}
                      value={classroom.class_id.toString()}
                      className="py-3"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                        {classroom.classname}
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col">
          {/* Bài giảng đang dạy */}
          <div className="bg-white rounded-xl p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <Image
                  src="/assets/gif/book_animate.gif"
                  alt="book_animate"
                  width={40}
                  height={40}
                 
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  Bài giảng đang dạy
                </h3>
                <p className="text-sm text-gray-600">Các bài học hiện tại</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 rounded-2xl p-6">
              {filteredTeachingLessons.length > 0 ? (
                <div className="relative">
                  <Swiper
                    onSwiper={setCurrentSwiper}
                    onSlideChange={(swiper) =>
                      setCurrentSlideIndex(swiper.activeIndex)
                    }
                    modules={[Navigation, Autoplay]}
                    spaceBetween={20}
                    slidesPerView={5}
                    slidesPerGroup={5}
                    autoplay={{
                      delay: 4000,
                      disableOnInteraction: false,
                      pauseOnMouseEnter: true
                    }}
                    breakpoints={{
                      320: {
                        slidesPerView: 1,
                        slidesPerGroup: 1,
                      },
                      640: {
                        slidesPerView: 2,
                        slidesPerGroup: 2,
                      },
                      768: {
                        slidesPerView: 3,
                        slidesPerGroup: 3,
                      },
                      1024: {
                        slidesPerView: 4,
                        slidesPerGroup: 4,
                      },
                      1280: {
                        slidesPerView: 5,
                        slidesPerGroup: 5,
                      },
                    }}
                    className="teaching-lessons-swiper"
                  >
                    {filteredTeachingLessons.map((lesson, index) => {
                      const customLesson = {
                        ...lesson,
                        classRoomName: lesson.className
                      };
                      return (
                        <SwiperSlide key={index}>
                          <LessonCard
                            {...customLesson}
                            className="transform hover:scale-[1.02] transition-all duration-300"
                            onClick={() => !lesson.isLocked && router.push(`/lesson/${lesson.lessonId}`)}
                          />
                        </SwiperSlide>
                      );
                    })}
                  </Swiper>

                  {filteredTeachingLessons.length > 5 && (
                    <div className="flex items-center justify-center gap-3 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-10 h-10 rounded-full bg-white/80 border-purple-200 hover:border-purple-300 hover:bg-purple-50"
                        onClick={() => currentSwiper?.slidePrev()}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <div className="flex gap-2">
                        {Array.from({ 
                          length: Math.ceil(filteredTeachingLessons.length / 5) 
                        }).map((_, idx) => (
                            <div
                              key={idx}
                              className={cn(
                                "w-2 h-2 rounded-full cursor-pointer transition-all duration-300",
                                Math.floor(currentSlideIndex / 5) === idx
                                  ? "bg-purple-500 scale-125"
                                  : "bg-purple-300 hover:bg-purple-400"
                              )}
                              onClick={() => {
                                currentSwiper?.slideTo(idx * 5);
                                setCurrentSlideIndex(idx * 5);
                              }}
                            />
                          )
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-10 h-10 rounded-full bg-white/80 border-purple-200 hover:border-purple-300 hover:bg-purple-50"
                        onClick={() => currentSwiper?.slideNext()}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-4 py-12">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                    <Image
                      src="/assets/image/no_course.png"
                      alt="no-course"
                      width={40}
                      height={40}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600 font-medium">
                      Hiện tại chưa có bài học nào đang dạy!
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Hãy bắt đầu một bài học mới
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bài giảng tiếp theo */}
          <div className="bg-white rounded-xl p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                <Image
                  src="/assets/gif/book_animate.gif"
                  alt="book_animate"
                  width={40}
                  height={40}
                 
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  Bài giảng tiếp theo
                </h3>
                <p className="text-sm text-gray-600">Các bài học sắp tới</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-6">
              {filteredUpcomingLessons.length > 0 ? (
                <div className="relative">
                  <Swiper
                    onSwiper={setNextSwiper}
                    onSlideChange={(swiper) =>
                      setNextSlideIndex(swiper.activeIndex)
                    }
                    modules={[Navigation, Autoplay]}
                    spaceBetween={20}
                    slidesPerView={5}
                    slidesPerGroup={5}
                    autoplay={{
                      delay: 5000,
                      disableOnInteraction: false,
                      pauseOnMouseEnter: true
                    }}
                    breakpoints={{
                      320: {
                        slidesPerView: 1,
                        slidesPerGroup: 1,
                      },
                      640: {
                        slidesPerView: 2,
                        slidesPerGroup: 2,
                      },
                      768: {
                        slidesPerView: 3,
                        slidesPerGroup: 3,
                      },
                      1024: {
                        slidesPerView: 4,
                        slidesPerGroup: 4,
                      },
                      1280: {
                        slidesPerView: 5,
                        slidesPerGroup: 5,
                      },
                    }}
                    className="upcoming-lessons-swiper"
                  >
                    {filteredUpcomingLessons.map((lesson, index) => {
                      const customLesson = {
                        ...lesson,
                        classRoomName: lesson.className
                      };
                      return (
                        <SwiperSlide key={index}>
                          <LessonCard
                            {...customLesson}
                            className="transform hover:scale-[1.02] transition-all duration-300 opacity-80"
                            onClick={() => !lesson.isLocked && router.push(`/lesson/${lesson.lessonId}`)}
                          />
                        </SwiperSlide>
                      );
                    })}
                  </Swiper>

                  {filteredUpcomingLessons.length > 5 && (
                    <div className="flex items-center justify-center gap-3 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-10 h-10 rounded-full bg-white/80 border-blue-200 hover:border-blue-300 hover:bg-blue-50"
                        onClick={() => nextSwiper?.slidePrev()}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <div className="flex gap-2">
                        {Array.from({ 
                          length: Math.ceil(filteredUpcomingLessons.length / 5) 
                        }).map((_, idx) => (
                            <div
                              key={idx}
                              className={cn(
                                "w-2 h-2 rounded-full cursor-pointer transition-all duration-300",
                                Math.floor(nextSlideIndex / 5) === idx
                                  ? "bg-blue-500 scale-125"
                                  : "bg-blue-300 hover:bg-blue-400"
                              )}
                              onClick={() => {
                                nextSwiper?.slideTo(idx * 5);
                                setNextSlideIndex(idx * 5);
                              }}
                            />
                          )
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-10 h-10 rounded-full bg-white/80 border-blue-200 hover:border-blue-300 hover:bg-blue-50"
                        onClick={() => nextSwiper?.slideNext()}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-4 py-12">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                    <Image
                      src="/assets/gif/book_animate.gif"
                      alt="book_animate"
                      width={40}
                      height={40}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600 font-medium">
                      Chưa có bài học tiếp theo!
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Tất cả bài học đã hoàn thành
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ContentLayout>
  );
}

export default LessonTeachingClient;
