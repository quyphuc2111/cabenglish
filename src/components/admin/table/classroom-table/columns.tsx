"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useCallback, useMemo } from "react";
import OptimizeImage from "@/components/common/optimize-image";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { useModal } from "@/hooks/useModalStore";
import { ActionCell } from "./action-cell";

export type Classroom = {
  id: string;
  classname: string;
  imageurl: string;
  description: string;
  class_id: string;
};

// Tách ActionCell ra component riêng
export function useClassroomColumns() {
  const columns = useMemo<ColumnDef<Classroom>[]>(() => [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="rounded-sm"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="rounded-sm"
        />
      ),
      enableSorting: false,
      enableHiding: false
    },
    {
      header: () => (
        <div className="font-semibold text-gray-900 px-4">#</div>
      ),
      accessorKey: "index",
      cell: ({ row, table }) => {
        const pageSize = table.getState().pagination.pageSize;
        const pageIndex = table.getState().pagination.pageIndex;
        const index = pageIndex * pageSize + row.index + 1;

        return (
          <div className="font-medium text-gray-500 w-12 text-center">
            {String(index).padStart(2, '0')}
          </div>
        );
      }
    },
    {
      accessorKey: "classname",
      header: () => (
        <div className="font-semibold text-gray-900 px-4">Tên lớp học</div>
      ),
      cell: ({ row }) => {
        const classname = row.original.classname;
        return (
          <div className="group px-4 py-3 hover:bg-gray-50 rounded-md transition-all duration-200">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 rounded-full bg-indigo-500 group-hover:animate-pulse" />
              <div className="font-medium text-gray-900">
                {classname}
              </div>
            </div>
          </div>
        );
      }
    },
    {
      accessorKey: "imageurl",
      header: () => (
        <div className="font-semibold text-gray-900 px-4">Hình ảnh</div>
      ),
      cell: ({ row }) => {
        const imageUrl = row.original.imageurl;
        return (
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <div className="flex items-center space-x-2 px-4">
                  <a 
                    href={imageUrl}
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline truncate max-w-[450px] w-full"
                  >
                    {imageUrl}
                  </a>
                </div>
              </TooltipTrigger>
              <TooltipContent 
                side="top" 
                align="start"
                className="p-0 border-0 -translate-y-2"
              >
                <div className="overflow-hidden rounded-lg border border-gray-200">
                  <OptimizeImage
                    src={imageUrl}
                    width={300}
                    height={200}
                    alt="Preview"
                    className="w-full h-auto"
                    unoptimized={true}
                  />
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      }
    },
    {
      accessorKey: "description",
      header: () => (
        <div className="font-semibold text-gray-900 px-4">Mô tả</div>
      ),
      cell: ({ row }) => {
        const description = row.original.description;
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="px-4 py-2">
                  <div className="line-clamp-2 text-sm text-gray-600 max-w-[300px] cursor-pointer hover:text-gray-900 transition-colors">
                    {description}
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-[400px] p-4 bg-white shadow-lg rounded-lg border border-gray-200">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {description}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      }
    },
    {
      id: "actions",
      cell: ActionCell,
      header: () => (
        <div className="font-semibold text-gray-900">
          Hành động
        </div>
      ),
      meta: {
        position: "sticky",
        style: {
          right: 0,
          backgroundColor: "white",
          zIndex: 10,
          boxShadow: "-4px 0 6px rgba(0,0,0,0.05)"
        }
      }
    }
  ], []);

  return columns;
}
