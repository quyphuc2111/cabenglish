"use client";

import { useCallback, memo } from "react";
import { type GameAgeRow } from "./columns";
import { useModal } from "@/hooks/useModalStore";
import { Edit, Trash2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

interface ActionCellProps {
  row: {
    original: GameAgeRow;
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
  const age = row.original;
  const onSuccess = table.options.meta?.onSuccess;

  const handleEdit = useCallback(() => {
    onOpen("createUpdateGameAge", {
      gameAge: age,
      onSuccess
    });
  }, [age, onOpen, onSuccess]);

  const handleDelete = useCallback(() => {
    onOpen("deleteGameAge", {
      gameAge: age,
      onSuccess
    });
  }, [age, onOpen, onSuccess]);

  return (
    <div className="flex gap-2" data-action>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEdit}
              className="hover:bg-blue-50 h-8 w-8 p-0"
            >
              <Edit className="w-4 h-4 text-blue-600" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Chỉnh sửa</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="hover:bg-red-50 h-8 w-8 p-0"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Xóa</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
});

