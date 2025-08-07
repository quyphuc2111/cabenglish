"use client";
import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LessonType } from "@/types/lesson";
import { ClassroomType } from "@/types/classroom";
import LessonCard from "@/components/lesson/lesson-card";
import { useNavigationStore } from "@/store/navigationStore";
import { useNavigationRestore } from "@/hooks/useNavigationRestore";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { ChevronLeft, ChevronRight, GraduationCap, Users } from "lucide-react";
import { cn } from "@/lib/utils";

import "swiper/css";
import "swiper/css/navigation";
import { useRouter } from "next/navigation";
import SectionTitle from "@/components/common/section-title";
import styles from "./lesson-teaching.module.css";

// Memoized component cho Tab classroom để tránh re-render không cần thiết
const ClassroomTab = memo(
  ({
    classroom,
    index,
    activeTab,
    lessonCount,
    onClick,
    classroomIcons
  }: {
    classroom: ClassroomType;
    index: number;
    activeTab: string;
    lessonCount: number;
    onClick: () => void;
    classroomIcons: any[];
  }) => {
    const iconData = classroomIcons[index % classroomIcons.length];
    const IconComponent = iconData.icon;
    const isActive = activeTab === classroom.class_id.toString();

    return (
      <Button
        size="default"
        onClick={onClick}
        className={cn(
          // Base styles với responsive spacing
          "px-3 sm:px-4 md:px-6 py-3 sm:py-3.5 md:py-4",
          "text-xs sm:text-sm md:text-base font-semibold",
          "transition-all duration-300 shadow-sm hover:shadow-md",
          "flex items-center gap-2 sm:gap-3 md:gap-4",
          "min-w-0 flex-shrink-0 max-w-[160px] sm:max-w-[180px] md:max-w-[220px] lg:max-w-none",
          "rounded-xl border-2",
          // Active state với gradient và glow effect
          isActive
            ? "bg-gradient-to-r from-[#F09DA4] to-[#E91E63] hover:from-[#E91E63] hover:to-[#F09DA4] text-white border-[#E91E63] shadow-lg shadow-pink-200/50 scale-105"
            : "bg-white text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 border-gray-200 hover:border-blue-300 hover:text-blue-800",
          styles.classroomTab
        )}
      >
        <span className="flex items-center gap-2 min-w-0 flex-1">
          <div
            className={cn(
              "p-1.5 rounded-lg transition-all duration-300",
              isActive
                ? "bg-white/20 shadow-inner"
                : "bg-gray-100 group-hover:bg-blue-100"
            )}
          >
            <IconComponent
              className={cn(
                "w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0 transition-all duration-300",
                isActive
                  ? "text-white drop-shadow-sm"
                  : `${iconData.color} group-hover:text-blue-600`
              )}
            />
          </div>
          <span className="truncate text-xs sm:text-sm md:text-base font-medium">
            {classroom.classname}
          </span>
        </span>

        <div
          className={cn(
            "px-2 py-1 rounded-full text-[10px] sm:text-xs font-bold",
            "whitespace-nowrap flex-shrink-0 transition-all duration-300",
            "hidden xs:flex items-center justify-center min-w-[20px]",
            isActive
              ? "bg-white/25 text-white shadow-inner"
              : "bg-gray-200 text-gray-600 group-hover:bg-blue-200 group-hover:text-blue-800"
          )}
        >
          {lessonCount}
        </div>
      </Button>
    );
  }
);

ClassroomTab.displayName = "ClassroomTab";

// Memoized LessonSlide component để tối ưu hiệu năng
const LessonSlide = memo(
  ({
    lesson,
    onNavigateToLesson
  }: {
    lesson: LessonType;
    onNavigateToLesson: (lesson: LessonType) => void;
  }) => {
    const handleActivate = useCallback(() => {
      if (!lesson.isLocked) {
        onNavigateToLesson(lesson);
      }
    }, [lesson, onNavigateToLesson]);

    const customLesson = useMemo(
      () => ({
        ...lesson,
        classRoomName: lesson.className,
        schoolWeekId: lesson.schoolWeekId || 0
      }),
      [lesson]
    );

    // Wrapper đảm bảo bắt click/keyboard như trang hoàn thành
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={handleActivate}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleActivate();
          }
        }}
        className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-xl"
        style={{ pointerEvents: "auto" }}
      >
        <LessonCard
          {...customLesson}
          className={cn(
            "transform hover:scale-[1.02] transition-all duration-300",
            styles.lessonSlide
          )}
        />
      </div>
    );
  }
);

LessonSlide.displayName = "LessonSlide";

// Custom hook để tính toán breakpoint hiện tại với SSR safety
const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState<"mobile" | "tablet" | "desktop">(
    "mobile" // Default to mobile để tránh hydration mismatch
  );

  useEffect(() => {
    const updateBreakpoint = () => {
      // Chỉ chạy trên client side
      if (typeof window === "undefined") return;

      const width = window.innerWidth;
      if (width < 768) {
        setBreakpoint("mobile");
      } else if (width < 1024) {
        setBreakpoint("tablet");
      } else {
        setBreakpoint("desktop");
      }
    };

    // Initial call
    updateBreakpoint();

    // Add resize listener
    window.addEventListener("resize", updateBreakpoint);
    return () => window.removeEventListener("resize", updateBreakpoint);
  }, []);

  return breakpoint;
};

// Memoized navigation dots component
const NavigationDots = memo(
  ({
    totalSlides,
    currentIndex,
    onDotClick,
    slidesPerView
  }: {
    totalSlides: number;
    currentIndex: number;
    onDotClick: (index: number) => void;
    slidesPerView: number;
  }) => {
    const totalDots = Math.ceil(totalSlides / slidesPerView);
    const activeDot = Math.floor(currentIndex / slidesPerView);

    return (
      <div className={cn("flex gap-1 sm:gap-2", styles.navigationDots)}>
        {Array.from({ length: totalDots }).map((_, idx) => (
          <div
            key={idx}
            className={cn(
              "rounded-full cursor-pointer transition-all duration-300",
              "w-1.5 h-1.5 sm:w-2 sm:h-2",
              activeDot === idx
                ? "bg-blue-500 scale-125"
                : "bg-gray-300 hover:bg-gray-400"
            )}
            onClick={() => onDotClick(idx * slidesPerView)}
          />
        ))}
      </div>
    );
  }
);

NavigationDots.displayName = "NavigationDots";

interface LessonTeachingClientProps {
  teachingLessons: LessonType[];
  classrooms: ClassroomType[];
  allLessons: LessonType[];
}

function LessonTeachingClient({
  teachingLessons,
  classrooms,
  allLessons
}: LessonTeachingClientProps) {
  const [currentSwiper, setCurrentSwiper] = useState<any>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const breakpoint = useBreakpoint();

  // Navigation store để lưu trạng thái
  const { lessonTeachingState, setLessonTeachingState, setPreviousPage } =
    useNavigationStore();

  // Hook để xử lý việc khôi phục state khi quay lại
  const { isReturningFromLesson } = useNavigationRestore();

  // Ensure component is hydrated trên client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Clear stale selected lesson cache on entering this page (avoid leakage)
  useEffect(() => {
    let mounted = true;
    import("@/store/useSelectLesson")
      .then(({ useSelectLessonStore }) => {
        if (!mounted) return;
        const { clearSelectedLesson } = useSelectLessonStore.getState();
        clearSelectedLesson();
      })
      .catch((e) => {
        console.error(
          "[lesson-teaching] failed to clear selected-lesson-storage:",
          e
        );
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Khôi phục scroll position khi component mount
  useEffect(() => {
    if (isClient && lessonTeachingState.scrollPosition > 0) {
      // Delay để đảm bảo DOM đã render xong
      setTimeout(() => {
        window.scrollTo(0, lessonTeachingState.scrollPosition);
      }, 100);
    }
  }, [isClient, lessonTeachingState.scrollPosition]);

  // State local để quản lý activeTab, khôi phục từ store nếu có
  const [activeTab, setActiveTab] = useState<string>(
    lessonTeachingState.activeTab || "all"
  );

  // Tính toán slides per view dựa trên breakpoint - memoized
  const slidesPerView = useMemo(() => {
    switch (breakpoint) {
      case "mobile":
        return 1;
      case "tablet":
        return 2;
      case "desktop":
        // Kiểm tra window object tồn tại để tránh SSR issues
        if (typeof window !== "undefined") {
          return window.innerWidth < 1280 ? 4 : 5;
        }
        return 4; // fallback cho SSR
      default:
        return 1;
    }
  }, [breakpoint]);

  // Mảng icon cho các lớp học - memoized để tránh re-create
  const classroomIcons = useMemo(
    () => [
      { icon: GraduationCap, color: "text-blue-600" },
      { icon: GraduationCap, color: "text-green-600" },
      { icon: GraduationCap, color: "text-purple-600" },
      { icon: GraduationCap, color: "text-orange-600" },
      { icon: GraduationCap, color: "text-red-600" },
      { icon: GraduationCap, color: "text-indigo-600" },
      { icon: GraduationCap, color: "text-pink-600" },
      { icon: GraduationCap, color: "text-yellow-600" }
    ],
    []
  );

  // Function để tính số lượng bài giảng đang học theo class_id - memoized
  const getTeachingLessonCountByClassId = useCallback(
    (classId: number) => {
      if (!Array.isArray(teachingLessons)) return 0;

      return teachingLessons.filter((lesson) => lesson.classId === classId)
        .length;
    },
    [teachingLessons]
  );

  // Function để update activeTab và lưu vào store
  const updateActiveTab = useCallback(
    (tab: string) => {
      console.log("🔄 Setting active tab:", tab);
      setActiveTab(tab);
      // Lưu trạng thái vào store
      setLessonTeachingState({ activeTab: tab });
    },
    [setLessonTeachingState]
  );

  // Filter data theo classroom được chọn - memoized
  const getFilteredDataByClassroom = useCallback(
    (data: LessonType[]) => {
      // Defensive programming
      if (!Array.isArray(data) || data.length === 0) {
        console.log("🐛 No data to filter:", data);
        return [];
      }

      // Nếu activeTab là "all", hiển thị tất cả
      if (!activeTab || activeTab === "all") {
        return data;
      }

      // Filter theo classId của classroom được chọn
      const selectedClassId = parseInt(activeTab);
      return data.filter((lesson) => lesson.classId === selectedClassId);
    },
    [activeTab]
  );

  // Lọc bài giảng đang dạy với memo để tránh re-computation
  const filteredTeachingLessons = useMemo(() => {
    // Validate input data
    if (!Array.isArray(teachingLessons)) {
      console.warn("🐛 teachingLessons is not an array:", teachingLessons);
      return [];
    }

    const filtered = getFilteredDataByClassroom(teachingLessons);
    const sorted = filtered.sort((a, b) => {
      if (a.classId !== b.classId) return a.classId - b.classId;
      if (a.unitId !== b.unitId) return a.unitId - b.unitId;
      return a.lessonId - b.lessonId;
    });

    // Debug logging
    console.log("🐛 Debug - Teaching Lessons:", {
      totalTeachingLessons: teachingLessons?.length || 0,
      activeTab,
      filteredCount: sorted.length,
      breakpoint,
      isClient,
      classroomsWithLessons:
        classrooms?.filter(
          (c) => getTeachingLessonCountByClassId(c.class_id) > 0
        ).length || 0,
      teachingLessons: teachingLessons?.slice(0, 3), // Log first 3 lessons
      selectedClassId: activeTab !== "all" ? parseInt(activeTab) : "all"
    });

    return sorted;
  }, [
    getFilteredDataByClassroom,
    teachingLessons,
    activeTab,
    breakpoint,
    isClient
  ]);

  // Tối ưu callback cho slide navigation
  const handleSlidePrev = useCallback(() => {
    currentSwiper?.slidePrev();
  }, [currentSwiper]);

  const handleSlideNext = useCallback(() => {
    currentSwiper?.slideNext();
  }, [currentSwiper]);

  const handleDotClick = useCallback(
    (index: number) => {
      currentSwiper?.slideTo(index);
      setCurrentSlideIndex(index);
    },
    [currentSwiper]
  );

  // Callback để lưu navigation state trước khi chuyển trang
  const handleNavigateToLesson = useCallback(
    (lessonItem: LessonType) => {
      // Lưu thông tin trang hiện tại vào store
      setPreviousPage({
        url: "/tien-trinh-giang-day/bai-giang-dang-day",
        title: "Bài giảng đang dạy",
        state: {
          activeTab,
          scrollPosition: window.scrollY
        }
      });

      // Cập nhật lesson teaching state
      setLessonTeachingState({
        activeTab,
        scrollPosition: window.scrollY
      });

      // Ghi rõ selected lesson trước khi điều hướng để tránh cache sai
      import("@/store/useSelectLesson")
        .then(({ useSelectLessonStore }) => {
          const { setSelectedLesson } = useSelectLessonStore.getState();
          setSelectedLesson({
            ...lessonItem,
            lessonName: lessonItem.lessonName || "",
            className: lessonItem.className || "",
            unitName: lessonItem.unitName || "",
            imageUrl: lessonItem.imageUrl || ""
          });
        })
        .catch((e) => {
          console.error(
            "[lesson-teaching] failed to set selected lesson before navigate:",
            e
          );
        });

      // Điều hướng
      router.push(`/lesson/${lessonItem.lessonId}`);
    },
    [router, activeTab, setLessonTeachingState, setPreviousPage]
  );

  // Classroom tabs memoized với performance optimization
  const classroomTabs = useMemo(() => {
    if (!Array.isArray(classrooms) || !Array.isArray(teachingLessons)) {
      return [];
    }

    // Chỉ lấy những classroom có lessons đang dạy
    const classroomsWithLessons = classrooms.filter((classroom) => {
      const lessonCount = getTeachingLessonCountByClassId(classroom.class_id);
      return lessonCount > 0;
    });

    // Limit số lượng tabs để tránh lag trên mobile
    const maxTabs = breakpoint === "mobile" ? 10 : 20;
    const classroomsToRender = classroomsWithLessons.slice(0, maxTabs);

    return classroomsToRender.map((classroom: ClassroomType, index: number) => {
      const lessonCount = getTeachingLessonCountByClassId(classroom.class_id);

      return (
        <ClassroomTab
          key={classroom.class_id}
          classroom={classroom}
          index={index}
          activeTab={activeTab}
          lessonCount={lessonCount}
          onClick={() => updateActiveTab(classroom.class_id.toString())}
          classroomIcons={classroomIcons}
        />
      );
    });
  }, [
    classrooms,
    teachingLessons,
    activeTab,
    getTeachingLessonCountByClassId,
    updateActiveTab,
    classroomIcons,
    breakpoint
  ]);

  // Show loading state until client hydration complete
  if (!isClient) {
    return (
      <ContentLayout title="BaiGiangDangDay">
        <div className="flex gap-4 sm:gap-6 md:gap-8 flex-col px-2 sm:px-4 md:px-0">
          <div className="bg-white rounded-lg p-3 sm:p-4 md:p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="flex gap-2 mb-4">
                <div className="h-10 bg-gray-200 rounded w-24"></div>
                <div className="h-10 bg-gray-200 rounded w-24"></div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-32 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout title="BaiGiangDangDay">
      <div
        className={cn(
          "flex gap-4 sm:gap-6 md:gap-8 flex-col px-2 sm:px-4 md:px-0",
          styles.teachingContainer
        )}
      >
        <div className="flex flex-col">
          {/* Tab Component */}
          <div className="w-full">
            {/* Tab Content */}
            {/* Bài giảng đang dạy */}
            <div
              className={cn(
                "bg-white rounded-lg p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-5 md:space-y-6",
                styles.performanceOptimized
              )}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex-shrink-0">
                  <SectionTitle
                    title="Bài giảng đang dạy"
                    image={{
                      src: "/assets/gif/book_animate.gif",
                      width: 32,
                      height: 32,
                      alt: "book_animate"
                    }}
                    wrapperClassName="border-[#4079CE]"
                  />
                </div>
              </div>

              {/* Debug info cho development */}
              {process.env.NODE_ENV === "development" && (
                <div className="bg-yellow-50 hidden border border-yellow-200 rounded p-2 text-xs">
                  <p>
                    <strong>Debug Info:</strong>
                  </p>
                  <p>Total Teaching Lessons: {teachingLessons?.length || 0}</p>
                  <p>Filtered Lessons: {filteredTeachingLessons.length}</p>
                  <p>Active Tab: {activeTab}</p>
                  <p>
                    Selected Class ID:{" "}
                    {activeTab !== "all" ? activeTab : "Tất cả"}
                  </p>
                  <p>Breakpoint: {breakpoint}</p>
                  <p>Is Client: {isClient.toString()}</p>
                  <p>Slides Per View: {slidesPerView}</p>
                  <p>
                    Classrooms with Lessons:{" "}
                    {classrooms?.filter(
                      (c) => getTeachingLessonCountByClassId(c.class_id) > 0
                    ).length || 0}
                  </p>
                  <p>Classroom Tabs: {classroomTabs.length}</p>
                </div>
              )}

              {/* Tab Headers - Enhanced UI với gradient background */}
              <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 sm:p-5 md:p-6 rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      Lọc theo lớp học
                    </h3>
                    <p className="text-sm text-gray-600">
                      Chọn lớp học để xem bài giảng đang dạy
                    </p>
                  </div>
                </div>

                {/* Tab container với responsive scroll */}
                <div
                  className={cn("overflow-x-auto pb-2", styles.tabsContainer)}
                >
                  <div className="flex gap-2 sm:gap-3 min-w-max">
                    {/* Tab "Tất cả lớp học" */}
                    <Button
                      variant="ghost"
                      size="default"
                      onClick={() => updateActiveTab("all")}
                      className={cn(
                        "px-4 sm:px-5 md:px-6 py-3 sm:py-3.5 md:py-4",
                        "text-sm sm:text-base md:text-lg font-semibold",
                        "transition-all duration-300 shadow-sm hover:shadow-md",
                        "flex items-center gap-3 sm:gap-4",
                        "min-w-0 flex-shrink-0 rounded-xl border-2",
                        activeTab === "all"
                          ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-emerald-600 hover:to-green-500 text-white border-green-500 shadow-lg shadow-green-200/50 scale-105"
                          : "bg-white text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-green-50 border-gray-200 hover:border-green-300 hover:text-green-800"
                      )}
                    >
                      <span className="flex items-center gap-2 sm:gap-3">
                        <div
                          className={cn(
                            "p-1.5 rounded-lg transition-all duration-300",
                            activeTab === "all"
                              ? "bg-white/20 shadow-inner"
                              : "bg-gray-100 group-hover:bg-green-100"
                          )}
                        >
                          <GraduationCap
                            className={cn(
                              "w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300",
                              activeTab === "all"
                                ? "text-white drop-shadow-sm"
                                : "text-green-600 group-hover:text-green-700"
                            )}
                          />
                        </div>
                        <span className="whitespace-nowrap">
                          Tất cả lớp học
                        </span>
                      </span>
                      <div
                        className={cn(
                          "px-2 py-1 rounded-full text-xs font-bold",
                          "whitespace-nowrap flex-shrink-0 transition-all duration-300",
                          "hidden xs:flex items-center justify-center min-w-[24px]",
                          activeTab === "all"
                            ? "bg-white/25 text-white shadow-inner"
                            : "bg-gray-200 text-gray-600 group-hover:bg-green-200 group-hover:text-green-800"
                        )}
                      >
                        {(teachingLessons || []).length}
                      </div>
                    </Button>

                    {/* Các tab lớp học */}
                    {classroomTabs}
                  </div>
                </div>

                {/* Filter status indicator */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="text-gray-600 font-medium flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Đang hiển thị:
                    </span>
                    {activeTab === "all" ? (
                      <span className="px-3 py-1.5 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-full font-semibold border border-green-200">
                        Tất cả lớp học ({(teachingLessons || []).length} bài)
                      </span>
                    ) : (
                      <span className="px-3 py-1.5 bg-gradient-to-r from-pink-100 to-rose-100 text-pink-800 rounded-full font-semibold border border-pink-200">
                        {
                          classrooms.find(
                            (c) => c.class_id.toString() === activeTab
                          )?.classname
                        }
                        ({filteredTeachingLessons.length} bài)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Content area với responsive padding */}
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6">
                {filteredTeachingLessons.length > 0 ? (
                  <div className="relative">
                    {/* Swiper component với fallback cho mobile */}
                    {breakpoint === "mobile" &&
                    filteredTeachingLessons.length === 1 ? (
                      // Simple grid fallback cho mobile với 1 lesson
                      <div className="grid grid-cols-1 gap-4">
                        {filteredTeachingLessons.map((lesson, index) => (
                          <div key={`${lesson.lessonId}-${index}`}>
                            <LessonSlide
                              lesson={lesson}
                              onNavigateToLesson={handleNavigateToLesson}
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      // Swiper cho multiple lessons hoặc desktop
                      <>
                        <Swiper
                          onSwiper={setCurrentSwiper}
                          onSlideChange={(swiper) =>
                            setCurrentSlideIndex(swiper.activeIndex)
                          }
                          modules={[Navigation, Autoplay]}
                          spaceBetween={12}
                          slidesPerView={1}
                          slidesPerGroup={1}
                          autoplay={{
                            delay: 4000,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true
                          }}
                          watchSlidesProgress={true} // Enable slide progress watching cho performance
                          breakpoints={{
                            // Mobile siêu nhỏ
                            320: {
                              slidesPerView: 1,
                              slidesPerGroup: 1,
                              spaceBetween: 8
                            },
                            // Mobile nhỏ
                            480: {
                              slidesPerView: 1,
                              slidesPerGroup: 1,
                              spaceBetween: 10
                            },
                            // Mobile lớn / Tablet nhỏ
                            640: {
                              slidesPerView: 2,
                              slidesPerGroup: 2,
                              spaceBetween: 12
                            },
                            // Tablet
                            768: {
                              slidesPerView: 3,
                              slidesPerGroup: 3,
                              spaceBetween: 16
                            },
                            // Desktop nhỏ
                            1024: {
                              slidesPerView: 4,
                              slidesPerGroup: 4,
                              spaceBetween: 20
                            },
                            // Desktop lớn
                            1280: {
                              slidesPerView: 5,
                              slidesPerGroup: 5,
                              spaceBetween: 20
                            }
                          }}
                          className={cn(
                            "teaching-lessons-swiper",
                            styles.swiperContainer
                          )}
                        >
                          {filteredTeachingLessons.map((lesson, index) => (
                            <SwiperSlide key={`${lesson.lessonId}-${index}`}>
                              <LessonSlide
                                lesson={lesson}
                                onNavigateToLesson={handleNavigateToLesson}
                              />
                            </SwiperSlide>
                          ))}
                        </Swiper>

                        {/* Navigation buttons - chỉ hiển thị khi có > 1 lesson */}
                        {filteredTeachingLessons.length > 1 && (
                          <div className="flex items-center justify-center gap-2 sm:gap-3 mt-3 sm:mt-4">
                            <Button
                              variant="outline"
                              size="sm"
                              className={cn(
                                "rounded-full bg-white border-gray-200",
                                "hover:border-gray-300 hover:bg-gray-50",
                                "w-8 h-8 sm:w-10 sm:h-10 p-0",
                                "transition-all duration-200",
                                styles.navigationButton
                              )}
                              onClick={handleSlidePrev}
                            >
                              <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Button>

                            {/* Optimized Navigation Dots */}
                            <NavigationDots
                              totalSlides={filteredTeachingLessons.length}
                              currentIndex={currentSlideIndex}
                              onDotClick={handleDotClick}
                              slidesPerView={slidesPerView}
                            />

                            <Button
                              variant="outline"
                              size="sm"
                              className={cn(
                                "rounded-full bg-white border-gray-200",
                                "hover:border-gray-300 hover:bg-gray-50",
                                "w-8 h-8 sm:w-10 sm:h-10 p-0",
                                "transition-all duration-200",
                                styles.navigationButton
                              )}
                              onClick={handleSlideNext}
                            >
                              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 py-8 sm:py-12 md:py-16">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gray-100 rounded-full flex items-center justify-center">
                      <Image
                        src="/assets/image/no_course.png"
                        alt="no-course"
                        width={32}
                        height={32}
                        className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12"
                      />
                    </div>
                    <div className="text-center max-w-sm">
                      <p className="text-gray-600 font-medium text-sm sm:text-base md:text-lg">
                        {activeTab === "all"
                          ? "Hiện tại chưa có bài học nào đang dạy!"
                          : `Chưa có bài học nào đang dạy trong lớp này!`}
                      </p>
                      <p className="text-xs sm:text-sm md:text-base text-gray-500 mt-1">
                        Hãy bắt đầu một bài học mới để tiếp tục hành trình học
                        tập
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ContentLayout>
  );
}

export default memo(LessonTeachingClient);
