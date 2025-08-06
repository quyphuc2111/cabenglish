"use client";
import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LessonType } from "@/types/lesson";
import LessonCard from "@/components/lesson/lesson-card";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { ChevronLeft, ChevronRight, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

import "swiper/css";
import "swiper/css/navigation";
import { useRouter, useSearchParams } from "next/navigation";
import SectionTitle from "@/components/common/section-title";

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
    classroom: any;
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
          "px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-5",
          "text-xs sm:text-sm md:text-base font-medium",
          "transition-all duration-200 shadow-none",
          "flex items-center gap-1 sm:gap-2 md:gap-4 lg:gap-6",
          // Responsive width
          "min-w-0 flex-shrink-0 max-w-[120px] sm:max-w-[150px] md:max-w-[200px] lg:max-w-none",
          // Active state
          isActive
            ? "border bg-[#F09DA4] hover:bg-[#F09DA4] text-white"
            : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300 border"
        )}
      >
        <span className="flex items-center gap-1 sm:gap-2 min-w-0 flex-1">
          <IconComponent
            className={cn(
              "w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0",
              iconData.color,
              isActive && "text-white"
            )}
          />
          <span className="truncate text-xs sm:text-sm md:text-base">
            {classroom.classname}
          </span>
        </span>

        <div
          className={cn(
            "text-[10px] sm:text-xs font-medium",
            "whitespace-nowrap flex-shrink-0",
            "hidden xs:block", // Ẩn trên màn hình siêu nhỏ
            isActive ? "text-white" : "text-gray-500"
          )}
        >
          • {lessonCount}
        </div>
      </Button>
    );
  }
);

ClassroomTab.displayName = "ClassroomTab";

interface LessonTeachingClientProps {
  teachingLessons: LessonType[];
  initialFilterData: any;
}

function LessonTeachingClient({
  teachingLessons,
  initialFilterData
}: LessonTeachingClientProps) {
  const [currentSwiper, setCurrentSwiper] = useState<any>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Lấy activeTab từ URL parameter, mặc định là "all"
  const urlActiveTab = searchParams.get("classId") || "all";

  // State local để quản lý activeTab, khởi tạo từ URL
  const [activeTab, setActiveTabState] = useState<string>(urlActiveTab);

  // Đồng bộ state local với URL params khi URL thay đổi
  useEffect(() => {
    setActiveTabState(urlActiveTab);
  }, [urlActiveTab]);

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
      return (teachingLessons || []).filter(
        (lesson) => lesson.classId === classId
      ).length;
    },
    [teachingLessons]
  );

  // Function để update activeTab và URL parameter - memoized
  const setActiveTab = useCallback(
    (tab: string) => {
      // Update state local ngay lập tức để UI responsive
      setActiveTabState(tab);

      // Update URL parameter trong background - debounced
      requestIdleCallback(() => {
        const params = new URLSearchParams(searchParams);
        if (tab === "all") {
          params.delete("classId");
        } else {
          params.set("classId", tab);
        }
        router.replace(`?${params.toString()}`, { scroll: false });
      });
    },
    [searchParams, router]
  );

  // Filter data theo classroom được chọn - memoized
  const getFilteredDataByClassroom = useCallback(
    (data: any[]) => {
      return data.filter((course) => {
        if (!activeTab || activeTab === "all") return true;
        return course.classId === parseInt(activeTab);
      });
    },
    [activeTab]
  );

  // Lọc bài giảng đang dạy - memoized
  const filteredTeachingLessons = useMemo(() => {
    return getFilteredDataByClassroom(teachingLessons || []).sort((a, b) => {
      if (a.classId !== b.classId) return a.classId - b.classId;
      if (a.unitId !== b.unitId) return a.unitId - b.unitId;
      return a.lessonId - b.lessonId;
    });
  }, [getFilteredDataByClassroom, teachingLessons]);

  // Classroom tabs memoized
  const classroomTabs = useMemo(() => {
    return initialFilterData.classrooms?.map(
      (classroom: any, index: number) => {
        const lessonCount = getTeachingLessonCountByClassId(
          parseInt(classroom.class_id)
        );

        return (
          <ClassroomTab
            key={classroom.class_id}
            classroom={classroom}
            index={index}
            activeTab={activeTab}
            lessonCount={lessonCount}
            onClick={() => setActiveTab(classroom.class_id.toString())}
            classroomIcons={classroomIcons}
          />
        );
      }
    );
  }, [
    initialFilterData.classrooms,
    activeTab,
    getTeachingLessonCountByClassId,
    setActiveTab,
    classroomIcons
  ]);

  return (
    <ContentLayout title="BaiGiangDangDay">
      <div className="flex gap-4 sm:gap-6 md:gap-8 flex-col px-2 sm:px-4 md:px-0">
        <div className="flex flex-col">
          {/* Tab Component */}
          <div className="w-full">
            {/* Tab Content */}
            {/* Bài giảng đang dạy */}
            <div className="bg-white rounded-lg p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-5 md:space-y-6">
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

              {/* Tab Headers - Responsive horizontal scroll */}
              <div className="overflow-x-auto pb-2">
                <div className="flex gap-1 sm:gap-2 min-w-max">
                  {/* Tab "Tất cả lớp học" */}
                  <Button
                    variant={activeTab === "all" ? "default" : "outline"}
                    size="default"
                    onClick={() => setActiveTab("all")}
                    className={cn(
                      "px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-5",
                      "text-xs sm:text-sm md:text-base font-medium",
                      "transition-all duration-200 shadow-none",
                      "flex items-center gap-1 sm:gap-2 md:gap-4 lg:gap-6",
                      "min-w-0 flex-shrink-0",
                      activeTab === "all"
                        ? "border bg-[#F09DA4] hover:bg-[#F09DA4] text-white"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    )}
                  >
                    <span className="flex items-center gap-1 sm:gap-2">
                      <GraduationCap
                        className={cn(
                          "w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5",
                          activeTab === "all" ? "text-white" : "text-green-600"
                        )}
                      />
                      <span className="whitespace-nowrap text-xs sm:text-sm md:text-base">
                        Tất cả lớp học
                      </span>
                    </span>
                    <div
                      className={cn(
                        "text-[10px] sm:text-xs font-medium whitespace-nowrap",
                        "hidden xs:block", // Ẩn trên màn hình siêu nhỏ
                        activeTab === "all" ? "text-white" : "text-gray-500"
                      )}
                    >
                      • {(teachingLessons || []).length}
                    </div>
                  </Button>

                  {/* Các tab lớp học */}
                  {classroomTabs}
                </div>
              </div>

              {/* Content area với responsive padding */}
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6">
                {filteredTeachingLessons.length > 0 ? (
                  <div className="relative">
                    <Swiper
                      onSwiper={setCurrentSwiper}
                      onSlideChange={(swiper) =>
                        setCurrentSlideIndex(swiper.activeIndex)
                      }
                      modules={[Navigation, Autoplay]}
                      spaceBetween={12} // Giảm spacing cho mobile
                      slidesPerView={1} // Mặc định 1 slide cho mobile
                      slidesPerGroup={1}
                      autoplay={{
                        delay: 4000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true
                      }}
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
                      className="teaching-lessons-swiper"
                    >
                      {filteredTeachingLessons.map((lesson, index) => {
                        const customLesson = {
                          ...lesson,
                          classRoomName: lesson.className
                        };
                        return (
                          <SwiperSlide key={`${lesson.lessonId}-${index}`}>
                            <LessonCard
                              {...customLesson}
                              className="transform hover:scale-[1.02] transition-all duration-300"
                              onClick={() =>
                                !lesson.isLocked &&
                                router.push(`/lesson/${lesson.lessonId}`)
                              }
                            />
                          </SwiperSlide>
                        );
                      })}
                    </Swiper>

                    {/* Navigation buttons - responsive */}
                    {filteredTeachingLessons.length > 1 && (
                      <div className="flex items-center justify-center gap-2 sm:gap-3 mt-3 sm:mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className={cn(
                            "rounded-full bg-white border-gray-200",
                            "hover:border-gray-300 hover:bg-gray-50",
                            "w-8 h-8 sm:w-10 sm:h-10 p-0"
                          )}
                          onClick={() => currentSwiper?.slidePrev()}
                        >
                          <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>

                        {/* Dot indicators - responsive */}
                        <div className="flex gap-1 sm:gap-2">
                          {Array.from({
                            length: Math.ceil(
                              filteredTeachingLessons.length /
                                (window.innerWidth < 640
                                  ? 1
                                  : window.innerWidth < 768
                                  ? 2
                                  : window.innerWidth < 1024
                                  ? 3
                                  : window.innerWidth < 1280
                                  ? 4
                                  : 5)
                            )
                          }).map((_, idx) => (
                            <div
                              key={idx}
                              className={cn(
                                "rounded-full cursor-pointer transition-all duration-300",
                                "w-1.5 h-1.5 sm:w-2 sm:h-2",
                                Math.floor(
                                  currentSlideIndex /
                                    (window.innerWidth < 640
                                      ? 1
                                      : window.innerWidth < 768
                                      ? 2
                                      : window.innerWidth < 1024
                                      ? 3
                                      : window.innerWidth < 1280
                                      ? 4
                                      : 5)
                                ) === idx
                                  ? "bg-blue-500 scale-125"
                                  : "bg-gray-300 hover:bg-gray-400"
                              )}
                              onClick={() => {
                                const slidesPerView =
                                  window.innerWidth < 640
                                    ? 1
                                    : window.innerWidth < 768
                                    ? 2
                                    : window.innerWidth < 1024
                                    ? 3
                                    : window.innerWidth < 1280
                                    ? 4
                                    : 5;
                                currentSwiper?.slideTo(idx * slidesPerView);
                                setCurrentSlideIndex(idx * slidesPerView);
                              }}
                            />
                          ))}
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          className={cn(
                            "rounded-full bg-white border-gray-200",
                            "hover:border-gray-300 hover:bg-gray-50",
                            "w-8 h-8 sm:w-10 sm:h-10 p-0"
                          )}
                          onClick={() => currentSwiper?.slideNext()}
                        >
                          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 py-8 sm:py-12">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center">
                      <Image
                        src="/assets/image/no_course.png"
                        alt="no-course"
                        width={32}
                        height={32}
                        className="w-8 h-8 sm:w-10 sm:h-10"
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-gray-600 font-medium text-sm sm:text-base">
                        Hiện tại chưa có bài học nào đang dạy!
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        Hãy bắt đầu một bài học mới
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
