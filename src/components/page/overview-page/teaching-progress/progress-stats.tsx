import { Progress } from "@/components/ui/progress";
import { ModalData, ModalType } from "@/hooks/useModalStore";
import Image from "next/image";
import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ProgressChart } from "@/components/charts/progress-chart";
import { motion, AnimatePresence } from "framer-motion";
import { ClassroomType } from "@/types/classroom";
import { formatProgress } from "@/lib/utils";
import { LessonType } from "@/types/lesson";
import OptimizeImage from "@/components/common/optimize-image";

interface ProgressStatsProps {
  onOpen: (type: ModalType, data?: ModalData) => void;
  t: (key: string) => string;
  courseData: LessonType[];
  classroomData: ClassroomType[];
}

export function ProgressStats({ onOpen, t, courseData, classroomData }: ProgressStatsProps) {
  const [showChart, setShowChart] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedAge, setSelectedAge] = useState<string | null>(null);
  const [previousPage, setPreviousPage] = useState(0);

  const ITEMS_PER_PAGE = 2;
  const totalPages = Math.ceil(classroomData.length / ITEMS_PER_PAGE);

  const currentPageData = useMemo(() => {
    const startIndex = currentPage * ITEMS_PER_PAGE;
    return classroomData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [classroomData, currentPage]);
  const chartData = useMemo(() => {
    if (!selectedAge) return currentPageData.map(item => ({
      name: item.classname,
      progress: formatProgress(item.progress)
    }));

    const selectedAgeData = currentPageData.find(item => item.classname === selectedAge);
    
    if (!selectedAgeData) return [];

    const classLessons = courseData.filter(lesson => 
      lesson.classId === selectedAgeData.class_id
    );

    return classLessons.map(lesson => ({
      name: lesson.unitName,
      progress: formatProgress(lesson.progress || 0)
    }));
  }, [selectedAge, currentPageData, courseData]);

  const renderProgressItem = (item: ClassroomType) => (
    <motion.div
      key={`${item.classname}-${item.class_id}-${currentPage}`}
      initial={{ opacity: 0, x: currentPage > previousPage ? 100 : -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: currentPage > previousPage ? -100 : 100 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="flex items-center my-1 hover:shadow-lg transition-shadow duration-300 p-4 rounded-xl">
        <p className="w-1/6 font-medium">{"Lớp học"}:</p>
        <div className="flex flex-col gap-2 w-5/6">
          <motion.div
            className="font-semibold  border-2 border-[#DB8AB6] w-fit divx-2 rounded-lg flex items-center gap-2 p-1"
          >
            <OptimizeImage src="/assets/image/student_logo.webp" width={25} height={25} alt="student_logo" />
            <p className="text-gray-700">{item.classname}</p>
          </motion.div>
          <motion.div 
            className="border border-black px-3 py-1 rounded-lg flex items-center gap-5 justify-center relative hover:border-blue-500 transition-colors duration-300"
            whileHover={{ scale: 1.01, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
          >
            <Progress
              value={Number(formatProgress(item.progress))}
              className="h-8 rounded-full [&>*]:bg-[#BEDF9F] cursor-pointer transition-all duration-300 hover:[&>*]:bg-[#9ed36e]"
              onClick={() => {
                setSelectedAge(item.classname);
                setShowChart(true);
              }}
            />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-medium text-sm">
              {formatProgress(item.progress)}%
            </span>
            <motion.div
              whileHover={{ scale: 1.05, rotate: 10 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src="/reset_icon.png"
                alt="check_icon"
                width={45}
                height={45}
                priority
                className="ml-2 cursor-pointer"
                onClick={() => {
                  const classLessons = courseData.filter(lesson => 
                    lesson.classId === item.class_id
                  );
                  const lessonIds = classLessons.map(lesson => lesson.lessonId);
                  onOpen("resetUnit", { lessonIds });
                }}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );

  const handlePrevPage = () => {
    setPreviousPage(currentPage);
    setCurrentPage(prev => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setPreviousPage(currentPage);
    setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full lg:w-1/2 px-2 lg:px-5 mb-8 lg:mb-0 relative"
    >
      <div 
        className="flex items-center gap-5 justify-center mb-2"
      >
        <Image
          src="/percent.png"
          alt="percent"
          width={40}
          height={40}
          priority
        />
        <p className="text-xl font-semibold">{t("statisticsOfTeachingProgress")}</p>
      </div>

      {/* <p 
        className="text-lg font-medium text-[#C35690] text-center mb-4"
      >
        Giáo viên A
      </p> */}

      <div className="flex justify-end gap-2">
        <motion.button
          onClick={handlePrevPage}
          disabled={currentPage === 0}
          className={`px-4 py-2 rounded-lg transition-all duration-300 ${
            currentPage === 0
              ? "text-gray-400 cursor-not-allowed" 
              : "text-blue-600 hover:text-blue-800 hover:bg-blue-50"
          }`}
          whileHover={currentPage !== 0 ? { scale: 1.05 } : undefined}
          whileTap={currentPage !== 0 ? { scale: 0.95 } : undefined}
        >
          <span>←</span> Trang trước
        </motion.button>

        <motion.button
          onClick={handleNextPage}
          disabled={currentPage >= totalPages - 1}
          className={`px-4 py-2 rounded-lg transition-all duration-300 ${
            currentPage >= totalPages - 1
              ? "text-gray-400 cursor-not-allowed"
              : "text-blue-600 hover:text-blue-800 hover:bg-blue-50"
          }`}
          whileHover={currentPage < totalPages - 1 ? { scale: 1.05 } : undefined}
          whileTap={currentPage < totalPages - 1 ? { scale: 0.95 } : undefined}
        >
          Trang sau <span>→</span>
        </motion.button>
      </div>

      <div className="relative h-[280px] overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <div className="absolute w-full" key={currentPage}>
            {currentPageData.slice(0, ITEMS_PER_PAGE).map((item, index) => (
              <motion.div
                key={`${item.classname}-${item.class_id}-${index}`}
                initial={{ opacity: 0, x: currentPage > previousPage ? 100 : -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: currentPage > previousPage ? -100 : 100 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {renderProgressItem(item)}
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      </div>

      <Dialog 
        open={showChart} 
        onOpenChange={(open) => {
          setShowChart(open);
          if (!open) setSelectedAge(null);
        }}
      >
        <DialogContent className="max-w-[850px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold mb-4">Biểu đồ tiến độ giảng dạy</DialogTitle>
          </DialogHeader>
          {/* <h2 className="text-xl font-semibold mb-4">Biểu đồ tiến độ giảng dạy</h2> */}
          <ProgressChart data={chartData} />
        </DialogContent>
      </Dialog>

    
    </motion.div>
  );
}
