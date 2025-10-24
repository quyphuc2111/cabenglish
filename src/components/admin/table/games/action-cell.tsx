"use client";

import { useCallback, memo } from "react";
import { type GameRow } from "./columns";
import { useModal } from "@/hooks/useModalStore";
import { Edit, Trash2, Eye } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

interface ActionCellProps {
  row: {
    original: GameRow;
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
  const game = row.original;
  const onSuccess = table.options.meta?.onSuccess;

  const handleView = useCallback(() => {
    onOpen("viewGame", {
      game: game
    });
  }, [game, onOpen]);

  const handleEdit = useCallback(() => {
    onOpen("createUpdateGame", {
      game: game,
      onSuccess
    });
  }, [game, onOpen, onSuccess]);

  const handleDelete = useCallback(() => {
    onOpen("deleteGame", {
      game: game,
      onSuccess
    });
  }, [game, onOpen, onSuccess]);

  return (
    <div className="flex gap-2" data-action>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleView}
              className="hover:bg-purple-50 h-8 w-8 p-0"
            >
              <Eye className="w-4 h-4 text-purple-600" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Xem chi tiết</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

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

