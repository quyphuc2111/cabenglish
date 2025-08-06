import LessonCard from "@/components/lesson/lesson-card";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { Fragment, useState, useMemo, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import "swiper/css";
import "swiper/css/navigation";
import { useUserInfo } from "@/hooks/useUserInfo";

function CurrentAndNextLecture({
  courseData,
  t,
  classroomData,
  userId
}: {
  courseData: any[];
  t: any;
  classroomData: any[];
  userId: string | undefined;
}) {
  const router = useRouter();

  // Use refs for swiper instances to prevent re-renders when updating them
  const currentSwiperRef = React.useRef<any>(null);
  const nextSwiperRef = React.useRef<any>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [nextSlideIndex, setNextSlideIndex] = useState<number>(0);
  const { data: userInfo } = useUserInfo(userId);

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

  // Memoize computed data to prevent recalculation on re-renders
  const { currentLecturesByClass, nextLecturesByClass } = useMemo(() => {
    console.log("=== DEBUG: CurrentAndNextLecture ===");
    console.log("courseData:", courseData);

    if (!courseData || courseData.length === 0) {
      console.log("No courseData available");
      return {
        currentLecturesByClass: {},
        nextLecturesByClass: {}
      };
    }

    // Group courses by classId using reduce
    const coursesByClass = courseData.reduce<Record<string, any[]>>(
      (acc, course) => {
        if (!acc[course.classId]) {
          acc[course.classId] = [];
        }
        acc[course.classId].push(course);
        return acc;
      },
      {}
    );

    // Sort courses within each class
    Object.keys(coursesByClass).forEach((classId) => {
      coursesByClass[classId].sort((a: any, b: any) => {
        if (a.unitId !== b.unitId) return a.unitId - b.unitId;
        return a.lessonOrder - b.lessonOrder;
      });
    });

    const currentLecturesByClass: Record<string, any[]> = {};
    const nextLecturesByClass: Record<string, any[]> = {};

    // Process each class separately
    Object.entries(coursesByClass).forEach(([classId, classCourses]) => {
      console.log(`\n--- Processing Class ${classId} ---`);
      console.log("classCourses:", classCourses);

      const currentLectures: any[] = [];
      const nextLectures: any[] = [];

      // Find lessons in progress for this class (progress > 0 and progress < 1)
      const inProgressLessons = classCourses.filter(
        (course: any) =>
          course.progress > 0 && course.progress < 1 && !course.isLocked
      );

      console.log("inProgressLessons:", inProgressLessons);

      if (inProgressLessons.length > 0) {
        // Add all in-progress lessons to current
        currentLectures.push(...inProgressLessons);

        // Determine next lectures based on number of current lectures
        if (inProgressLessons.length === 1) {
          console.log("Single lesson in progress");
          // If only one lesson in progress, find lessons with higher lessonOrder
          const currentLesson = inProgressLessons[0];
          console.log("currentLesson:", currentLesson);

          const nextLessons = classCourses.filter(
            (course: any) =>
              course.progress === 0 &&
              course.lessonOrder > currentLesson.lessonOrder
          );

          console.log("nextLessons (single):", nextLessons);
          console.log("Before sorting nextLessons (single):", nextLessons);
          // Sort by lessonOrder only
          nextLessons.sort((a: any, b: any) => {
            console.log(
              `Comparing single: Lesson ${a.lessonOrder} vs Lesson ${b.lessonOrder}`
            );
            return Number(a.lessonOrder) - Number(b.lessonOrder);
          });
          console.log("After sorting nextLessons (single):", nextLessons);
          nextLectures.push(...nextLessons);
        } else {
          console.log("Multiple lessons in progress");
          // If multiple lessons in progress, get all lessons with progress = 0
          const allNextLessons = classCourses.filter(
            (course: any) => course.progress === 0
          );

          console.log("allNextLessons (multiple):", allNextLessons);
          console.log(
            "Before sorting allNextLessons (multiple):",
            allNextLessons
          );
          // Sort by lessonOrder only
          allNextLessons.sort((a: any, b: any) => {
            console.log(
              `Comparing multiple: Lesson ${a.lessonOrder} vs Lesson ${b.lessonOrder}`
            );
            return Number(a.lessonOrder) - Number(b.lessonOrder);
          });
          console.log(
            "After sorting allNextLessons (multiple):",
            allNextLessons
          );

          nextLectures.push(...allNextLessons);
        }
      } else {
        console.log("No lessons in progress");
        // If no lessons in progress, current lectures remain empty
        // Next lectures will be the first lesson by lessonOrder
        const notStartedLessons = classCourses.filter(
          (course: any) => course.progress === 0
        );

        console.log("notStartedLessons:", notStartedLessons);
        if (notStartedLessons.length > 0) {
          console.log("Before sorting notStartedLessons:", notStartedLessons);
          // Sort by lessonOrder only
          notStartedLessons.sort((a: any, b: any) => {
            console.log(
              `Comparing notStarted: Lesson ${a.lessonOrder} vs Lesson ${b.lessonOrder}`
            );
            return Number(a.lessonOrder) - Number(b.lessonOrder);
          });

          console.log("After sorting notStartedLessons:", notStartedLessons);
          // Add all lessons to next lectures (no current lectures)
          nextLectures.push(...notStartedLessons);
        }
      }

      // Remove duplicates from nextLectures
      const uniqueNextLectures = nextLectures.filter(
        (lecture, index, self) =>
          index === self.findIndex((l) => l.lessonId === lecture.lessonId)
      );

      // Sort current lectures by lessonOrder only
      const sortedCurrentLectures = currentLectures.sort((a: any, b: any) => {
        return Number(a.lessonOrder) - Number(b.lessonOrder);
      });

      // Sort next lectures by lessonOrder only
      const sortedNextLectures = uniqueNextLectures.sort((a: any, b: any) => {
        return Number(a.lessonOrder) - Number(b.lessonOrder);
      });

      console.log(`Final results for Class ${classId}:`);
      console.log("sortedCurrentLectures:", sortedCurrentLectures);
      console.log("sortedNextLectures:", sortedNextLectures);

      currentLecturesByClass[classId] = sortedCurrentLectures;
      nextLecturesByClass[classId] = sortedNextLectures;
    });

    if (userInfo?.mode === "default") {
      Object.keys(currentLecturesByClass).forEach((classId) => {
        if (currentLecturesByClass[classId]?.length > 0) {
          currentLecturesByClass[classId] = [
            currentLecturesByClass[classId][0]
          ];
        }
        if (nextLecturesByClass[classId]?.length > 0) {
          nextLecturesByClass[classId] = [nextLecturesByClass[classId][0]];
        }
      });
    }

    console.log("\n=== FINAL RESULTS ===");
    console.log("currentLecturesByClass:", currentLecturesByClass);
    console.log("nextLecturesByClass:", nextLecturesByClass);
    console.log("=== END DEBUG ===\n");

    return {
      currentLecturesByClass,
      nextLecturesByClass
    };
  }, [courseData, userInfo?.mode]);

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

  // Get classroom names mapping
  const getClassroomName = (classId: string) => {
    const classroom = classroomData.find((c) => c.class_id === Number(classId));
    return classroom?.classname || `Lớp ${classId}`;
  };

  console.log("Checking render conditions:");
  console.log(
    "currentLecturesByClass keys:",
    Object.keys(currentLecturesByClass)
  );
  console.log("nextLecturesByClass keys:", Object.keys(nextLecturesByClass));

  // Check if we have any classes with lectures (current or next)
  const hasAnyLectures = Object.keys(currentLecturesByClass).some((classId) => {
    const currentLectures = currentLecturesByClass[classId] || [];
    const nextLectures = nextLecturesByClass[classId] || [];
    return currentLectures.length > 0 || nextLectures.length > 0;
  });

  console.log("hasAnyLectures:", hasAnyLectures);
  console.log("userInfo", userInfo);

  if (!hasAnyLectures) {
    console.log("No lectures found, showing empty state");
    return (
      <div className="w-full  overflow-hidden py-2 min-w-1/2">
        <div className="relative z-10 p-4 sm:p-6">
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
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2 p-4 w-full bg-white rounded-xl mb-4">
        <Image
          src="/book.gif"
          alt="book"
          width={40}
          height={40}
          className="w-8 h-8 md:w-10 md:h-10"
        />
        <p className="text-lg md:text-xl text-[#555555] font-medium">
          {t("listOfLecture")}
        </p>
      </div>
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 container-constraint">
        {(() => {
          // Get all unique class IDs from both current and next lectures
          const allClassIds = new Set([
            ...Object.keys(currentLecturesByClass),
            ...Object.keys(nextLecturesByClass)
          ]);

          console.log("All class IDs to render:", Array.from(allClassIds));

          return Array.from(allClassIds).map((classId) => {
            const lectures = currentLecturesByClass[classId] || [];
            const nextLectures = nextLecturesByClass[classId] || [];

            console.log(`Rendering class ${classId}:`, {
              lectures,
              nextLectures
            });

            // Show class even if no current lectures but has next lectures
            if (lectures.length === 0 && nextLectures.length === 0) return null;

            return (
              <div
                key={classId}
                className="relative  mb-4 overflow-hidden  rounded-xl "
              >
                {/* Classroom Title */}
                <div className="flex gap-3  bg-white rounded-t-xl px-4 pt-4 max-w-max">
                  <Image
                    src="/menu-icon/lophoc_icon.png"
                    alt="classroom"
                    width={30}
                    height={30}
                    unoptimized={true}
                  />
                  <h3 className=" font-bold text-gray-800 translate-y-0.5">
                    {getClassroomName(classId)}
                  </h3>
                </div>

                <div className="relative z-10 p-4 sm:p-6 bg-white rounded-tr-xl overflow-hidden">
                  {/* Grid Container for this classroom */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 min-w-0">
                    {/* Current Lectures */}
                    <div className="flex flex-col space-y-4 sm:space-y-6 min-w-0 overflow-visible">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10  rounded-full flex items-center justify-center">
                          <Image
                            src="/book_light.png"
                            alt="book_light"
                            width={35}
                            height={35}
                            className=""
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

                      {lectures.length > 0 ? (
                        <div className="flex flex-row gap-3  overflow-visible  min-w-0 w-full horizontal-scroll">
                          {lectures.map((courseItem, index) => {
                            const customCourse = {
                              ...courseItem,
                              classRoomName: courseItem.className
                            };
                            return (
                              <div
                                key={index}
                                className="flex-shrink-0 w-[280px] sm:w-[300px] overflow-visible"
                              >
                                <LessonCard
                                  {...customCourse}
                                  onClick={() =>
                                    handleLessonClick(courseItem.lessonId)
                                  }
                                />
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="flex flex-col w-[300px] items-center justify-center gap-3 sm:gap-4 py-8 sm:py-12 border border-gray-200 rounded-xl h-full">
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

                    {/* Next Lectures */}
                    <div className="space-y-4 w-[300px] sm:space-y-6 min-w-0 h-full overflow-visible">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <Image
                          src="/person_rank.png"
                          alt="person_rank"
                          width={35}
                          height={35}
                          className=""
                        />

                        <div>
                          <h3 className="text-md font-bold text-gray-800">
                            {t("nextLecture")}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600">
                            Bài giảng sắp tới
                          </p>
                        </div>
                      </div>

                      <div className="overflow-visible">
                        {(() => {
                          console.log("Rendering nextLectures:", nextLectures);
                          return null;
                        })()}
                        {nextLectures.length > 0 ? (
                          <div className="flex flex-row gap-3 overflow-visible  min-w-0 w-full horizontal-scroll">
                            {nextLectures
                              .slice(0, 3)
                              .map((courseItem, index) => {
                                (() => {
                                  console.log(
                                    "Rendering next lecture:",
                                    courseItem
                                  );
                                  return null;
                                })();
                                const customCourse = {
                                  ...courseItem,
                                  classRoomName: courseItem.className
                                };

                                return (
                                  <div
                                    key={index}
                                    className="flex-shrink-0 w-[280px] sm:w-[300px] overflow-visible"
                                  >
                                    <LessonCard
                                      {...customCourse}
                                      onClick={() =>
                                        handleLessonClick(courseItem.lessonId)
                                      }
                                      className="opacity-80 w-full"
                                    />
                                  </div>
                                );
                              })}
                          </div>
                        ) : (
                          <div className="flex flex-col w-[300px] items-center justify-center gap-3 sm:gap-4 py-8 sm:py-12 border border-gray-200 rounded-xl h-full">
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
                              <p className="text-gray-600 font-medium text-sm sm:text-base ">
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
          });
        })()}
      </div>
    </>
  );
}

export default CurrentAndNextLecture;
