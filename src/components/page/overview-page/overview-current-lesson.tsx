import LessonCard from "@/components/lesson/lesson-card";
import Image from "next/image";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

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
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0);
  const itemsPerPage = isExtraSmall ? 2 : 1; // 2 items below lg (640px), 1 item on lg+ (1024px+)

  const totalPages = Math.ceil(lectures.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLecturesData = lectures.slice(startIndex, endIndex);

  const handlePrevious = () => {
    setDirection(-1);
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%"
    }),
    center: {
      x: 0
    },
    exit: (direction: number) => ({
      x: direction < 0 ? "100%" : "-100%"
    })
  };

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
        <>
          <div className="relative overflow-hidden lesson-container min-h-[230px] sm:min-h-[320px] md:min-h-[370px] lg:min-h-[330px] h-[230px] sm:h-[320px] md:h-[370px] lg:h-[330px]">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentPage}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 }
                }}
                className="flex flex-row gap-1 sm:gap-2 md:gap-3 w-full"
              >
                {currentLecturesData.map((courseItem, index) => {
                  const customCourse = {
                    ...courseItem,
                    classRoomName: courseItem.className
                  };
                  return (
                    <div key={index} className="px-0.5 flex-1">
                      <div
                        className={cn(
                          "h-full",
                          isExtraSmall && "transform scale-[0.98]"
                        )}
                      >
                        <LessonCard
                          {...customCourse}
                          onClick={() => handleLessonClick(courseItem.lessonId)}
                        />
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Simple pagination with only next/previous */}
          {totalPages >= 1 && (
            <div className="flex justify-center items-center gap-2 mt-3">
              {/* Nút đầu trang */}
              <button
                onClick={() => setCurrentPage(0)}
                disabled={currentPage === 0}
                className="px-2 py-1 text-xs rounded-md bg-gray-100 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
                title="Trang đầu"
              >
                ⟪
              </button>

              <button
                onClick={handlePrevious}
                disabled={currentPage === 0}
                className="px-3 py-1 text-xs rounded-md bg-gray-100 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
              >
                ← Trước
              </button>

              <span className="text-xs text-gray-600">
                {currentPage + 1} / {totalPages}
              </span>

              <button
                onClick={handleNext}
                disabled={currentPage === totalPages - 1}
                className="px-3 py-1 text-xs rounded-md bg-gray-100 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
              >
                Sau →
              </button>

              {/* Nút cuối trang */}
              <button
                onClick={() => setCurrentPage(totalPages - 1)}
                disabled={currentPage === totalPages - 1}
                className="px-2 py-1 text-xs rounded-md bg-gray-100 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
                title="Trang cuối"
              >
                ⟫
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CurrentLecture;
