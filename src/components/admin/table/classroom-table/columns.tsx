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
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false
    },
    {
      header: "#",
      accessorKey: "index",
      cell: ({ row, table }) => {
        const pageSize = table.getState().pagination.pageSize;
        const pageIndex = table.getState().pagination.pageIndex;

        // Tính index: (số trang hiện tại * số items mỗi trang) + index trong trang hiện tại + 1
        const index = pageIndex * pageSize + row.index + 1;

        return <div>{index}</div>;
      }
    },
    {
      accessorKey: "classname",
      header: "Tên lớp học"
    },
    {
      accessorKey: "imageurl",
      header: "Hình ảnh",
      cell: ({ row }) => {
        const imageUrl = row.original.imageurl;
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="line-clamp-1 max-w-[400px] cursor-pointer">{imageUrl}</p>
              </TooltipTrigger>
              <TooltipContent className="max-w-[800px] whitespace-pre-wrap">
                <div className="cursor-pointer">
                  <OptimizeImage
                    src={imageUrl}
                    width={200}
                    height={200}
                    alt="Hình ảnh lớp học"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,..."
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
      header: "Mô tả",
      cell: ({ row }) => {
        const description = row.original.description;
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="line-clamp-2 max-w-[500px] cursor-pointer">
                  {description}
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-[500px] whitespace-pre-wrap">
                {description}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      }
    },
    {
      id: "actions",
      cell: ActionCell
    }
  ], []); // Empty dependency array vì columns không phụ thuộc vào props/state nào

  return columns;
}
