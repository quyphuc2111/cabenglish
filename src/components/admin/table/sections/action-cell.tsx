"use client";

import { useCallback, memo } from "react";
// import { type SectionType } from "./columns";
import { useModal } from "@/hooks/useModalStore";
import OptimizeImage from "@/components/common/optimize-image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { SectionType } from "@/types/section";
import { useLessonStore } from '@/store/use-lesson-store';

interface ActionCellProps {
  row: {
    original: SectionType;
  };
}

export const ActionCell = memo(function ActionCell({ row }: ActionCellProps) {
  const { onOpen } = useModal();
  const section = row.original;
  const { activeLesson } = useLessonStore();

  const handleEdit = useCallback(() => {
    console.log("🔧 Edit section:", section);
    onOpen("createUpdateSection", {
      formType: "update",
      sections: [section], // Truyền toàn bộ dữ liệu section
      lessonIds: Number(activeLesson.lessonId)
    }); 
  }, [section, activeLesson.lessonId, onOpen]);

  const handleDelete = useCallback(() => {
    onOpen("deleteSection", {
      sectionIds: [section.sectionId.toString()],
    //   schoolWeek: {
    //     swId: schoolWeek.swId,
    //     value: schoolWeek.value
    //   } as any
    });
  }, [section.sectionId, onOpen]);

  return (
    <div className="flex gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="cursor-pointer" onClick={handleEdit}>
              <OptimizeImage
                src="/assets/image/admin/edit_icon.webp"
                width={25}
                height={25}
                alt="edit"
              />
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-[500px] whitespace-pre-wrap">
            Sửa
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="cursor-pointer" onClick={handleDelete}>
              <OptimizeImage
                src="/assets/image/admin/delete_icon.webp"
                width={25}
                height={25}
                alt="delete"
              />
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-[500px] whitespace-pre-wrap">
            Xóa
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
});
