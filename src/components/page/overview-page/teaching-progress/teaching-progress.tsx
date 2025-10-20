"use client";

import Image from "next/image";
import { memo } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { useModal } from "@/hooks/useModalStore";
import { ProgressStats } from "./progress-stats";
import { ClassroomType } from "@/types/classroom";

interface TeachingProgressProps {
  courseData: any[];
  classroomData: ClassroomType[];
  currentTheme?: string;
  onDataRefetch?: () => Promise<void>;
}

export const TeachingProgress = memo(function TeachingProgress({
  courseData,
  classroomData,
  currentTheme = "theme-red",
  onDataRefetch
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
    <div className="mt-4 w-full">
      {/* Header Section với gradient background */}
      <div className="relative">
        <div className="relative bg-white  px-4 pt-3 pb-2 w-max rounded-t-2xl">
          <div className="flex items-center gap-3 ">
            <div className="relative">
              <div className={`absolute inset-0  rounded-full `}></div>
              <div
                className={`relative  rounded-full flex items-center justify-center `}
              >
                <Image
                  src="/rank_flag.gif"
                  alt="teaching progress"
                  width={35}
                  height={358}
                  className=""
                />
              </div>
            </div>
            <div>
              <h3 className={`  text-gray-800 font-bold  bg-clip-text `}>
                {t("teachingProgress")}
              </h3>
              <p className="text-sm text-gray-600 ">
                {t("manageAndMonitorTeachingProgress")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content với improved layout */}
      <div className=" w-full">
        {/* Content container */}
        <div className="mb-48 bg-white w-full sm:h-[650px] h-[820px] px-4 sm:px-6 lg:px-8 3xl:px-10 py-6 sm:py-8 lg:py-10 flex flex-col xl:flex-row gap-6 lg:gap-8 xl:gap-10 rounded-r-3xl rounded-bl-3xl  ">
          <ProgressStats
            onOpen={onOpen}
            t={t}
            courseData={courseData}
            classroomData={classroomData}
            currentTheme={currentTheme}
            onDataRefetch={onDataRefetch}
          />
        </div>
      </div>
    </div>
  );
});
