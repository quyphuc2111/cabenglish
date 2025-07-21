"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { ActionCell } from "./action-cell";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatProgress } from "@/lib/utils";

export type Units = {
  unitId: number;
  unitName: string;
  order: number;
  progress?: number;
};

// Tách ActionCell ra component riêng
export function useUnitsColumns() {
  const columns = useMemo<ColumnDef<Units>[]>(
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
        header: "#",
        accessorKey: "index",
        cell: ({ row, table }) => {
          const pageSize = table.getState().pagination.pageSize;
          const pageIndex = table.getState().pagination.pageIndex;
          const index = pageIndex * pageSize + row.index + 1;

          return (
            <div className="font-medium text-gray-500">
              {String(index).padStart(2, '0')}
            </div>
          );
        }
      },
      {
        accessorKey: "unitName",
        header: () => (
          <div className="font-semibold text-gray-900">Tên Unit</div>
        ),
        cell: ({ row }) => {
          const value = row.original.unitName;
          return (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <div className="font-medium text-gray-900 line-clamp-1 max-w-[300px]">
                {value}
              </div>
            </div>
          );
        }
      },
      {
        accessorKey: "order",
        header: () => (
          <div className="font-semibold text-gray-900">Thứ tự</div>
        ),
        cell: ({ row }) => {
          const order = row.original.order;
          return (
            <div className="flex items-center justify-start">
              <Badge 
                variant="secondary"
                className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium px-3 py-1"
              >
                #{order}
              </Badge>
            </div>
          );
        }
      },
      // {
      //   accessorKey: "progress",
      //   header: () => (
      //     <div className="font-semibold text-gray-900">Tiến độ</div>
      //   ),
      //   cell: ({ row }) => {
      //     const progress = formatProgress(row.original.progress) || 0;
      //     return (
      //       <div className="flex items-center gap-3 w-[200px]">
      //         <Progress 
      //           value={Number(progress)} 
      //           className={`h-2 ${
      //             Number(progress) < 30 
      //               ? "bg-red-500" 
      //               : Number(progress) < 70 
      //               ? "bg-yellow-500" 
      //               : "bg-green-500"
      //           }`}
      //         />
      //         <span className={`text-sm font-medium ${
      //           Number(progress) < 30 
      //             ? "text-red-500" 
      //             : Number(progress) < 70 
      //             ? "text-yellow-500" 
      //             : "text-green-500"
      //         }`}>
      //           {progress}%
      //         </span>
      //       </div>
      //     );
      //   }
      // },
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
