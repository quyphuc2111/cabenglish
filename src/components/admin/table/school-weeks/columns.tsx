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
            className="rounded-sm border-indigo-300 data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            className="rounded-sm border-indigo-300 data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500"
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
            <div className="w-12 h-12 flex items-center justify-center">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center font-medium text-indigo-600">
                {String(index).padStart(2, '0')}
              </div>
            </div>
          );
        }
      },
      {
        accessorKey: "value",
        header: ({ column }) => {
          return (
            <div className="text-center font-semibold text-gray-900 px-4">
              Tuần học
            </div>
          );
        },
        cell: ({ row }) => {
          const value = row.original.value;
          const weekColors = [
            'from-blue-50 to-indigo-50 text-blue-700 ring-blue-200 hover:ring-blue-300',
            'from-purple-50 to-pink-50 text-purple-700 ring-purple-200 hover:ring-purple-300',
            'from-emerald-50 to-teal-50 text-emerald-700 ring-emerald-200 hover:ring-emerald-300',
            'from-amber-50 to-orange-50 text-amber-700 ring-amber-200 hover:ring-amber-300'
          ];
          
          const colorIndex = (value - 1) % weekColors.length;
          
          return (
            <div className="flex items-center justify-center py-2">
              <div className={`
                px-6 py-2.5 
                bg-gradient-to-r ${weekColors[colorIndex]}
                rounded-full 
                ring-1 ring-inset
                transition-all duration-300
                transform hover:scale-105
                cursor-default
                shadow-sm
              `}>
                <div className="flex items-center space-x-2">
                  <svg 
                    className="w-4 h-4" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
                    />
                  </svg>
                  <span className="font-medium">
                    Tuần {value}
                  </span>
                </div>
              </div>
            </div>
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
