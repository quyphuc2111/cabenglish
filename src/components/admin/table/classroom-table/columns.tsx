"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { ActionCell } from "./action-cell";
import { ImageUrlCell } from "./image-url-cell";

export type Classroom = {
  id: string;
  classname: string;
  imageurl: string;
  description: string;
  class_id: string;
  order: number;
};

// Tách ActionCell ra component riêng
export function useClassroomColumns() {
  const columns = useMemo<ColumnDef<Classroom>[]>(() => [
    {
      id: "select",
      header: ({ table }) => (
        <div data-checkbox>
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
            className="rounded-sm"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div data-checkbox>
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            className="rounded-sm"
          />
        </div>
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
      accessorKey: "order",
      header: () => (
        <div className="font-semibold text-gray-900 px-4">Thứ tự</div>
      ),
      cell: ({ row }) => {
        const order = row.original.order;
        return (
          <div className="px-4 py-3">
            <div className="font-medium text-gray-900 text-center">{order}</div>
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
        return <ImageUrlCell imageUrl={imageUrl} />;
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
                  <div className="text-sm text-gray-600 cursor-pointer hover:text-gray-900 transition-colors max-w-[300px] truncate ">
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
        <div className="font-semibold text-gray-900 px-4">
          Hành động
        </div>
      ),
      enableSorting: false,
      enableHiding: false
    }
  ], []);

  return columns;
}
