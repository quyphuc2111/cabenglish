"use client";

import { useCallback } from "react";
import { type GameRow } from "./columns";
import { useModal } from "@/hooks/useModalStore";
import { Edit, Trash2, Eye, Loader2 } from "lucide-react";
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
        loadingRows?: Set<number>;
        setLoadingRows?: (rows: Set<number> | ((prev: Set<number>) => Set<number>)) => void;
        topicsData?: any[];
        agesData?: any[];
      };
    };
  };
}

export function ActionCell({ row, table }: ActionCellProps) {
  const { onOpen } = useModal();
  const game = row.original;
  const meta = table.options.meta;
  const onSuccess = meta?.onSuccess;
  const loadingRows = meta?.loadingRows || new Set();
  const isLoading = loadingRows.has(game.game_id);

  console.log("ActionCell render:", {
    game_id: game.game_id,
    loadingRows: Array.from(loadingRows),
    isLoading,
    hasSetLoadingRows: !!meta?.setLoadingRows
  });

  const handleView = useCallback(() => {
    onOpen("viewGame", {
      game: game
    });
  }, [game, onOpen]);

  const handleEdit = useCallback(() => {
    onOpen("createUpdateGame", {
      game: game,
      onSuccess,
      topicsData: meta?.topicsData,
      agesData: meta?.agesData
    });
  }, [game, onOpen, onSuccess, meta]);

  const handleDelete = useCallback(() => {
    onOpen("deleteGame", {
      game: game,
      onSuccess,
      setLoadingRows: meta?.setLoadingRows
    });
  }, [game, onOpen, onSuccess, meta]);

  // Show loading spinner if row is loading
  if (isLoading) {
    return (
      <div className="flex gap-2 items-center" data-action>
        <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
        <span className="text-sm text-gray-600">Đang xử lý...</span>
      </div>
    );
  }

  return (
    <div className="flex gap-2" data-action>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleView}
              disabled={isLoading}
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
              disabled={isLoading}
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
              disabled={isLoading}
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
}
