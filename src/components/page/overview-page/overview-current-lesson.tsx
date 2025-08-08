import LessonCard from "@/components/lesson/lesson-card";
import Image from "next/image";
import React from "react";
import { CourseCarousel } from "@/components/carousel/course-carousel";

interface CurrentLectureProps {
  lectures: any[];
  classId: string;
  handleLessonClick: (lessonId: number) => void;
  isExtraSmall: boolean;
  t: any;
}

const CurrentLecture = ({
  lectures,
  classId,
  handleLessonClick,
  isExtraSmall,
  t
}: CurrentLectureProps) => {
  return (
    <div className="w-full lg:w-4/12 flex flex-col space-y-3 sm:space-y-4 md:space-y-6 min-w-0 overflow-visible">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center">
          <Image
            src="/book_light.png"
            alt="book_light"
            width={35}
            height={35}
            className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8"
          />
        </div>
        <div>
          <h3 className="text-sm sm:text-md md:text-lg font-bold text-gray-800">
            {t("lectureBeingTaught")}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600">Bài giảng hiện tại</p>
        </div>
      </div>

      {lectures.length === 0 ? (
        <div className="flex flex-col w-full  items-center justify-center gap-2 sm:gap-3 md:gap-4 py-6 sm:py-8 md:py-12 border border-gray-200 rounded-xl h-full">
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
              Hiện tại chưa có bài học nào!
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Hãy bắt đầu một bài học mới
            </p>
          </div>
        </div>
      ) : (
        <div className="min-h-[230px] sm:min-h-[320px] md:min-h-[370px] lg:min-h-[330px]">
          <CourseCarousel
            courseData={lectures}
            className="h-full"
            onLessonClick={handleLessonClick}
          />
        </div>
      )}
    </div>
  );
};

export default CurrentLecture;
