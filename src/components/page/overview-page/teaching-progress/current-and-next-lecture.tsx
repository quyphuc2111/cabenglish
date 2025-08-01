import LessonCard from "@/components/lesson/lesson-card";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { Fragment, useState, useMemo, useCallback } from "react";
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
  // Initialize with empty string, will use first classroom by default
  const [selectedClassroom, setSelectedClassroom] = useState<string>("");

  // Set default classroom on component mount
  React.useEffect(() => {
    if (classroomData.length > 0 && !selectedClassroom) {
      setSelectedClassroom(classroomData[0].class_id);
    }
  }, [classroomData, selectedClassroom]);
  // Use refs for swiper instances to prevent re-renders when updating them
  const currentSwiperRef = React.useRef<any>(null);
  const nextSwiperRef = React.useRef<any>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [nextSlideIndex, setNextSlideIndex] = useState<number>(0);

  // Callbacks for swiper initialization
  // Memoized callbacks for swiper initialization to prevent re-renders
  const handleCurrentSwiperInit = useCallback((swiper: any) => {
    currentSwiperRef.current = swiper;
  }, []);

  const handleNextSwiperInit = useCallback((swiper: any) => {
    nextSwiperRef.current = swiper;
  }, []);

  // Memoized slide change handlers
  const handleCurrentSlideChange = useCallback((swiper: any) => {
    setCurrentSlideIndex(swiper.activeIndex);
  }, []);

  const handleNextSlideChange = useCallback((swiper: any) => {
    setNextSlideIndex(swiper.activeIndex);
  }, []);

  const handleLessonClick = useCallback(
    async (lessonId: number) => {
      router.push(`/lesson/${lessonId}`);
    },
    [router]
  );

  // Filter courseData theo classroom được chọn
  const getFilteredDataByClassroom = useCallback(
    (data: any[]) => {
      return data.filter((course) => {
        if (!selectedClassroom && classroomData.length === 0) return true;
        return (
          course.classId === (selectedClassroom || classroomData[0]?.class_id)
        );
      });
    },
    [selectedClassroom, classroomData]
  );

  // Memoize computed data to prevent recalculation on re-renders
  const { filteredCourseData, nextLectureData } = useMemo(() => {
    const filteredData = getFilteredDataByClassroom(courseData);

    if (!filteredData || filteredData.length === 0) {
      return {
        filteredCourseData: [],
        nextLectureData: []
      };
    }

    // Check if any lesson has progress > 0
    const hasLessonsInProgress = filteredData.some((course: any) => course.progress > 0);
    
    if (!hasLessonsInProgress) {
      return {
        filteredCourseData: [],
        nextLectureData: []
      };
    }

    // Process all lessons regardless of progress status

    // Group courses by classId
    const coursesByClass = filteredData.reduce<
      Record<string, any[]>
    >((acc, course) => {
      if (!acc[course.classId]) {
        acc[course.classId] = [];
      }
      acc[course.classId].push(course);
      return acc;
    }, {});

    // Sort courses within each class
    Object.keys(coursesByClass).forEach((classId) => {
      coursesByClass[classId].sort((a: any, b: any) => {
        if (a.unitId !== b.unitId) return a.unitId - b.unitId;
        return a.lessonOrder - b.lessonOrder;
      });
    });

    // For current lectures: lessons in progress or the first not started lesson from each class
    const currentLectures: any[] = [];
    const remainingLectures: any[] = [];

    Object.values(coursesByClass).forEach((classCourses: any[]) => {
      // First find lessons in progress
      const inProgressLessons = classCourses.filter(
        (course: any) =>
          course.progress > 0 && course.progress < 1 && !course.isLocked
      );

      if (inProgressLessons.length > 0) {
        // Add all in-progress lessons to current
        currentLectures.push(...inProgressLessons);

        // For each in-progress lesson, find the next lessons in sequence
        inProgressLessons.forEach((inProgressLesson: any) => {
          // Find lessons in the same unit with higher lesson order
          const nextLessonsInUnit = classCourses.filter(
            (course: any) =>
              course.progress === 0 &&
              !course.isLocked &&
              course.unitId === inProgressLesson.unitId &&
              course.lessonOrder > inProgressLesson.lessonOrder
          );

          // If we have next lessons in the same unit, add them
          if (nextLessonsInUnit.length > 0) {
            // Sort by lessonOrder and take the first 3
            nextLessonsInUnit.sort(
              (a: any, b: any) => a.lessonOrder - b.lessonOrder
            );
            remainingLectures.push(...nextLessonsInUnit);
          } else {
            // If no next lessons in the same unit, find lessons in the next unit
            const currentUnitIndex = classCourses.findIndex(
              (course: any) => course.unitId === inProgressLesson.unitId
            );

            if (currentUnitIndex !== -1) {
              // Get all unitIds in this class
              const unitIds = [
                ...new Set(classCourses.map((course: any) => course.unitId))
              ];
              unitIds.sort((a: any, b: any) => {
                // Find the minimum lessonOrder for each unitId to determine unit sequence
                const minLessonOrderA = Math.min(
                  ...classCourses
                    .filter((course: any) => course.unitId === a)
                    .map((course: any) => course.lessonOrder)
                );
                const minLessonOrderB = Math.min(
                  ...classCourses
                    .filter((course: any) => course.unitId === b)
                    .map((course: any) => course.lessonOrder)
                );
                return minLessonOrderA - minLessonOrderB;
              });

              // Find the index of the current unit
              const unitIdIndex = unitIds.indexOf(inProgressLesson.unitId);

              // If there's a next unit
              if (unitIdIndex !== -1 && unitIdIndex < unitIds.length - 1) {
                const nextUnitId = unitIds[unitIdIndex + 1];
                // Get lessons from the next unit
                const nextUnitLessons = classCourses.filter(
                  (course: any) =>
                    course.unitId === nextUnitId &&
                    course.progress === 0 &&
                    !course.isLocked
                );

                // Sort by lessonOrder and add them
                nextUnitLessons.sort(
                  (a: any, b: any) => a.lessonOrder - b.lessonOrder
                );
                remainingLectures.push(...nextUnitLessons);
              }
            }
          }
        });
      } else {
        // If no lessons in progress, add the first not-started lesson to current
        const notStartedLessons = classCourses.filter(
          (course: any) => course.progress === 0 && !course.isLocked
        );

        if (notStartedLessons.length > 0) {
          // Sort by unitId and lessonOrder
          notStartedLessons.sort((a: any, b: any) => {
            if (a.unitId !== b.unitId) {
              return a.unitId - b.unitId;
            }
            return a.lessonOrder - b.lessonOrder;
          });

          // Add the first lesson to current
          currentLectures.push(notStartedLessons[0]);

          // Add the next lessons in sequence to remaining
          remainingLectures.push(...notStartedLessons.slice(1));
        }
      }
    });

    // Sort current lectures by classId, unitId, and lessonOrder
    const sortedCurrentLectures = currentLectures.sort((a: any, b: any) => {
      if (a.classId !== b.classId) return a.classId - b.classId;
      if (a.unitId !== b.unitId) return a.unitId - b.unitId;
      return a.lessonOrder - b.lessonOrder;
    });

    // Remove duplicates from remainingLectures (in case we added the same lesson multiple times)
    const uniqueRemainingLectures = remainingLectures.filter(
      (lecture, index, self) =>
        index === self.findIndex((l) => l.lessonId === lecture.lessonId)
    );

    // Sort next lectures by classId, unitId, and lessonOrder
    const sortedNextLectures = uniqueRemainingLectures.sort(
      (a: any, b: any) => {
        if (a.classId !== b.classId) return a.classId - b.classId;
        if (a.unitId !== b.unitId) return a.unitId - b.unitId;
        return a.lessonOrder - b.lessonOrder;
      }
    );

    return {
      filteredCourseData: sortedCurrentLectures,
      nextLectureData: sortedNextLectures
    };
  }, [courseData, getFilteredDataByClassroom]); // Only recalculate when courseData or filter changes

  console.log("filteredCourseData", filteredCourseData);
  console.log("nextLectureData", nextLectureData);

  // Component will show "Hiện tại chưa có bài học nào!" message when no data

  // Optional: Memoize slider navigation handlers to prevent re-renders
  const handlePrevCurrentSlide = useCallback(() => {
    currentSwiperRef.current?.slidePrev();
  }, []);

  const handleNextCurrentSlide = useCallback(() => {
    currentSwiperRef.current?.slideNext();
  }, []);

  const handlePrevNextSlide = useCallback(() => {
    nextSwiperRef.current?.slidePrev();
  }, []);

  const handleNextNextSlide = useCallback(() => {
    nextSwiperRef.current?.slideNext();
  }, []);

  const handleCurrentDotClick = useCallback((idx: number) => {
    currentSwiperRef.current?.slideTo(idx);
    setCurrentSlideIndex(idx);
  }, []);

  const handleNextDotClick = useCallback((idx: number) => {
    nextSwiperRef.current?.slideTo(idx);
    setNextSlideIndex(idx);
  }, []);


  return (
    <div className="relative w-full xl:w-1/2 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 opacity-90 rounded-xl sm:rounded-2xl lg:rounded-3xl" />
      <div className="absolute inset-0 bg-[url('/assets/bg-pattern.svg')] opacity-5" />

      <div className="relative z-10 p-4 sm:p-6">
        <div className="mb-6 lg:mb-8">
          <div className="flex flex-col gap-4 mb-4 sm:mb-6">
            <div className="w-full">
              <Select
                value={selectedClassroom}
                onValueChange={setSelectedClassroom}
              >
                <SelectTrigger className="w-full bg-white/80 backdrop-blur-sm border-2 border-purple-200 hover:border-purple-300 rounded-lg sm:rounded-xl h-10 sm:h-12 px-3 sm:px-4 text-sm sm:text-base">
                  <SelectValue placeholder="🏫 Lớp học" />
                </SelectTrigger>
                <SelectContent className="bg-white/95 backdrop-blur-sm border-purple-200">
                  <SelectGroup>
                    {classroomData.map((classroom) => (
                      <SelectItem
                        key={classroom.class_id}
                        value={classroom.class_id}
                        className="py-2 sm:py-3"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                          <span className="text-sm sm:text-base">
                            {classroom.classname}
                          </span>
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
                <h3 className="text-md font-bold text-gray-800">
                  {t("lectureBeingTaught")}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Bài giảng hiện tại
                </p>
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 border border-white/20 shadow-lg">
              {filteredCourseData.length > 0 ? (
                <div className="relative">
                  <Swiper
                    onSwiper={handleCurrentSwiperInit}
                    onSlideChange={handleCurrentSlideChange}
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
                        onClick={handlePrevCurrentSlide}
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
                              onClick={() => handleCurrentDotClick(idx)}
                            />
                          )
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/80 border-purple-200 hover:border-purple-300 hover:bg-purple-50"
                        onClick={handleNextCurrentSlide}
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
                <h3 className="text-md font-bold text-gray-800">
                  {t("nextLecture")}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Bài giảng sắp tới
                </p>
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 border border-white/20 shadow-lg">
              {nextLectureData.length > 0 ? (
                <div className="relative">
                  <Swiper
                    onSwiper={handleNextSwiperInit}
                    onSlideChange={handleNextSlideChange}
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

                      console.log("nextLectureData", customCourse);
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
                        onClick={handlePrevNextSlide}
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
                            onClick={() => handleNextDotClick(idx)}
                          />
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/80 border-blue-200 hover:border-blue-300 hover:bg-blue-50"
                        onClick={handleNextNextSlide}
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
