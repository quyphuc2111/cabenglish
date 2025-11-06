import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useMemo, useCallback, memo } from "react";

import { useUserInfo } from "@/hooks/useUserInfo";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useNavigationStore } from "@/store/navigationStore";
import CurrentLecture from "./overview-current-lesson";
import NextLecture from "./overview-next-lesson";

const CurrentAndNextLecture = memo(function CurrentAndNextLecture({
  t,
  courseData,
  classroomData,
  userId,
  onLikeUpdate
}: {
  courseData: any[];
  t: any;
  classroomData: any[];
  userId: string | undefined;
  onLikeUpdate?: (lessonId: number, newLikeCount: number) => void;
}) {
  const router = useRouter();
  const { data: userInfo } = useUserInfo(userId);
  const { setPreviousPage, setOverviewState } = useNavigationStore();
  // Thêm breakpoint cho màn hình siêu nhỏ (mobile nhỏ)
  const isExtraSmall = useMediaQuery("(max-width: 1023px)");

  const handleLessonClick = useCallback(
    async (lessonId: number) => {
      // Lưu trạng thái trang tổng quan trước khi chuyển trang
      const scrollPosition = window.scrollY;

      // Lưu thông tin trang trước
      setPreviousPage({
        url: "/tong-quan",
        title: "Tổng quan",
        state: {
          scrollPosition
        }
      });

      // Lưu trạng thái trang tổng quan
      setOverviewState({
        scrollPosition
      });

      // Chuyển trang
      router.push(`/lesson/${lessonId}`);
    },
    [router, setPreviousPage, setOverviewState]
  );

  // Memoize computed data to prevent recalculation on re-renders
  const { currentLecturesByClass, nextLecturesByClass } = useMemo(() => {
    if (!courseData || courseData.length === 0) {
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
      const currentLectures: any[] = [];
      const nextLectures: any[] = [];

      // Find lessons in progress for this class (progress > 0 and progress < 1)
      const inProgressLessons = classCourses.filter(
        (course: any) =>
          course.progress > 0 && course.progress < 1 && !course.isLocked
      );

      if (inProgressLessons.length > 0) {
        // Add all in-progress lessons to current
        currentLectures.push(...inProgressLessons);

        // Determine next lectures based on number of current lectures
        if (inProgressLessons.length === 1) {
          const currentLesson = inProgressLessons[0];

          const nextLessons = classCourses.filter(
            (course: any) =>
              course.progress === 0 &&
              course.lessonOrder > currentLesson.lessonOrder
          );

          nextLessons.sort((a: any, b: any) => {
            return Number(a.lessonOrder) - Number(b.lessonOrder);
          });
          nextLectures.push(...nextLessons);
        } else {
          // If multiple lessons in progress, get all lessons with progress = 0
          const allNextLessons = classCourses.filter(
            (course: any) => course.progress === 0
          );

          allNextLessons.sort((a: any, b: any) => {
            return Number(a.lessonOrder) - Number(b.lessonOrder);
          });

          nextLectures.push(...allNextLessons);
        }
      } else {
        // If no lessons in progress, current lectures remain empty
        // Next lectures will be the first lesson by lessonOrder
        const notStartedLessons = classCourses.filter(
          (course: any) => course.progress === 0
        );

        if (notStartedLessons.length > 0) {
          notStartedLessons.sort((a: any, b: any) => {
            return Number(a.lessonOrder) - Number(b.lessonOrder);
          });

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

    return {
      currentLecturesByClass,
      nextLecturesByClass
    };
  }, [courseData, userInfo?.mode]);

  // Get classroom names mapping
  const getClassroomName = (classId: string) => {
    const classroom = classroomData.find((c) => c.class_id === Number(classId));
    return classroom?.classname || `Lớp ${classId}`;
  };

  // Calculate statistics for each classroom
  const getClassroomStats = useCallback(
    (classId: string) => {
      const classLessons = courseData.filter(
        (course) => String(course.classId) === classId
      );

      if (classLessons.length === 0) {
        return { completed: 0, total: 0, progress: 0 };
      }

      const completed = classLessons.filter(
        (course) => course.progress === 1
      ).length;
      const total = classLessons.length;
      const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

      return { completed, total, progress };
    },
    [courseData]
  );

  // Check if we have any classes with lectures (current or next)
  const hasAnyLectures = Object.keys(currentLecturesByClass).some((classId) => {
    const currentLectures = currentLecturesByClass[classId] || [];
    const nextLectures = nextLecturesByClass[classId] || [];
    return currentLectures.length > 0 || nextLectures.length > 0;
  });

  const getThemeColor = (theme: string) => {
    switch (theme) {
      case "theme-gold":
        return "border-[#ECC98D]";
      case "theme-blue":
        return "border-[#A7C6F5]";
      case "theme-pink":
        return "border-[#ea69ae]";
      case "theme-red":
        return "border-[#E25762]";
      default:
        return "border-[#F09DA4]";
    }
  };

  if (!hasAnyLectures) {
    return (
      <div className="w-full xl:w-1/2 overflow-hidden py-2 min-w-0">
        <div className="relative z-10 p-3 sm:p-4 md:p-6">
          <div
            className={`flex flex-col items-center justify-center gap-2 sm:gap-3 md:gap-4 py-6 sm:py-8 md:py-12`}
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
              <Image
                src="/assets/image/no_course.png"
                alt="no-course"
                width={32}
                height={32}
                className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10"
              />
            </div>
            <div className="text-center px-2">
              <p className="text-gray-600 font-medium text-xs sm:text-sm md:text-base">
                {t("noLessonsYet")}
              </p>
              <p className="text-xs text-gray-500 mt-1">
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
      {/* CSS for responsive design */}
      <style jsx>{`
        /* Mobile optimizations */
        @media (max-width: 640px) {
          .lesson-container {
            padding: 0 1px;
            overflow: hidden;
          }
        }

        /* Thêm breakpoint cho màn hình siêu nhỏ */
        @media (max-width: 480px) {
          .lesson-card {
            padding: 8px !important;
            border-radius: 6px !important;
          }
        }

        /* Breakpoint cụ thể cho màn hình nhỏ nhưng lớn hơn siêu nhỏ */
        @media (min-width: 481px) and (max-width: 640px) {
          .lesson-card {
            padding: 6px !important;
          }
        }

        /* Tối ưu hóa hiển thị cho các loại màn hình - Desktop */
        @media (min-width: 1024px) {
          .lesson-card {
            width: 280px !important;
            min-width: 280px !important;
            max-width: 280px !important;
            box-sizing: border-box;
            overflow: hidden !important;
            height: 100% !important;
            display: flex !important;
            flex-direction: column !important;
          }

          /* Đảm bảo tất cả card có cùng chiều cao và width cố định */
          .lesson-container {
            display: flex !important;
            align-items: stretch !important;
            min-height: 300px !important;
          }

          .lesson-container > div {
            flex: 1 !important;
            display: flex !important;
            flex-direction: column !important;
            height: 100% !important;
            width: 280px !important;
            min-width: 280px !important;
            max-width: 280px !important;
          }
        }

        /* Tablet và màn hình vừa */
        @media (min-width: 768px) and (max-width: 1023px) {
          .lesson-card {
            width: 240px !important;
            min-width: 240px !important;
            max-width: 240px !important;
            box-sizing: border-box;
            overflow: hidden !important;
            height: 100% !important;
            display: flex !important;
            flex-direction: column !important;
          }
        }

        /* Đảm bảo nội dung card có chiều cao nhất quán */
        .lesson-card > div:first-child {
          flex: 1 !important;
          display: flex !important;
          flex-direction: column !important;
        }

        .lesson-card > div:last-child {
          margin-top: auto !important;
          min-height: 80px !important;
          display: flex !important;
          flex-direction: column !important;
          justify-content: space-between !important;
        }

        /* Đảm bảo lesson name có chiều cao cố định */
        .lesson-card h2 {
          min-height: 2.5em !important;
          display: -webkit-box !important;
          -webkit-line-clamp: 2 !important;
          -webkit-box-orient: vertical !important;
          overflow: hidden !important;
        }

        /* Đảm bảo progress bar và like button có layout nhất quán */
        .lesson-card .flex.justify-between.items-center {
          min-height: 30px !important;
          align-items: center !important;
        }

        /* Cố định width cho mobile */
        @media (max-width: 640px) {
          .lesson-card {
            width: 100% !important;
            min-width: 100% !important;
            max-width: 100% !important;
            min-height: 370px !important;
            height: 370px !important;
          }

          /* Padding cho content bên trong lesson card */
          .lesson-card > div {
            padding: 24px !important;
          }

          .lesson-container > div {
            width: 100% !important;
            min-width: 100% !important;
            max-width: 100% !important;
            min-height: 370px !important;
            height: 370px !important;
          }

          .lesson-container {
            min-height: 370px !important;
            height: 370px !important;
          }
        }

        /* Cố định width cho màn hình siêu nhỏ */
        @media (max-width: 480px) {
          .lesson-card {
            width: 100% !important;
            min-width: 100% !important;
            max-width: 100% !important;
            min-height: 370px !important;
            height: 370px !important;
          }

          /* Padding cho content bên trong lesson card */
          .lesson-card > div {
            padding: 28px !important;
          }

          .lesson-container > div {
            width: 100% !important;
            min-width: 100% !important;
            max-width: 100% !important;
            min-height: 370px !important;
            height: 370px !important;
          }

          .lesson-container {
            min-height: 370px !important;
            height: 370px !important;
          }
        }
      `}</style>

      <div
        className={`w-full grid grid-cols-1 gap-4 sm:gap-6 md:gap-8 container-constraint `}
      >
        {(() => {
          // Get all unique class IDs from both current and next lectures
          const allClassIds = new Set([
            ...Object.keys(currentLecturesByClass),
            ...Object.keys(nextLecturesByClass)
          ]);

          return Array.from(allClassIds).map((classId) => {
            const lectures = currentLecturesByClass[classId] || [];
            const nextLectures = nextLecturesByClass[classId] || [];
            const stats = getClassroomStats(classId);

            // Show class even if no current lectures but has next lectures
            // if (lectures.length === 0 && nextLectures.length === 0) return <div>123</div>;

            return (
              <div
                key={classId}
                className="relative mb-3 sm:mb-4 overflow-hidden rounded-xl"
              >
                <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-0">
                  {/* Classroom Title */}
                  <div className="flex items-center gap-2 sm:gap-3 bg-white rounded-t-xl sm:rounded-tr-none px-3 sm:px-4 py-2 max-w-max h-12 sm:h-16">
                    <Image
                      src="/menu-icon/lophoc_icon.png"
                      alt="classroom"
                      width={30}
                      height={30}
                      className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-10 lg:h-10"
                      unoptimized={true}
                    />
                    <h3 className="font-bold text-gray-800 translate-y-0.5 text-xs sm:text-sm md:text-base lg:text-lg">
                      {getClassroomName(classId)}
                    </h3>
                  </div>

                  {/* Stats Section - Responsive */}
                  <div className="flex bg-white rounded-tr-xl md:rounded-t-xl sm:rounded-tl-none py-2.5 lg:py-2 px-2 sm:px-4 gap-2 sm:gap-3 md:gap-4 justify-around sm:justify-end">
                    <div className="flex flex-col items-center lg:border-r border-gray-200 pr-2 sm:pr-3 md:pr-4 min-w-0">
                      <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-800">
                        {stats.completed}
                      </p>
                      <p className="text-[10px] sm:text-xs text-gray-500 whitespace-nowrap truncate max-w-[80px] sm:max-w-none">
                        {t("completed")}
                      </p>
                    </div>
                    <div className="flex flex-col items-center lg:border-r border-gray-200 pr-2 sm:pr-3 md:pr-4 min-w-0">
                      <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-800">
                        {stats.total}
                      </p>
                      <p className="text-[10px] sm:text-xs text-gray-500 whitespace-nowrap truncate max-w-[80px] sm:max-w-none">
                        {t("totalLessons")}
                      </p>
                    </div>
                    <div className="flex flex-col items-center min-w-0">
                      <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-800">
                        {stats.progress}%
                      </p>
                      <p className="text-[10px] sm:text-xs text-gray-500 whitespace-nowrap truncate max-w-[80px] sm:max-w-none">
                        {t("progress")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 p-3 sm:p-4 md:p-6 bg-white overflow-hidden">
                  {/* Grid Container for this classroom */}
                  {lectures.length === 0 && nextLectures.length === 0 ? (
                    <div className="completion-celebration relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
                      {/* Decorative floating stars */}
                      <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div 
                          className="absolute top-20 left-16 text-amber-400 text-2xl animate-pulse" 
                          style={{ animationDelay: '0s' }}
                        >✨</div>
                        <div 
                          className="absolute top-32 right-24 text-yellow-400 text-xl animate-pulse" 
                          style={{ animationDelay: '0.5s' }}
                        >⭐</div>
                        <div 
                          className="absolute bottom-40 left-32 text-amber-300 text-lg animate-pulse" 
                          style={{ animationDelay: '1s' }}
                        >✨</div>
                        <div 
                          className="absolute top-48 right-1/4 text-yellow-300 text-2xl animate-pulse" 
                          style={{ animationDelay: '1.5s' }}
                        >⭐</div>
                        <div 
                          className="absolute bottom-32 right-20 text-amber-400 text-xl animate-pulse" 
                          style={{ animationDelay: '2s' }}
                        >✨</div>
                        <div 
                          className="absolute top-1/3 left-1/4 text-yellow-400 text-lg animate-pulse" 
                          style={{ animationDelay: '2.5s' }}
                        >⭐</div>
                        <div 
                          className="absolute bottom-1/3 right-1/3 text-amber-300 text-2xl animate-pulse" 
                          style={{ animationDelay: '3s' }}
                        >✨</div>
                        <div 
                          className="absolute top-2/3 left-1/3 text-yellow-300 text-xl animate-pulse" 
                          style={{ animationDelay: '3.5s' }}
                        >⭐</div>
                      </div>

                      {/* Content Container */}
                      <div className="relative z-10 flex flex-col items-center py-6 sm:py-8 px-4">
                        {/* Trophy Circle with glow effect */}
                        <div className="flex justify-center mb-4 animate-bounce-slow">
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full blur-xl opacity-40 animate-pulse"></div>
                            <div className="relative bg-gradient-to-br from-amber-300 via-yellow-300 to-amber-400 rounded-full p-4 sm:p-5 shadow-2xl transform hover:scale-110 transition-transform duration-300">
                              <div className="text-4xl sm:text-5xl">🏆</div>
                            </div>
                          </div>
                        </div>

                        {/* Main content card */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 text-center transform hover:scale-[1.02] transition-all duration-300 w-full max-w-xl">
                          {/* Celebration header */}
                          <div className="flex items-center justify-center gap-2 mb-3">
                            <span 
                              className="text-2xl sm:text-3xl animate-wiggle" 
                              style={{ animationDelay: '0s' }}
                            >🎉</span>
                            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-emerald-600">
                              {t("excellent")}
                            </h1>
                            <span 
                              className="text-2xl sm:text-3xl animate-wiggle" 
                              style={{ animationDelay: '0.2s' }}
                            >🎊</span>
                          </div>

                          {/* Success message */}
                          <p className="text-gray-600 text-sm sm:text-base mb-1.5">
                            {t("youHaveCompleted")}{" "}
                            <span className="font-semibold text-gray-800">{t("allCourses")}</span>{" "}
                            {t("of")}
                          </p>
                          <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                            {getClassroomName(classId)}
                          </p>

                          {/* Progress bar */}
                          <div className="mb-5">
                            <div className="flex items-center justify-center gap-2">
                              <div className="h-1.5 flex-1 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 rounded-full animate-progress"></div>
                              </div>
                              <span className="text-emerald-600 font-bold text-base sm:text-lg">
                                100%
                              </span>
                              <div className="h-1.5 flex-1 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-teal-600 via-emerald-500 to-teal-500 rounded-full animate-progress-reverse"></div>
                              </div>
                            </div>
                          </div>

                          {/* Achievement badge */}
                          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl p-3 sm:p-4 mb-4 transform hover:shadow-lg transition-all duration-300">
                            <div className="flex items-center justify-center gap-2.5 sm:gap-3">
                              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-2 shadow-lg">
                                <svg
                                  className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                                  />
                                </svg>
                              </div>
                              <div className="text-left">
                                <p className="text-[10px] sm:text-xs text-gray-600 mb-0.5">
                                  {t("achievementUnlocked")}
                                </p>
                                <p className="text-sm sm:text-base font-bold text-emerald-700">
                                  {t("courseCompletion")}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* CTA Button */}
                          <button
                            onClick={() =>
                              router.push(`/lop-hoc/${getClassroomName(classId)}`)
                            }
                            className="group bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 mx-auto text-sm sm:text-base"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                              />
                            </svg>
                            <span>{t("viewClassDetails")}</span>
                            <span className="transform group-hover:translate-x-1 transition-transform duration-300">
                              →
                            </span>
                          </button>
                        </div>

                        {/* Confetti effect text */}
                        <p className="text-center mt-3 sm:mt-4 text-gray-500 text-[10px] sm:text-xs">
                          {t("congratulationsMessage")}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`flex flex-col xl:flex-row gap-4 sm:gap-6 lg:gap-8 xl:gap-12 min-w-0 justify-start
                       `}
                    >
                      {/* Current Lectures */}
                      <CurrentLecture
                        lectures={lectures}
                        classId={classId}
                        handleLessonClick={handleLessonClick}
                        isExtraSmall={isExtraSmall}
                        t={t}
                        classroomData={classroomData}
                        onLikeUpdate={onLikeUpdate}
                        hasNextLectures={nextLectures.length > 0}
                      />

                      {/* Responsive divider */}
                      <div
                        className={`hidden xl:block border-r-2 ${getThemeColor(
                          userInfo?.theme || ""
                        )} `}
                      ></div>

                      {/* Mobile divider */}
                      <div
                        className={`xl:hidden w-full h-px border-b ${getThemeColor(
                          userInfo?.theme || ""
                        )}`}
                      ></div>

                      {/* Next Lectures */}
                      <NextLecture
                        nextLectures={nextLectures}
                        classId={classId}
                        handleLessonClick={handleLessonClick}
                        isExtraSmall={isExtraSmall}
                        t={t}
                        classroomData={classroomData}
                        onLikeUpdate={onLikeUpdate}
                        hasCurrentLectures={lectures.length > 0}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          });
        })()}
      </div>
    </>
  );
});

export default CurrentAndNextLecture;
