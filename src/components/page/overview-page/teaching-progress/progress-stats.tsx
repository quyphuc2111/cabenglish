import { ModalData, ModalType } from "@/hooks/useModalStore";
import Image from "next/image";
import { useState, useMemo, memo, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { ProgressChart } from "@/components/charts/progress-chart";
import { motion, AnimatePresence } from "framer-motion";
import { ClassroomType } from "@/types/classroom";
import { formatProgress } from "@/lib/utils";
import { LessonType } from "@/types/lesson";
import OptimizeImage from "@/components/common/optimize-image";
import { toast } from "react-toastify";
import { X } from "lucide-react";

interface ProgressStatsProps {
  onOpen: (type: ModalType, data?: ModalData) => void;
  t: (key: string) => string;
  courseData: LessonType[];
  classroomData: ClassroomType[];
  currentTheme?: string;
  onDataRefetch?: () => Promise<void>;
}

export const ProgressStats = memo(function ProgressStats({
  onOpen,
  t,
  courseData,
  classroomData,
  currentTheme = "theme-red",
  onDataRefetch
}: ProgressStatsProps) {
  const [showChart, setShowChart] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedAge, setSelectedAge] = useState<string | null>(null);
  const [previousPage, setPreviousPage] = useState(0);

  const ITEMS_PER_PAGE = 3;
  const totalPages = Math.ceil(classroomData.length / ITEMS_PER_PAGE);

  // Theme-based color schemes với màu sắc đẹp mắt và hiện đại
  const themeColors: Record<
    string,
    {
      headerGradient: string;
      iconBg: string;
      buttonPrev: string;
      buttonNext: string;
      modalHeader: string;
      progressColors: {
        high: string;
        good: string;
        medium: string;
        low: string;
        minimal: string;
      };
      progressBgs: {
        high: string;
        good: string;
        medium: string;
        low: string;
        minimal: string;
      };
    }
  > = {
    "theme-gold": {
      headerGradient: "from-amber-500 via-yellow-500 to-orange-500",
      iconBg: "from-amber-500 to-yellow-500",
      buttonPrev: "from-amber-500 to-yellow-600",
      buttonNext: "from-yellow-500 to-orange-600",
      modalHeader: "from-amber-500 to-orange-600",
      progressColors: {
        high: "from-green-400 via-emerald-400 to-teal-400",
        good: "from-blue-500 via-sky-500 to-cyan-500",
        medium: "from-amber-500 via-orange-500 to-red-400",
        low: "from-red-500 via-rose-500 to-pink-500",
        minimal: "from-amber-300 via-yellow-300 to-orange-300"
      },
      progressBgs: {
        high: "bg-gradient-to-br from-emerald-50 to-green-100",
        good: "bg-gradient-to-br from-blue-50 to-sky-100",
        medium: "bg-gradient-to-br from-amber-50 to-orange-100",
        low: "bg-gradient-to-br from-red-50 to-rose-100",
        minimal: "bg-gradient-to-br from-amber-50 to-yellow-100"
      }
    },
    "theme-blue": {
      headerGradient: "from-blue-500 via-cyan-500 to-indigo-500",
      iconBg: "from-blue-500 to-cyan-500",
      buttonPrev: "from-blue-500 to-cyan-600",
      buttonNext: "from-cyan-500 to-indigo-600",
      modalHeader: "from-blue-500 to-indigo-600",
      progressColors: {
        high: "from-green-400 via-emerald-400 to-teal-400",
        good: "from-blue-500 via-cyan-500 to-sky-500",
        medium: "from-indigo-500 via-violet-500 to-purple-500",
        low: "from-red-500 via-rose-500 to-pink-500",
        minimal: "from-blue-300 via-cyan-300 to-sky-300"
      },
      progressBgs: {
        high: "bg-gradient-to-br from-emerald-50 to-green-100",
        good: "bg-gradient-to-br from-blue-50 to-cyan-100",
        medium: "bg-gradient-to-br from-indigo-50 to-violet-100",
        low: "bg-gradient-to-br from-red-50 to-rose-100",
        minimal: "bg-gradient-to-br from-blue-50 to-cyan-100"
      }
    },
    "theme-pink": {
      headerGradient: "from-pink-500 via-rose-500 to-purple-500",
      iconBg: "from-pink-500 to-rose-500",
      buttonPrev: "from-pink-500 to-rose-600",
      buttonNext: "from-rose-500 to-purple-600",
      modalHeader: "from-pink-500 to-purple-600",
      progressColors: {
        high: "from-green-400 via-emerald-400 to-teal-400",
        good: "from-pink-500 via-rose-500 to-purple-500",
        medium: "from-purple-500 via-violet-500 to-indigo-500",
        low: "from-red-500 via-rose-500 to-pink-500",
        minimal: "from-pink-300 via-rose-300 to-purple-300"
      },
      progressBgs: {
        high: "bg-gradient-to-br from-emerald-50 to-green-100",
        good: "bg-gradient-to-br from-pink-50 to-rose-100",
        medium: "bg-gradient-to-br from-purple-50 to-violet-100",
        low: "bg-gradient-to-br from-red-50 to-rose-100",
        minimal: "bg-gradient-to-br from-pink-50 to-rose-100"
      }
    },
    "theme-red": {
      headerGradient: "from-red-500 via-pink-500 to-rose-500",
      iconBg: "from-red-500 to-pink-500",
      buttonPrev: "from-red-500 to-pink-600",
      buttonNext: "from-pink-500 to-rose-600",
      modalHeader: "from-red-500 to-rose-600",
      progressColors: {
        high: "from-green-400 via-emerald-400 to-teal-400",
        good: "from-blue-500 via-sky-500 to-cyan-500",
        medium: "from-amber-500 via-orange-500 to-red-400",
        low: "from-red-500 via-rose-500 to-pink-500",
        minimal: "from-red-300 via-rose-300 to-pink-300"
      },
      progressBgs: {
        high: "bg-gradient-to-br from-emerald-50 to-green-100",
        good: "bg-gradient-to-br from-red-50 to-rose-100",
        medium: "bg-gradient-to-br from-orange-50 to-red-100",
        low: "bg-gradient-to-br from-rose-50 to-pink-100",
        minimal: "bg-gradient-to-br from-red-50 to-rose-100"
      }
    }
  };

  const currentColors = themeColors[currentTheme] || themeColors["theme-red"];

  const currentPageData = useMemo(() => {
    const startIndex = currentPage * ITEMS_PER_PAGE;
    return classroomData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [classroomData, currentPage]);

  const chartData = useMemo(() => {
    if (!selectedAge)
      return currentPageData.map((item) => ({
        name: item.classname,
        progress: Number(formatProgress(item.progress))
      }));

    const selectedAgeData = classroomData.find(
      (item) => item.classname === selectedAge
    );

    if (!selectedAgeData) return [];

    const classLessons = courseData.filter(
      (lesson) => lesson.classId === selectedAgeData.class_id
    );

    // Nhóm các lesson theo unitId và tính trung bình progress cho mỗi unit
    const unitMap = new Map();

    classLessons.forEach((lesson) => {
      const unitId = lesson.unitId;
      if (!unitMap.has(unitId)) {
        unitMap.set(unitId, {
          unitName: lesson.unitName,
          totalProgress: 0,
          lessonCount: 0
        });
      }

      const unitData = unitMap.get(unitId);
      unitData.totalProgress += Number(formatProgress(lesson.progress || 0));
      unitData.lessonCount += 1;
    });

    // Chuyển đổi Map thành array và tính trung bình progress
    return Array.from(unitMap.values()).map((unit) => ({
      name: unit.unitName,
      progress: Math.round(unit.totalProgress / unit.lessonCount)
    }));
  }, [selectedAge, classroomData, courseData]);

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return currentColors.progressColors.high;
    if (progress >= 60) return currentColors.progressColors.good;
    if (progress >= 40) return currentColors.progressColors.medium;
    if (progress >= 20) return currentColors.progressColors.low;
    return currentColors.progressColors.minimal;
  };

  const getProgressBgColor = (progress: number) => {
    if (progress >= 80) return currentColors.progressBgs.high;
    if (progress >= 60) return currentColors.progressBgs.good;
    if (progress >= 40) return currentColors.progressBgs.medium;
    if (progress >= 20) return currentColors.progressBgs.low;
    return currentColors.progressBgs.minimal;
  };

  const renderProgressItem = (item: ClassroomType) => {
    const progress = Number(formatProgress(item.progress));

    // Kiểm tra xem có dữ liệu chart hay không
    const selectedAgeData = currentPageData.find(
      (pageItem) => pageItem.classname === item.classname
    );
    const classLessons = selectedAgeData
      ? courseData.filter(
          (lesson) => lesson.classId === selectedAgeData.class_id
        )
      : [];
    const hasChartData = classLessons.length > 0;

    return (
      <motion.div
        key={`${item.classname}-${item.class_id}-${currentPage}`}
        initial={{ opacity: 0, x: currentPage > previousPage ? 100 : -100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: currentPage > previousPage ? -100 : 100 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className={`${getProgressBgColor(
          progress
        )} rounded-2xl p-4 sm:p-6 mb-4 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-200 relative overflow-hidden group`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 relative z-10">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 bg-gradient-to-br ${currentColors.iconBg} rounded-full flex items-center justify-center shadow-lg border border-white/30 relative`}
            >
              <OptimizeImage
                src="/assets/image/student_logo.webp"
                width={24}
                height={24}
                alt="student_logo"
                className="relative z-10"
              />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Lớp học
              </p>
              <div className="bg-white px-3 py-2 rounded-xl border border-gray-200   transition-all duration-300">
                <p className="text-sm sm:text-base font-bold text-gray-800">
                  {item.classname}
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 group">
                {/* Custom Progress với theme colors */}
                <div
                  className={`relative h-8 sm:h-10 rounded-full bg-white border-2 border-gray-200 transition-all duration-500 overflow-hidden cursor-pointer hover:scale-[1.02] hover:border-gray-300`}
                  onClick={() => {
                    if (hasChartData) {
                      setSelectedAge(item.classname);
                      setShowChart(true);
                    } else {
                      toast.info(
                        "Lớp học này chưa có dữ liệu tiến độ để hiển thị biểu đồ.",
                        {
                          position: "top-right",
                          autoClose: 3000,
                          hideProgressBar: false,
                          closeOnClick: true,
                          pauseOnHover: true,
                          draggable: true
                        }
                      );
                    }
                  }}
                >
                  {/* Progress fill với theme colors */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${getProgressColor(
                      progress
                    )} transition-all duration-1000 ease-out rounded-full`}
                    style={{ width: `${progress}%` }}
                  ></div>

                  {/* Progress text */}
                  <div className="absolute inset-0 flex items-center justify-center z-30">
                    <span
                      className={`font-bold text-sm sm:text-base transition-all duration-300 bg-gradient-to-r ${currentColors.iconBg} bg-clip-text text-transparent font-extrabold`}
                    >
                      {progress}%
                    </span>
                  </div>
                </div>

                {/* Floating indicator với theme colors */}
                <div
                  className={`absolute -top-3 -right-3 w-7 h-7 bg-gradient-to-br ${currentColors.iconBg} rounded-full flex items-center justify-center border-2 border-white z-40`}
                >
                  <span className="text-xs font-bold text-white">
                    {hasChartData ? "📊" : "⚠️"}
                  </span>
                </div>
              </div>

              <motion.div
                whileHover={{ scale: 1.1, rotate: 10 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="flex-shrink-0"
              >
                <div className="relative">
                  <div className="relative bg-gray-100 rounded-full p-2 border border-gray-200">
                    <Image
                      src="/reset_icon.png"
                      alt="reset"
                      width={40}
                      height={40}
                      priority
                      className="sm:w-12 sm:h-12 cursor-pointer relative z-10 hover:brightness-110 transition-all duration-300 filter drop-shadow-lg"
                      onClick={() => {
                        const classLessons = courseData.filter(
                          (lesson) => lesson.classId === item.class_id
                        );
                        const lessonIds = classLessons.map(
                          (lesson) => lesson.lessonId
                        );
                        onOpen("resetUnit", { lessonIds, onDataRefetch });
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const handlePrevPage = () => {
    setPreviousPage(currentPage);
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setPreviousPage(currentPage);
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full  pr-0 xl:pr-6 mb-6 xl:mb-0 relative"
    >
      {/* Header với theme-based gradient background */}
      <div
        className={`bg-gradient-to-r ${currentColors.headerGradient} rounded-2xl p-6 mb-6 shadow-xl`}
      >
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 justify-center text-white">
          <div className="relative">
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-full flex items-center justify-center border border-gray-200">
              <Image
                src="/percent.png"
                alt="percent"
                width={32}
                height={32}
                priority
                className="sm:w-8 sm:h-8 brightness-0 invert"
              />
            </div>
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl  font-bold">
              {t("statisticsOfTeachingProgress")}
            </h2>
            <p className="text-sm sm:text-base text-white/80 mt-1">
              Theo dõi tiến độ học tập của từng lớp
            </p>
          </div>
        </div>
      </div>

      {/* Navigation buttons với theme colors */}
      <div className="flex flex-col sm:flex-row justify-center sm:justify-end gap-3 mb-6">
        <motion.button
          onClick={handlePrevPage}
          disabled={currentPage === 0}
          className={`px-4 sm:px-6 py-3 rounded-xl transition-all duration-300 text-sm sm:text-base font-medium shadow-lg ${
            currentPage === 0
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : `bg-gradient-to-r ${currentColors.buttonPrev} text-white hover:shadow-xl transform hover:scale-105`
          }`}
          whileHover={currentPage !== 0 ? { scale: 1.05 } : undefined}
          whileTap={currentPage !== 0 ? { scale: 0.95 } : undefined}
        >
          <span className="flex items-center gap-2">
            <span className="hidden sm:inline">←</span>
            <span className="sm:hidden">◀</span>
            <span>Trang trước</span>
          </span>
        </motion.button>

        <motion.button
          onClick={handleNextPage}
          disabled={currentPage >= totalPages - 1}
          className={`px-4 sm:px-6 py-3 rounded-xl transition-all duration-300 text-sm sm:text-base font-medium shadow-lg ${
            currentPage >= totalPages - 1
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : `bg-gradient-to-r ${currentColors.buttonNext} text-white hover:shadow-xl transform hover:scale-105`
          }`}
          whileHover={
            currentPage < totalPages - 1 ? { scale: 1.05 } : undefined
          }
          whileTap={currentPage < totalPages - 1 ? { scale: 0.95 } : undefined}
        >
          <span className="flex items-center gap-2">
            <span>Trang sau</span>
            <span className="hidden sm:inline">→</span>
            <span className="sm:hidden">▶</span>
          </span>
        </motion.button>
      </div>

      {/* Content area với improved styling */}
      <div className="">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            className="absolute w-full"
            key={currentPage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {currentPageData.map((item, index) => (
              <div key={`${item.classname}-${item.class_id}-${index}`}>
                {renderProgressItem(item)}
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Modal với theme-based styling */}
      <Dialog
        open={showChart}
        onOpenChange={(open) => {
          setShowChart(open);
          if (!open) setSelectedAge(null);
        }}
      >
        <DialogContent className="w-[95vw] max-w-[900px] h-[90vh] max-h-[700px] p-0 border-0 bg-white">
          <div
            className={`bg-gradient-to-r ${currentColors.modalHeader} p-6 rounded-t-lg`}
          >
            <DialogHeader>
              <DialogTitle className="text-xl sm:text-2xl font-bold text-white flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  📊
                </div>
                Biểu đồ tiến độ giảng dạy
              </DialogTitle>
            </DialogHeader>
          </div>
          <div className="p-2 overflow-auto">
            {chartData.length > 0 ? (
              <ProgressChart data={chartData} />
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl text-gray-400">📊</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  Không có dữ liệu
                </h3>
                <p className="text-gray-500">
                  Lớp học này chưa có dữ liệu tiến độ để hiển thị biểu đồ.
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
});
