"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { ActionCell } from "./action-cell";
import { Bell, Hash, Settings } from "lucide-react";

export type NotiType = {
  ntId: number;
  value: string;
};

// Tách ActionCell ra component riêng
export function useNotiTypeColumns() {
  const columns = useMemo<ColumnDef<NotiType>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <div className="flex items-center justify-center p-2">
            <Checkbox
              checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && "indeterminate")
              }
              onCheckedChange={(value) =>
                table.toggleAllPageRowsSelected(!!value)
              }
              aria-label="Select all"
              className="
                w-5 h-5 rounded-lg border-2 border-gradient-to-r from-rose-300 to-pink-300
                data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-rose-500 data-[state=checked]:to-pink-500
                data-[state=checked]:border-rose-500 data-[state=checked]:text-white
                hover:border-rose-400 hover:shadow-lg hover:shadow-rose-200/50
                transition-all duration-300 transform hover:scale-110
                focus:ring-2 focus:ring-rose-300 focus:ring-offset-2
              "
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center justify-center p-2">
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select row"
              className="
                w-5 h-5 rounded-lg border-2 border-gradient-to-r from-rose-300 to-pink-300
                data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-rose-500 data-[state=checked]:to-pink-500
                data-[state=checked]:border-rose-500 data-[state=checked]:text-white
                hover:border-rose-400 hover:shadow-lg hover:shadow-rose-200/50
                transition-all duration-300 transform hover:scale-110
                focus:ring-2 focus:ring-rose-300 focus:ring-offset-2
              "
            />
          </div>
        ),
        enableSorting: false,
        enableHiding: false
      },
      {
        header: () => (
          <div className="flex items-center justify-start space-x-2 font-semibold text-gray-800">
            <Hash className="w-4 h-4 text-rose-500" />
            <span className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
              STT
            </span>
          </div>
        ),
        accessorKey: "index",
        cell: ({ row, table }) => {
          const pageSize = table.getState().pagination.pageSize;
          const pageIndex = table.getState().pagination.pageIndex;
          const index = pageIndex * pageSize + row.index + 1;

          return (
            <div className="w-12 h-12 flex items-center justify-center">
              <div className="
                w-10 h-10 rounded-xl 
                bg-gradient-to-br from-rose-100 via-pink-50 to-rose-50
                border border-rose-200/50
                flex items-center justify-center 
                font-bold text-rose-700 
                shadow-lg shadow-rose-100/50
                hover:shadow-xl hover:shadow-rose-200/60
                hover:scale-105 hover:rotate-3
                transition-all duration-300
                relative overflow-hidden
                group
              ">
                <div className="absolute inset-0 bg-gradient-to-br from-rose-200/20 to-pink-200/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 text-sm">
                  {String(index).padStart(2, '0')}
                </span>
              </div>
            </div>
          );
        }
      },
      {
        accessorKey: "value",
        header: ({ column }) => {
          return (
            <div className="text-center font-semibold text-gray-800 px-4 flex items-center justify-center space-x-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-rose-100 to-pink-100 shadow-sm">
                <Bell className="w-5 h-5 text-rose-600" />
              </div>
              <span className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent font-bold">
                Loại thông báo
              </span>
            </div>
          );
        },
        cell: ({ row }) => {
          const value = row.original.value;

          return (
            <div className="flex items-center justify-center py-3">
              <div className="
                px-6 py-3
                bg-gradient-to-r from-rose-50 via-pink-50 to-rose-50
                border border-rose-200/60
                rounded-2xl 
                ring-1 ring-rose-100/50
                transition-all duration-300
                transform hover:scale-105 hover:-translate-y-1
                hover:shadow-xl hover:shadow-rose-200/40
                hover:bg-gradient-to-r hover:from-rose-100 hover:via-pink-100 hover:to-rose-100
                cursor-default
                flex items-center space-x-3
                group
                relative overflow-hidden
              ">
                <div className="absolute inset-0 bg-gradient-to-r from-rose-200/10 to-pink-200/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Bell className="w-4 h-4 text-rose-500 group-hover:text-rose-600 transition-colors duration-300 relative z-10" />
                <span className="font-semibold text-gray-700 group-hover:text-gray-800 transition-colors duration-300 relative z-10">
                  {value}
                </span>
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-br from-rose-400 to-pink-400 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          );
        }
      },
      {
        id: "actions",
        cell: ActionCell,
        header: () => (
          <div className="text-center font-semibold text-gray-800 px-4 flex items-center justify-center space-x-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-slate-100 to-gray-100 shadow-sm">
              <Settings className="w-5 h-5 text-slate-600" />
            </div>
            <span className="bg-gradient-to-r from-slate-600 to-gray-600 bg-clip-text text-transparent font-bold">
              Hành động
            </span>
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
