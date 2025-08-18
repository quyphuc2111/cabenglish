import LessonCard from "@/components/lesson/lesson-card";
import Image from "next/image";
import React from "react";
import { CourseCarousel } from "@/components/carousel/course-carousel";
import { PaginatedContent } from "@/components/common/paginated-content";
import { useSelectLessonStore } from "@/store/useSelectLesson";

interface NextLectureProps {
  nextLectures: any[];
  classId: string;
  handleLessonClick: (lessonId: number) => void;
  isExtraSmall: boolean;
  t: any;
  classroomData?: any[];
}

const NextLecture = ({
  nextLectures,
  classId,
  handleLessonClick,
  isExtraSmall,
  t,
  classroomData
}: NextLectureProps) => {
  const { setSelectedLesson } = useSelectLessonStore();

  const handleLessonClickWithData = (lecture: any) => {
    // Set lesson data vào store trước khi navigate
    setSelectedLesson({
      classId: lecture.classId || classId,
      unitId: lecture.unitId,
      lessonId: lecture.lessonId,
      schoolWeekId: lecture.schoolWeekId,
      lessonName: lecture.lessonName || "",
      className: lecture.className || "",
      unitName: lecture.unitName || "",
      imageUrl: lecture.imageUrl || "",
      schoolWeekID: lecture.schoolWeekId,
      progress: lecture.progress,
      numLiked: lecture.numLiked,
      isLocked: lecture.isLocked,
      schoolWeek: lecture.schoolWeek,
      lessonOrder: lecture.lessonOrder || 0
    });

    // Gọi handleLessonClick gốc để navigate
    handleLessonClick(lecture.lessonId);
  };
  if (nextLectures.length === 0) {
    return (
      <div className="w-full xl:w-full flex flex-col space-y-3 sm:space-y-4 md:space-y-6 min-w-0 overflow-visible">
        <div className="flex items-center gap-2 sm:gap-3">
          <Image
            src="/person_rank.png"
            alt="person_rank"
            width={35}
            height={35}
            className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8"
          />

          <div>
            <h3 className="text-sm sm:text-md md:text-lg font-bold text-gray-800">
              {t("nextLecture")}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600">
              Bài giảng sắp tới
            </p>
          </div>
        </div>

        <div className="flex flex-col w-full items-center justify-center gap-2 sm:gap-3 md:gap-4 py-6 sm:py-8 md:py-12 border border-gray-200 rounded-xl h-full">
          <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
            <Image
              src="/person_rank.png"
              alt="person_rank"
              width={32}
              height={32}
              className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10"
            />
          </div>
          <div className="text-center px-2">
            <p className="text-gray-600 font-medium text-xs sm:text-sm md:text-base">
              Chưa có bài học tiếp theo!
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Tất cả bài học đã hoàn thành
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col space-y-3 sm:space-y-4 md:space-y-6 min-w-0 overflow-visible">
      <div className="flex items-center gap-2 sm:gap-3">
        <Image
          src="/person_rank.png"
          alt="person_rank"
          width={35}
          height={35}
          className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8"
        />

        <div>
          <h3 className="text-sm sm:text-md md:text-lg font-bold text-gray-800">
            {t("nextLecture")}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600">Bài giảng sắp tới</p>
        </div>
      </div>

      <div className="min-h-[230px] sm:min-h-[320px] md:min-h-[370px] lg:min-h-[330px]">
        {/* Comment: CourseCarousel cũ - đã thay thế bằng PaginatedContent
        <CourseCarousel
          courseData={nextLectures}
          className="h-full"
          onLessonClick={handleLessonClick}
          classroomData={classroomData}
          containerType="next"
        />
        */}

        {/* Grid/List + Pagination mới */}
        <PaginatedContent
          items={nextLectures}
          itemsPerPage={4}
          renderItem={(lecture) => (
            <LessonCard
              key={lecture.lessonId}
              classId={lecture.classId || classId}
              unitId={lecture.unitId}
              schoolWeekId={lecture.schoolWeekId}
              unitName={lecture.unitName}
              imageUrl={lecture.imageUrl}
              schoolWeek={lecture.schoolWeek}
              classRoomName={lecture.className}
              lessonName={lecture.lessonName}
              progress={lecture.progress}
              numLiked={lecture.numLiked}
              isLocked={lecture.isLocked}
              lessonId={lecture.lessonId}
              onClick={() => handleLessonClickWithData(lecture)}
            />
          )}
          rowPerPage={2} // 2 cột để phù hợp với layout chia đôi
          itemInPage={[4, 8, 12]} // Options cho items per page
          className="h-full"
        />
      </div>
    </div>
  );
};

export default NextLecture;
