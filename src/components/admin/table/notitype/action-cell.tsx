"use client";

import { useCallback, memo } from "react";
import { type NotiType } from "./columns";
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
    original:  NotiType;
  };
}

export const ActionCell = memo(function ActionCell({ row }: ActionCellProps) {
  const { onOpen } = useModal();
  const  notiType = row.original;

  const handleEdit = useCallback(() => {
    onOpen("createUpdateNotiType", {
      formType: "update",
      notiType: { id: notiType.ntId } as any
    });
  }, [notiType.ntId, onOpen]);

  const handleDelete = useCallback(() => {
    onOpen("deleteNotiType", {
      notiType: {
        ntId: notiType.ntId,
        value: notiType.value
      } as any
    });
  }, [notiType.ntId, notiType.value, onOpen]);

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
