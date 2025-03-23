"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useMemo, memo } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { ActionCell } from "./action-cell";
import { Badge } from "@/components/ui/badge";
import { LessonAdminType } from "@/types/lesson";
import ImagePreview from "./ImagePreview";

// Tách ImageCell ra thành component riêng và memoize nó
const ImageCell = memo(({ imageUrl }: { imageUrl: string }) => (
  <ImagePreview imageUrl={imageUrl} />
));

ImageCell.displayName = 'ImageCell';

export function useLessonsColumns() {

  const columns = useMemo<ColumnDef<LessonAdminType>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
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
        accessorKey: "lessonName",
        header: () => (
          <div className="font-semibold text-gray-900 px-2 lg:px-4">Tên bài học</div>
        ),
        cell: ({ row }) => {
          const lessonName = row.original.lessonName;
          return (
            <div className="group px-2 lg:px-4 py-2 lg:py-3 hover:bg-gray-50 rounded-md transition-all duration-200">
              <div className="flex items-center space-x-2 lg:space-x-3">
                <div className="w-1.5 lg:w-2 h-1.5 lg:h-2 rounded-full bg-blue-500 group-hover:animate-pulse" />
                <div className="font-medium text-gray-900 line-clamp-1 max-w-[200px] lg:max-w-[300px] group-hover:line-clamp-none">
                  {lessonName}
                </div>
              </div>
            </div>
          );
        }
      },
      {
        accessorKey: "schoolWeekID",
        header: () => (
          <div className="font-semibold text-gray-900 px-2 lg:px-4">Tuần học</div>
        ),
        cell: ({ row }) => {
          const schoolweek = row.original.schoolWeekID;
          return (
            <div className="px-2 lg:px-4">
              <Badge 
                variant="secondary"
                className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium px-2 lg:px-4 py-1 lg:py-1.5 transition-all duration-200 transform hover:scale-105 min-w-[60px] lg:min-w-[80px] text-center text-xs lg:text-sm"
              >
                Tuần {schoolweek}
              </Badge>
            </div>
          );
        }
      },
      {
        accessorKey: "imageUrl",
        header: () => (
          <div className="font-semibold text-gray-900 px-4">Hình ảnh</div>
        ),
        cell: ({ row }) => <ImageCell imageUrl={row.original.imageUrl} />
      },
      {
        accessorKey: "numLiked",
        header: () => (
          <div className="font-semibold text-gray-900 text-center w-full text-sm lg:text-base">Số lượt thích</div>
        ),
        cell: ({ row }) => {
          const numLiked = row.original.numLiked;
          return (
            <div className="w-full flex items-center justify-center">
              <span className="inline-flex items-center justify-center px-2 lg:px-3 py-1 lg:py-1.5 rounded-full bg-pink-50 text-pink-700 text-xs lg:text-sm font-medium min-w-[30px] lg:min-w-[40px]">
                {numLiked}
              </span>
            </div>
          );
        }
      },
      {
        accessorKey: "isActive",
        header: () => (
          <div className="font-semibold text-gray-900 text-center">Trạng thái</div>
        ),
        cell: ({ row }) => {
          const isActive = row.original.isActive;
          return (
            <div className="flex items-center justify-center">
              <div className={`inline-flex items-center justify-center space-x-2 px-4 py-1.5 rounded-full text-sm font-medium
                ${isActive 
                  ? "bg-green-50 text-green-700" 
                  : "bg-red-50 text-red-700"
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-green-500" : "bg-red-500"}`} />
                <span>{isActive ? "Hoạt động" : "Không hoạt động"}</span>
              </div>
            </div>
          );
        }
      },
      {
        accessorKey: "order",
        header: () => (
          <div className="font-semibold text-gray-900 text-center">Thứ tự</div>
        ),
        cell: ({ row }) => {
          const order = row.original.order;
          return (
            <div className="flex items-center justify-center">
              <Badge 
                variant="secondary"
                className="bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium px-3 py-1.5 min-w-[30px] text-center transition-colors"
              >
                #{order}
              </Badge>
            </div>
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
    ],
    []
  );

  return columns;
}
