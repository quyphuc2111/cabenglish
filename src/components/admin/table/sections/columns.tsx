"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { ActionCell } from "./action-cell";
import { SectionType } from "@/types/section";
import { Badge } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { formatProgress } from "@/lib/utils";
import Image from "next/image";

// export type Section = {
//   swId: number;
//   value: number;
// };

// Tách ActionCell ra component riêng
export function useSectionColumns() {
  const columns = useMemo<ColumnDef<SectionType>[]>(
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
        accessorKey: "sectionName",
        header: ({ column }) => {
          return (
            <div className="text-left font-semibold text-gray-900 px-4 py-3">
              Tên phần
            </div>
          );
        },
        cell: ({ row }) => {
          const sectionName = row.original.sectionName;
          return (
            <div className="text-left text-gray-700 px-4 py-3 font-medium">
              {sectionName}
            </div> 
          );
        }
      },
      {
        accessorKey: "estimateTime",
        header: ({ column }) => {
          return (
            <div className="text-center font-semibold text-gray-900 px-4">
              Thời gian dự kiến
            </div>
          );
        },
        cell: ({ row }) => {
          const estimateTime = row.original.estimateTime;
          return (
            <div className="text-center text-gray-700 px-4">
              <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                {estimateTime}
              </span>
            </div> 
          );
        }
      },
      {
        accessorKey: "iconUrl",
        header: ({ column }) => {
          return (
            <div className="text-center font-semibold text-gray-900 px-4">
              Icon
            </div>
          );
        },
        cell: ({ row }) => {
          const iconUrl = row.original.iconUrl;
          return (
            <div className="text-center px-4">
              <a 
                href={iconUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block cursor-pointer hover:opacity-80 transition-opacity relative group"
              >
                <Image 
                  src={iconUrl} 
                  alt="Section icon"
                  className="w-10 h-10 object-cover border border-gray-200 rounded-lg"
                  width={45}
                  height={45}
                  unoptimized
                />
                <div className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <svg 
                    className="w-4 h-4 text-white"
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
              </a>
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
          const order = parseInt(row.original.order) || 0;
          return (
            <div className="flex items-center justify-start px-4">
              <div
                className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium px-3 py-1.5 rounded-full transition-colors"
              >
                #{order}
              </div>
            </div>
          );
        }
      },
      // {
      //   accessorKey: "progress",
      //   header: () => (
      //     <div className="font-semibold text-gray-900 px-4">Tiến độ</div>
      //   ),
      //   cell: ({ row }) => {
      //     const progress = formatProgress(row.original.progress) || 0;

      //     return (
      //       <div className="flex items-center gap-3 w-[200px] px-4">
      //         <div className="w-full bg-gray-100 rounded-full h-2.5">
      //           <div
      //             className={`h-2.5 rounded-full transition-all ${
      //               Number(progress) < 30 
      //                 ? "bg-red-500" 
      //                 : Number(progress) < 70 
      //                 ? "bg-yellow-500" 
      //                 : "bg-emerald-500"
      //             }`}
      //             style={{ width: `${progress}%` }}
      //           />
      //         </div>
      //         <span className={`text-sm font-medium min-w-[45px] ${
      //           Number(progress) < 30 
      //             ? "text-red-500" 
      //             : Number(progress) < 70 
      //             ? "text-yellow-500" 
      //             : "text-emerald-500"
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
