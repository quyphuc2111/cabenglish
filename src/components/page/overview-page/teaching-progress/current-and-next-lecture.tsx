import LessonCard from "@/components/lesson/lesson-card";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { Fragment, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

import "swiper/css";
import "swiper/css/navigation";

// const mockClassrooms = [
//   { id: "1", name: "Lớp mầm non A", slug: "mam-non-a" },
//   { id: "2", name: "Lớp mầm non B", slug: "mam-non-b" },
//   { id: "3", name: "Lớp 3-4 tuổi", slug: "lop-3-4-tuoi" },
//   { id: "4", name: "Lớp 4-5 tuổi", slug: "lop-4-5-tuoi" },
//   { id: "5", name: "Lớp 5-6 tuổi", slug: "lop-5-6-tuoi" }
// ];

function CurrentAndNextLecture({
  courseData,
  t,
  classroomData
}: {
  courseData: any[];
  t: any;
  classroomData: any[];
}) {
  const router = useRouter();
  const [selectedClassroom, setSelectedClassroom] = useState<string>("all");
  const [currentSwiper, setCurrentSwiper] = useState<any>(null);
  const [nextSwiper, setNextSwiper] = useState<any>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [nextSlideIndex, setNextSlideIndex] = useState<number>(0);

  console.log("courseDatacourseData", courseData);

  const handleLessonClick = async (lessonId: number) => {
    router.push(`/lesson/${lessonId}`);
  };

  // Filter courseData theo classroom được chọn
  const getFilteredDataByClassroom = (data: any[]) => {
    return data.filter((course) => {
      if (!selectedClassroom || selectedClassroom === "all") return true;
      return course.classId === selectedClassroom;
    });
  };

  console.log("getFilteredDataByClassroom(courseData)", getFilteredDataByClassroom(courseData));

  const filteredCourseData = getFilteredDataByClassroom(courseData)
    .filter(
      (course) =>
        course.progress < 1 &&
        course.progress > 0 &&
        !course.isLocked
    )
    .sort((a, b) => {
      if (a.classId !== b.classId) return a.classId - b.classId;
      if (a.unitId !== b.unitId) return a.unitId - b.unitId;
      return a.lessonOrder - b.lessonOrder;
    });

  const nextLectureData = getFilteredDataByClassroom(courseData)
    .filter((course) => course.progress === 0)
    .sort((a, b) => {
      if (a.classId !== b.classId) return a.classId - b.classId;
      if (a.unitId !== b.unitId) return a.unitId - b.unitId;
      return a.lessonOrder - b.lessonOrder;
    });

  return (
    <div className="relative w-full xl:w-1/2 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 opacity-90 rounded-xl sm:rounded-2xl lg:rounded-3xl" />
      <div className="absolute inset-0 bg-[url('/assets/bg-pattern.svg')] opacity-5" />

      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        <div className="mb-6 lg:mb-8">
          <div className="flex flex-col gap-4 mb-4 sm:mb-6">
            <div className="w-full">
              <Select
                value={selectedClassroom}
                onValueChange={setSelectedClassroom}
              >
                <SelectTrigger className="w-full bg-white/80 backdrop-blur-sm border-2 border-purple-200 hover:border-purple-300 rounded-lg sm:rounded-xl h-10 sm:h-12 px-3 sm:px-4 text-sm sm:text-base">
                  <SelectValue placeholder="🏫 Chọn lớp học" />
                </SelectTrigger>
                <SelectContent className="bg-white/95 backdrop-blur-sm border-purple-200">
                  <SelectGroup>
                    <SelectItem value="all" className="text-gray-600 text-sm sm:text-base">
                      📚 Tất cả lớp học
                    </SelectItem>
                    {classroomData.map((classroom) => (
                      <SelectItem
                        key={classroom.class_id}
                        value={classroom.class_id}
                        className="py-2 sm:py-3"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                          <span className="text-sm sm:text-base">{classroom.classname}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <Image
                  src="/book_light.png"
                  alt="book_light"
                  width={16}
                  height={16}
                  className="brightness-0 invert sm:w-5 sm:h-5"
                />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                  {t("lectureBeingTaught")}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">Bài giảng hiện tại</p>
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 shadow-lg">
              {filteredCourseData.length > 0 ? (
                <div className="relative">
                  <Swiper
                    onSwiper={setCurrentSwiper}
                    onSlideChange={(swiper) =>
                      setCurrentSlideIndex(swiper.activeIndex)
                    }
                    modules={[Navigation, Autoplay]}
                    spaceBetween={20}
                    slidesPerView={1}
                    autoplay={{
                      delay: 4000,
                      disableOnInteraction: false,
                      pauseOnMouseEnter: true
                    }}
                    className="current-lecture-swiper"
                  >
                    {filteredCourseData.map((courseItem, index) => {
                      const customCourse = {
                        ...courseItem,
                        classRoomName: courseItem.className
                      };
                      return (
                        <SwiperSlide key={index}>
                          <LessonCard
                            {...customCourse}
                            onClick={() =>
                              handleLessonClick(courseItem.lessonId)
                            }
                            className="transform hover:scale-[1.02] transition-all duration-300"
                          />
                        </SwiperSlide>
                      );
                    })}
                  </Swiper>

                  {filteredCourseData.length > 1 && (
                    <div className="flex items-center justify-center gap-2 sm:gap-3 mt-3 sm:mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/80 border-purple-200 hover:border-purple-300 hover:bg-purple-50"
                        onClick={() => currentSwiper?.slidePrev()}
                      >
                        <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                      <div className="flex gap-1 sm:gap-2">
                        {Array.from({ length: filteredCourseData.length }).map(
                          (_, idx) => (
                            <div
                              key={idx}
                              className={cn(
                                "w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full cursor-pointer transition-all duration-300",
                                currentSlideIndex === idx
                                  ? "bg-purple-500 scale-125"
                                  : "bg-purple-300 hover:bg-purple-400"
                              )}
                              onClick={() => {
                                currentSwiper?.slideTo(idx);
                                setCurrentSlideIndex(idx);
                              }}
                            />
                          )
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/80 border-purple-200 hover:border-purple-300 hover:bg-purple-50"
                        onClick={() => currentSwiper?.slideNext()}
                      >
                        <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 py-8 sm:py-12">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                    <Image
                      src="/assets/image/no_course.png"
                      alt="no-course"
                      width={32}
                      height={32}
                      className="sm:w-10 sm:h-10"
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600 font-medium text-sm sm:text-base">
                      Hiện tại chưa có bài học nào!
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      Hãy bắt đầu một bài học mới
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                <Image
                  src="/person_rank.png"
                  alt="person_rank"
                  width={16}
                  height={16}
                  className="brightness-0 invert sm:w-5 sm:h-5"
                />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                  {t("nextLecture")}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">Bài giảng sắp tới</p>
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 shadow-lg">
              {nextLectureData.length > 0 ? (
                <div className="relative">
                  <Swiper
                    onSwiper={setNextSwiper}
                    onSlideChange={(swiper) =>
                      setNextSlideIndex(swiper.activeIndex)
                    }
                    modules={[Navigation, Autoplay]}
                    spaceBetween={20}
                    slidesPerView={1}
                    autoplay={{
                      delay: 5000,
                      disableOnInteraction: false,
                      pauseOnMouseEnter: true
                    }}
                    className="next-lecture-swiper"
                  >
                    {nextLectureData.slice(0, 3).map((courseItem, index) => {
                      const customCourse = {
                        ...courseItem,
                        classRoomName: courseItem.className
                      };
                      return (
                        <SwiperSlide key={index}>
                          <LessonCard
                            {...customCourse}
                            className="transform hover:scale-[1.02] transition-all duration-300 opacity-80"
                          />
                        </SwiperSlide>
                      );
                    })}
                  </Swiper>

                  {nextLectureData.length > 1 && (
                    <div className="flex items-center justify-center gap-2 sm:gap-3 mt-3 sm:mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/80 border-blue-200 hover:border-blue-300 hover:bg-blue-50"
                        onClick={() => nextSwiper?.slidePrev()}
                      >
                        <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                      <div className="flex gap-1 sm:gap-2">
                        {Array.from({
                          length: Math.min(nextLectureData.length, 3)
                        }).map((_, idx) => (
                          <div
                            key={idx}
                            className={cn(
                              "w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full cursor-pointer transition-all duration-300",
                              nextSlideIndex === idx
                                ? "bg-blue-500 scale-125"
                                : "bg-blue-300 hover:bg-blue-400"
                            )}
                            onClick={() => {
                              nextSwiper?.slideTo(idx);
                              setNextSlideIndex(idx);
                            }}
                          />
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/80 border-blue-200 hover:border-blue-300 hover:bg-blue-50"
                        onClick={() => nextSwiper?.slideNext()}
                      >
                        <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 py-8 sm:py-12">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                    <Image
                      src="/person_rank.png"
                      alt="person_rank"
                      width={32}
                      height={32}
                      className="sm:w-10 sm:h-10"
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600 font-medium text-sm sm:text-base">
                      Chưa có bài học tiếp theo!
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      Tất cả bài học đã hoàn thành
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CurrentAndNextLecture;
