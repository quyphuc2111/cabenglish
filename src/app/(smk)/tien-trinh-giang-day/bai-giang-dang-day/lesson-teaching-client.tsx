"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LessonType } from "@/types/lesson";
import LessonCard from "@/components/lesson/lesson-card";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import {
  ChevronLeft,
  ChevronRight,
  Edit3,
  BookOpen,
  GraduationCap,
  Users,
  Building2,
  BookText,
  FileText,
  Target,
  Star,
  Grid3X3
} from "lucide-react";
import { cn } from "@/lib/utils";

import "swiper/css";
import "swiper/css/navigation";
import { useRouter, useSearchParams } from "next/navigation";
import SectionTitle from "@/components/common/section-title";

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

  // Mảng icon cho các lớp học
  const classroomIcons = [
    { icon: GraduationCap, color: "text-blue-600" },
    { icon: GraduationCap, color: "text-green-600" },
    { icon: GraduationCap, color: "text-purple-600" },
    { icon: GraduationCap, color: "text-orange-600" },
    { icon: GraduationCap, color: "text-red-600" },
    { icon: GraduationCap, color: "text-indigo-600" },
    { icon: GraduationCap, color: "text-pink-600" },
    { icon: GraduationCap, color: "text-yellow-600" }
  ];

  // Function để tính số lượng bài giảng đang học theo class_id
  const getTeachingLessonCountByClassId = useCallback(
    (classId: number) => {
      return (teachingLessons || []).filter(
        (lesson) => lesson.classId === classId
      ).length;
    },
    [teachingLessons]
  );

  // Function để update activeTab và URL parameter
  const setActiveTab = useCallback(
    (tab: string) => {
      // Update state local ngay lập tức để UI responsive
      setActiveTabState(tab);

      // Update URL parameter trong background
      const params = new URLSearchParams(searchParams);
      if (tab === "all") {
        params.delete("classId");
      } else {
        params.set("classId", tab);
      }
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [searchParams, router]
  );

  // Filter data theo classroom được chọn
  const getFilteredDataByClassroom = (data: any[]) => {
    return data.filter((course) => {
      if (!activeTab || activeTab === "all") return true;
      return course.classId === parseInt(activeTab);
    });
  };

  // Lọc bài giảng đang dạy
  const filteredTeachingLessons = useMemo(() => {
    return getFilteredDataByClassroom(teachingLessons || []).sort((a, b) => {
      if (a.classId !== b.classId) return a.classId - b.classId;
      if (a.unitId !== b.unitId) return a.unitId - b.unitId;
      return a.lessonId - b.lessonId;
    });
  }, [activeTab, teachingLessons]);

  return (
    <ContentLayout title="BaiGiangDangDay">
      <div className="flex gap-8 flex-col">
        <div className="flex flex-col">
          {/* Tab Component */}
          <div className="w-full">
            {/* Tab Content */}
            {/* Bài giảng đang dạy */}
            <div className="bg-white rounded-lg p-6 space-y-6">
              <div className="flex items-center gap-3">
                {/* <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
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
                </div> */}
                <div className="flex-shrink-0 ">
                  <SectionTitle
                    title="Bài giảng đang dạy"
                    image={{
                      src: "/assets/gif/book_animate.gif",
                      width: 40,
                      height: 40,
                      alt: "book_animate"
                    }}
                    wrapperClassName="border-[#4079CE]"
                  />
                </div>
              </div>

              {/* Tab Headers */}
              <div className="flex gap-2 mb-6">
                {/* Tab "Tất cả lớp học" */}
                <Button
                  variant={activeTab === "all" ? "default" : "outline"}
                  size="default"
                  onClick={() => setActiveTab("all")}
                  className={` pl-6 pr-2 py-5 text-base font-medium transition-all duration-200 shadow-none flex items-center gap-6 ${
                    activeTab === "all"
                      ? "border bg-[#F09DA4]  hover:bg-[#F09DA4]"
                      : "bg-white text-gray-700 hover:bg-gray-50 "
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <GraduationCap
                      className={`w-5 h-5 ${
                        activeTab === "all" ? "text-white" : "text-green-600"
                      }`}
                    />
                    Tất cả lớp học
                  </span>
                  <div
                    className={`text-xs font-medium translate-y-[1.3px]  truncate w-20   ${
                      activeTab === "all" ? "text-white" : "text-gray-500"
                    }`}
                  >
                    • {(teachingLessons || []).length} bài học
                  </div>
                </Button>

                {/* Các tab lớp học */}
                {initialFilterData.classrooms?.map(
                  (classroom: any, index: number) => {
                    const iconData =
                      classroomIcons[index % classroomIcons.length];
                    const IconComponent = iconData.icon;
                    const lessonCount = getTeachingLessonCountByClassId(
                      parseInt(classroom.class_id)
                    );

                    return (
                      <Button
                        size="default"
                        key={classroom.class_id}
                        onClick={() =>
                          setActiveTab(classroom.class_id.toString())
                        }
                        className={`pl-6 pr-2 py-5 text-base font-medium transition-all duration-200 shadow-none flex items-center gap-6 ${
                          activeTab === classroom.class_id.toString()
                            ? "border bg-[#F09DA4]  hover:bg-[#F09DA4]"
                            : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300 border"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <IconComponent
                            className={`w-5 h-5 ${iconData.color} ${
                              activeTab === classroom.class_id.toString()
                                ? "text-white"
                                : ""
                            }`}
                          />
                          {classroom.classname}
                        </span>

                        <div
                          className={`text-xs font-medium translate-y-[1.2px] truncate w-20 ${
                            activeTab === classroom.class_id.toString()
                              ? "text-white"
                              : "text-gray-500"
                          }`}
                        >
                          • {lessonCount} bài học
                        </div>
                      </Button>
                    );
                  }
                )}
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
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
                          slidesPerGroup: 1
                        },
                        640: {
                          slidesPerView: 2,
                          slidesPerGroup: 2
                        },
                        768: {
                          slidesPerView: 3,
                          slidesPerGroup: 3
                        },
                        1024: {
                          slidesPerView: 4,
                          slidesPerGroup: 4
                        },
                        1280: {
                          slidesPerView: 5,
                          slidesPerGroup: 5
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
                          <SwiperSlide key={index}>
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

                    {filteredTeachingLessons.length > 5 && (
                      <div className="flex items-center justify-center gap-3 mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-10 h-10 rounded-full bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                          onClick={() => currentSwiper?.slidePrev()}
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <div className="flex gap-2">
                          {Array.from({
                            length: Math.ceil(
                              filteredTeachingLessons.length / 5
                            )
                          }).map((_, idx) => (
                            <div
                              key={idx}
                              className={cn(
                                "w-2 h-2 rounded-full cursor-pointer transition-all duration-300",
                                Math.floor(currentSlideIndex / 5) === idx
                                  ? "bg-blue-500 scale-125"
                                  : "bg-gray-300 hover:bg-gray-400"
                              )}
                              onClick={() => {
                                currentSwiper?.slideTo(idx * 5);
                                setCurrentSlideIndex(idx * 5);
                              }}
                            />
                          ))}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-10 h-10 rounded-full bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                          onClick={() => currentSwiper?.slideNext()}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-4 py-12">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
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
          </div>
        </div>
      </div>
    </ContentLayout>
  );
}

export default LessonTeachingClient;
