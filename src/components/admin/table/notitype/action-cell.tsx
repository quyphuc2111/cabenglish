"use client";

import { useCallback, memo } from "react";
import { type NotiType } from "./columns";
import { useModal } from "@/hooks/useModalStore";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
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
    <div className="flex items-center justify-center space-x-3">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={handleEdit}
              className="
                h-10 w-10 p-0 
                bg-gradient-to-br from-blue-50 to-indigo-50
                border border-blue-200/60
                hover:bg-gradient-to-br hover:from-blue-100 hover:to-indigo-100
                hover:border-blue-300
                hover:shadow-lg hover:shadow-blue-200/40
                hover:scale-110 hover:-translate-y-1
                transition-all duration-300
                rounded-xl
                group
                relative overflow-hidden
              "
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-200/20 to-indigo-200/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Pencil className="h-4 w-4 text-blue-600 group-hover:text-blue-700 transition-colors duration-300 relative z-10" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="max-w-[500px] whitespace-pre-wrap bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 text-blue-800 shadow-lg">
            <div className="flex items-center space-x-2">
              <Pencil className="w-3 h-3" />
              <span className="font-medium">Sửa loại thông báo</span>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              className="
                h-10 w-10 p-0 
                bg-gradient-to-br from-red-50 to-rose-50
                border border-red-200/60
                hover:bg-gradient-to-br hover:from-red-100 hover:to-rose-100
                hover:border-red-300
                hover:shadow-lg hover:shadow-red-200/40
                hover:scale-110 hover:-translate-y-1
                transition-all duration-300
                rounded-xl
                group
                relative overflow-hidden
              "
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-200/20 to-rose-200/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Trash2 className="h-4 w-4 text-red-600 group-hover:text-red-700 transition-colors duration-300 relative z-10" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="max-w-[500px] whitespace-pre-wrap bg-gradient-to-r from-red-50 to-rose-50 border-red-200 text-red-800 shadow-lg">
            <div className="flex items-center space-x-2">
              <Trash2 className="w-3 h-3" />
              <span className="font-medium">Xóa loại thông báo</span>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
});
