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

export type SchoolWeek = {
  swId: number;
  value: number;
};

// Tách ActionCell ra component riêng
export function useSchoolWeekColumns() {
  const columns = useMemo<ColumnDef<SchoolWeek>[]>(
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
        accessorKey: "value",
        header: ({ column }) => {
          return (
            <div className="text-center font-semibold text-gray-900">
              Tuần học
            </div>
          );
        },
        cell: ({ row }) => {
          const value = row.original.value;
          return (
            <div className="flex items-center justify-center">
              <div className="px-4 py-2 bg-blue-50 rounded-full">
                <span className="text-blue-700 font-medium">
                  Tuần {value}
                </span>
              </div>
            </div>
          );
        }
      },
      {
        id: "actions",
        cell: ActionCell,
        header: "Hành động",
        meta: {
          position: "sticky",
          style: {
            right: 0,
            backgroundColor: "white",
            zIndex: 10,
            boxShadow: "-2px 0 4px rgba(0,0,0,0.1)"
          }
        }
      }
    ],
    []
  );

  return columns;
}
