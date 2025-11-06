"use client";

import { useCallback, memo } from "react";
import { LessonAdminType } from "@/types/lesson";
import { useModal } from "@/hooks/useModalStore";
import OptimizeImage from "@/components/common/optimize-image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { toast } from "react-toastify";
import { useLessonStore } from "@/store/use-lesson-store";

interface ActionCellProps {
  row: {
    original: LessonAdminType;
  };
  table: {
    options: {
      meta?: {
        selectedClassId?: string;
      };
    };
  };
}

export const ActionCell = memo(function ActionCell({ row, table }: ActionCellProps) {
  const { onOpen } = useModal();
  const lesson = row.original;
  const selectedClassId = table.options.meta?.selectedClassId;
  const {activeLesson} = useLessonStore();

  const handleEdit = useCallback(() => {
    if (!activeLesson.classId) {
      toast.error("Không tìm thấy thông tin lớp học!");
      return;
    }

    onOpen("createUpdateLessons", {
      formType: "update",
      classroomId: activeLesson.classId,
      lessonId: lesson.lessonId,
      // schoolweek: lesson.schoolweek
    });
  }, [activeLesson.classId, onOpen, lesson.lessonId]);

  const handleDelete = useCallback(() => {
    onOpen("deleteLesson", {
      lessonIds: [lesson.lessonId],
      lessons: [lesson]
    });
  }, [lesson, onOpen]);

  return (
    <div className="flex gap-2 ">
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
