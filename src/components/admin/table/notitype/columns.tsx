"use client";

import { ColumnDef } from "@tanstack/react-table";
import {  useMemo } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { ActionCell } from "./action-cell";

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
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
            className="rounded-sm border-rose-300 data-[state=checked]:bg-rose-500 data-[state=checked]:border-rose-500"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            className="rounded-sm border-rose-300 data-[state=checked]:bg-rose-500 data-[state=checked]:border-rose-500"
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
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center font-medium text-rose-600 shadow-sm">
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
            <div className="text-center font-semibold text-gray-900 px-4 flex items-center justify-center space-x-2">
              <svg 
                className="w-5 h-5 text-rose-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
                />
              </svg>
              <span>Loại thông báo</span>
            </div>
          );
        },
        cell: ({ row }) => {
          const value = row.original.value;
          const getNotificationStyle = (value: string) => {
            const styles = {
              'System': 'from-blue-50 to-indigo-50 text-blue-700 ring-blue-200 hover:ring-blue-300',
              'User': 'from-emerald-50 to-teal-50 text-emerald-700 ring-emerald-200 hover:ring-emerald-300',
              'Error': 'from-rose-50 to-red-50 text-rose-700 ring-rose-200 hover:ring-rose-300',
              'Warning': 'from-amber-50 to-yellow-50 text-amber-700 ring-amber-200 hover:ring-amber-300',
              'Info': 'from-violet-50 to-purple-50 text-violet-700 ring-violet-200 hover:ring-violet-300'
            };
            return styles[value as keyof typeof styles] || 'from-gray-50 to-slate-50 text-gray-700 ring-gray-200 hover:ring-gray-300';
          };

          const getNotificationIcon = (value: string) => {
            const icons = {
              'System': (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              ),
              'User': (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              ),
              // Thêm các icon khác tương ứng với các loại thông báo
            };
            return icons[value as keyof typeof icons] || (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            );
          };

          return (
            <div className="flex items-center justify-center py-2">
              <div className={`
                px-6 py-2.5 
                bg-gradient-to-r ${getNotificationStyle(value)}
                rounded-full 
                ring-1 ring-inset
                transition-all duration-300
                transform hover:scale-105
                cursor-default
                shadow-sm
                flex items-center space-x-2
              `}>
                {getNotificationIcon(value)}
                <span className="font-medium">
                  {value}
                </span>
              </div>
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
