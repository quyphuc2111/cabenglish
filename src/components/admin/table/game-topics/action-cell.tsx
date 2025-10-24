"use client";

import { useCallback, memo } from "react";
import { type GameTopicRow } from "./columns";
import { useModal } from "@/hooks/useModalStore";
import OptimizeImage from "@/components/common/optimize-image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";

interface ActionCellProps {
  row: {
    original: GameTopicRow;
  };
  table: {
    options: {
      meta?: {
        onSuccess?: () => void;
      };
    };
  };
}

export const ActionCell = memo(function ActionCell({ row, table }: ActionCellProps) {
  const { onOpen } = useModal();
  const topic = row.original;
  const onSuccess = table.options.meta?.onSuccess;

  const handleEdit = useCallback(() => {
    onOpen("createUpdateGameTopic", {
      gameTopic: topic,
      onSuccess
    });
  }, [topic, onOpen, onSuccess]);

  const handleDelete = useCallback(() => {
    onOpen("deleteGameTopic", {
      gameTopic: topic,
      onSuccess
    });
  }, [topic, onOpen, onSuccess]);

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

