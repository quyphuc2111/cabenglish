import LessonCard from "@/components/lesson/lesson-card";
import Image from "next/image";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface NextLectureProps {
  nextLectures: any[];
  classId: string;
  handleLessonClick: (lessonId: number) => void;
  isExtraSmall: boolean;
  t: any;
}

// Pagination component for NextLecture
const Pagination = ({
  totalPages,
  currentPage,
  onPageChange,
  classId
}: {
  totalPages: number;
  currentPage: number;
  onPageChange: (classId: string, page: number) => void;
  classId: string;
}) => {
  if (totalPages < 1) return null;

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5; // Số trang tối đa hiển thị

    if (totalPages <= maxVisible) {
      // Nếu tổng số trang <= maxVisible, hiển thị tất cả
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Nếu nhiều trang hơn, chỉ hiển thị một số trang xung quanh trang hiện tại
      const start = Math.max(0, currentPage - 2);
      const end = Math.min(totalPages - 1, currentPage + 2);

      // Luôn hiển thị trang đầu
      if (start > 0) {
        pages.push(0);
        if (start > 1) pages.push(-1); // Dấu ...
      }

      // Hiển thị các trang xung quanh trang hiện tại
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Luôn hiển thị trang cuối
      if (end < totalPages - 1) {
        if (end < totalPages - 2) pages.push(-1); // Dấu ...
        pages.push(totalPages - 1);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex justify-center items-center gap-2 mt-3">
      {/* Nút đầu trang */}
      <button
        onClick={() => onPageChange(classId, 0)}
        disabled={currentPage === 0}
        className="px-2 py-1 text-xs rounded-md bg-gray-100 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
        title="Trang đầu"
      >
        ⟪
      </button>

      <button
        onClick={() => onPageChange(classId, Math.max(0, currentPage - 1))}
        disabled={currentPage === 0}
        className="px-3 py-1 text-xs rounded-md bg-gray-100 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
      >
        ← Trước
      </button>

      <span className="text-xs text-gray-600">
        {currentPage + 1} / {totalPages}
      </span>

      <button
        onClick={() =>
          onPageChange(classId, Math.min(totalPages - 1, currentPage + 1))
        }
        disabled={currentPage === totalPages - 1}
        className="px-3 py-1 text-xs rounded-md bg-gray-100 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
      >
        Sau →
      </button>

      {/* Nút cuối trang */}
      <button
        onClick={() => onPageChange(classId, totalPages - 1)}
        disabled={currentPage === totalPages - 1}
        className="px-2 py-1 text-xs rounded-md bg-gray-100 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
        title="Trang cuối"
      >
        ⟫
      </button>
    </div>
  );
};

const NextLecture = ({
  nextLectures,
  classId,
  handleLessonClick,
  isExtraSmall,
  t
}: NextLectureProps) => {
  const [nextPage, setNextPage] = useState(0);
  const [direction, setDirection] = useState(0);
  const itemsPerPage = 2;

  const totalPages = Math.ceil(nextLectures.length / itemsPerPage);
  const startIndex = nextPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const nextLecturesData = nextLectures.slice(startIndex, endIndex);

  const handleNextPageChange = (classId: string, page: number) => {
    setDirection(page > nextPage ? 1 : -1);
    setNextPage(page);
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

  if (nextLectures.length === 0) {
    return (
      <div className="w-full lg:w-8/12 flex flex-col space-y-3 sm:space-y-4 md:space-y-6 min-w-0 overflow-visible">
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
    <div className="w-full lg:w-8/12 flex flex-col space-y-3 sm:space-y-4 md:space-y-6 min-w-0 overflow-visible">
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

      <div className="relative overflow-hidden lesson-container min-h-[230px] sm:min-h-[320px] md:min-h-[370px] lg:min-h-[330px] h-[230px] sm:h-[320px] md:h-[370px] lg:h-[330px]">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={nextPage}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 }
            }}
            className="flex flex-row gap-2 sm:gap-3 w-full"
          >
            {nextLecturesData.map((courseItem, index) => {
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

      <Pagination
        totalPages={totalPages}
        currentPage={nextPage}
        onPageChange={handleNextPageChange}
        classId={classId}
      />
    </div>
  );
};

export default NextLecture;
