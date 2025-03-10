import { Progress } from "@/components/ui/progress";
import { ModalData, ModalType } from "@/hooks/useModalStore";
import Image from "next/image";
import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ProgressChart } from "@/components/charts/progress-chart";
import { motion, AnimatePresence } from "framer-motion";

interface ProgressStatsProps {
  onOpen: (type: ModalType, data?: ModalData) => void;
  t: (key: string) => string;
  courseData: any[];
}

const progressStatsData = {
  initial: [
    {
      age: "3 - 4 tuổi",
      value: 20,
      lesson: [
        {
          title: "Unit 1",
          progress: 100
        },
        {
          title: "Unit 2",
          progress: 40
        },
        {
          title: "Unit 3",
          progress: 24
        },
        {
          title: "Unit 4",
          progress: 100
        },
        {
          title: "Unit 5",
          progress: 60
        },
        {
          title: "Unit 6",
          progress: 30
        },
        {
          title: "Unit 7",
          progress: 100
        },
        {
          title: "Unit 8",
          progress: 66
        },
        {
          title: "Unit 1",
          progress: 100
        },
        {
          title: "Unit 2",
          progress: 40
        },
        {
          title: "Unit 3",
          progress: 24
        },
        {
          title: "Unit 4",
          progress: 100
        },
        {
          title: "Unit 5",
          progress: 60
        },
        {
          title: "Unit 6",
          progress: 30
        },
        {
          title: "Unit 7",
          progress: 100
        },
        {
          title: "Unit 8",
          progress: 66
        },
        {
          title: "Unit 1",
          progress: 100
        },
        {
          title: "Unit 2",
          progress: 40
        },
        {
          title: "Unit 3",
          progress: 24
        },
        {
          title: "Unit 4",
          progress: 100
        },
        {
          title: "Unit 5",
          progress: 60
        },
        {
          title: "Unit 6",
          progress: 30
        },
        {
          title: "Unit 7",
          progress: 100
        },
        {
          title: "Unit 8",
          progress: 66
        },
        {
          title: "Unit 1",
          progress: 100
        },
        {
          title: "Unit 2",
          progress: 40
        },
        {
          title: "Unit 3",
          progress: 24
        },
        {
          title: "Unit 4",
          progress: 100
        },
        {
          title: "Unit 5",
          progress: 60
        },
        {
          title: "Unit 6",
          progress: 30
        },
        {
          title: "Unit 7",
          progress: 100
        },
        {
          title: "Unit 8",
          progress: 66
        },
        {
          title: "Unit 1",
          progress: 100
        },
        {
          title: "Unit 2",
          progress: 40
        },
        {
          title: "Unit 3",
          progress: 24
        },
        {
          title: "Unit 4",
          progress: 100
        },
        {
          title: "Unit 5",
          progress: 60
        },
        {
          title: "Unit 6",
          progress: 30
        },
        {
          title: "Unit 7",
          progress: 100
        },
        {
          title: "Unit 8",
          progress: 66
        },
        {
          title: "Unit 1",
          progress: 100
        },
        {
          title: "Unit 2",
          progress: 40
        },
        {
          title: "Unit 3",
          progress: 24
        },
        {
          title: "Unit 4",
          progress: 100
        },
        {
          title: "Unit 5",
          progress: 60
        },
        {
          title: "Unit 6",
          progress: 30
        },
        {
          title: "Unit 7",
          progress: 100
        },
        {
          title: "Unit 8",
          progress: 66
        },
      ]
    },
    {
      age: "4 - 5 tuổi", 
      value: 50,
      lesson: [
        {
          title: "Unit 1",
          progress: 70
        },
      ]
    }
  ],
  expanded: [
    {
      age: "5 - 6 tuổi",
      value: 22,
      lesson: [
        {
          title: "Unit 1",
          progress: 26
        },
        {
          title: "Unit 2",
          progress: 70
        },
      ]
    },
    {
      age: "Nhà trẻ",
      value: 40,
      lesson: [
        {
          title: "Unit 1",
          progress: 10
        },
        {
          title: "Unit 2",
          progress: 42
        },
      ]
    }
  ]
};

export function ProgressStats({ onOpen, t, courseData }: ProgressStatsProps) {
  const [showChart, setShowChart] = useState(false);
  const [currentPage, setCurrentPage] = useState<"initial" | "expanded">("initial");
  const [selectedAge, setSelectedAge] = useState<string | null>(null);

  console.log("courseData", courseData);

  const chartData = useMemo(() => {
    if (!selectedAge) return progressStatsData[currentPage].map(item => ({
      name: item.age,
      progress: item.value
    }));

    const selectedAgeData = progressStatsData[currentPage].find(item => item.age === selectedAge);
    
    if (!selectedAgeData) return [];

    return selectedAgeData.lesson.map(lesson => ({
      name: lesson.title,
      progress: lesson.progress
    }));
  }, [selectedAge, currentPage]);

  const renderProgressItem = (item: {age: string, value: number}) => (
    <motion.div
      key={item.age}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center my-1 hover:shadow-lg transition-shadow duration-300 p-4 rounded-xl">
        <p className="w-1/6 font-medium">{"Lớp học"}:</p>
        <div className="flex flex-col gap-2 w-5/6">
          <motion.p
            className="font-semibold text-gray-700 border-2 border-[#DB8AB6] w-fit px-2 rounded-lg"
          >
            {item.age}
          </motion.p>
          <motion.div 
            className="border border-black px-3 py-1 rounded-lg flex items-center gap-5 justify-center relative hover:border-blue-500 transition-colors duration-300"
            whileHover={{ scale: 1.01, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
          >
            <Progress
              value={item.value}
              className="h-8 rounded-full [&>*]:bg-[#BEDF9F] cursor-pointer transition-all duration-300 hover:[&>*]:bg-[#9ed36e]"
              onClick={() => {
                setSelectedAge(item.age);
                setShowChart(true);
              }}
            />
            <span 
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-medium text-sm"
              // initial={{ scale: 1 }}
              // whileHover={{ scale: 1.1 }}
            >
              {item.value}%
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
                onClick={() => onOpen("resetUnit")}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );

  const handlePrevPage = () => {
    setCurrentPage("initial");
  };

  const handleNextPage = () => {
    setCurrentPage("expanded");
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
          disabled={currentPage === "initial"}
          className={`px-4 py-2 rounded-lg transition-all duration-300 ${
            currentPage === "initial" 
              ? "text-gray-400 cursor-not-allowed" 
              : "text-blue-600 hover:text-blue-800 hover:bg-blue-50"
          }`}
          whileHover={currentPage !== "initial" ? { scale: 1.05 } : undefined}
          whileTap={currentPage !== "initial" ? { scale: 0.95 } : undefined}
        >
          <span>←</span> Trang trước
        </motion.button>

        <motion.button
          onClick={handleNextPage}
          disabled={currentPage === "expanded"}
          className={`px-4 py-2 rounded-lg transition-all duration-300 ${
            currentPage === "expanded"
              ? "text-gray-400 cursor-not-allowed"
              : "text-blue-600 hover:text-blue-800 hover:bg-blue-50"
          }`}
          whileHover={currentPage !== "expanded" ? { scale: 1.05 } : undefined}
          whileTap={currentPage !== "expanded" ? { scale: 0.95 } : undefined}
        >
          Trang sau <span>→</span>
        </motion.button>
      </div>

      <AnimatePresence>
        {progressStatsData[currentPage].map(renderProgressItem)}
      </AnimatePresence>

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
