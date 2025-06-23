"use client"

import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";
import { useModal } from "@/hooks/useModalStore";
import { ProgressStats } from "./progress-stats";
import CurrentAndNextLecture from "./current-and-next-lecture";
import { ClassroomType } from "@/types/classroom";

interface TeachingProgressProps {
  courseData: any[];
  classroomData: ClassroomType[];
}

export function TeachingProgress({ courseData, classroomData }: TeachingProgressProps) {
  const { t } = useTranslation('', 'common');
  const { onOpen } = useModal();

  return (
    <div className="mt-5">
      <div className="flex items-center gap-2">
        <Image src="/rank_flag.gif" alt="book" width={40} height={40} />
        <p className="text-xl text-[#555555] font-medium">
          {t('teachingProgress')}
        </p>
      </div>
      <div className="bg-white px-4 3xl:px-7 py-5 my-2 flex flex-col lg:flex-row relative rounded-xl">
        <ProgressStats onOpen={onOpen} t={t} courseData={courseData} classroomData={classroomData} />
        <CurrentAndNextLecture courseData={courseData} t={t}  classroomData={classroomData}/>
      </div>
    </div>
  );
}


