"use client";

import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";
import { useModal } from "@/hooks/useModalStore";
import { ProgressStats } from "./progress-stats";
import CurrentAndNextLecture from "./current-and-next-lecture";
import { ClassroomType } from "@/types/classroom";

interface TeachingProgressProps {
  courseData: any[];
  classroomData: ClassroomType[];
  currentTheme?: string;
}

export function TeachingProgress({
  courseData,
  classroomData,
  currentTheme = "theme-red"
}: TeachingProgressProps) {
  const { t } = useTranslation("", "common");
  const { onOpen } = useModal();

  // Theme-based gradient colors
  const themeGradients: Record<
    string,
    {
      header: string;
      icon: string;
      title: string;
      content: string;
    }
  > = {
    "theme-gold": {
      header: "from-amber-400/20 via-yellow-400/20 to-orange-400/20",
      icon: "from-amber-400 to-orange-500",
      title: "from-amber-600 to-orange-600",
      content: "from-amber-50 via-yellow-50 to-orange-50"
    },
    "theme-blue": {
      header: "from-blue-400/20 via-cyan-400/20 to-indigo-400/20",
      icon: "from-blue-400 to-cyan-500",
      title: "from-blue-600 to-indigo-600",
      content: "from-blue-50 via-cyan-50 to-indigo-50"
    },
    "theme-pink": {
      header: "from-pink-400/20 via-rose-400/20 to-purple-400/20",
      icon: "from-pink-400 to-rose-500",
      title: "from-pink-600 to-purple-600",
      content: "from-pink-50 via-rose-50 to-purple-50"
    },
    "theme-red": {
      header: "from-red-400/20 via-pink-400/20 to-rose-400/20",
      icon: "from-red-400 to-pink-500",
      title: "from-red-600 to-pink-600",
      content: "from-red-50 via-pink-50 to-rose-50"
    }
  };

  const currentGradients =
    themeGradients[currentTheme] || themeGradients["theme-red"];

  return (
    <div className="mt-6 sm:mt-8 lg:mt-10">
      {/* Header Section với gradient background */}
      <div className="relative">
        <div className="relative bg-white/80 backdrop-blur-sm p-4 sm:p-6  border border-white/60 w-fit rounded-t-2xl">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative">
              <div
                className={`absolute inset-0 bg-gradient-to-r ${currentGradients.icon} rounded-full blur opacity-60`}
              ></div>
              <div
                className={`relative w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r ${currentGradients.icon} rounded-full flex items-center justify-center shadow-lg`}
              >
                <Image
                  src="/rank_flag.gif"
                  alt="teaching progress"
                  width={28}
                  height={28}
                  className="sm:w-8 sm:h-8"
                />
              </div>
            </div>
            <div>
              <h1
                className={`text-xl sm:text-2xl  text-gray-800 font-bold bg-gradient-to-r ${currentGradients.title} bg-clip-text text-transparent`}
              >
                {t("teachingProgress")}
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                Quản lý và theo dõi tiến độ giảng dạy
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content với improved layout */}
      <div className="relative">
        {/* Background decoration */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${currentGradients.content} rounded-3xl`}
        ></div>
        <div className="absolute inset-0 bg-[url('/assets/bg-pattern.svg')] opacity-5 rounded-3xl"></div>

        {/* Content container */}
        <div className="relative bg-white/70 backdrop-blur-sm px-4 sm:px-6 lg:px-8 3xl:px-10 py-6 sm:py-8 lg:py-10 flex flex-col xl:flex-row gap-6 lg:gap-8 xl:gap-10 rounded-r-3xl rounded-bl-3xl border border-white/60 ">
          <ProgressStats
            onOpen={onOpen}
            t={t}
            courseData={courseData}
            classroomData={classroomData}
            currentTheme={currentTheme}
          />
          <CurrentAndNextLecture
            courseData={courseData}
            t={t}
            classroomData={classroomData}
          />
        </div>
      </div>
    </div>
  );
}
