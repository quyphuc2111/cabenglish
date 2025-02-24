"use client"

import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";
import { useModal } from "@/hooks/useModalStore";
import { ProgressStats } from "./progress-stats";
import CurrentAndNextLecture from "./current-and-next-lecture";

interface TeachingProgressProps {
  courseData: any[];
}

export function TeachingProgress({ courseData }: TeachingProgressProps) {
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
      <div className="bg-white px-4 lg:px-7 py-5 my-2 flex flex-col lg:flex-row">
        <ProgressStats onOpen={onOpen} t={t} />
        <CurrentAndNextLecture courseData={courseData} t={t} />
      </div>
    </div>
  );
}


