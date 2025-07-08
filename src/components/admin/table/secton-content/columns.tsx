"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { ActionCell } from "./action-cell";
import { SectionContentAdminType } from "@/types/section";
import Image from "next/image";
import { Tooltip, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TooltipContent } from "@radix-ui/react-tooltip";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Tách ActionCell ra component riêng
export function useSectionContentColumns() {
  const columns = useMemo<ColumnDef<SectionContentAdminType>[]>(
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
        accessorKey: "title",
        header: ({ column }) => {
          return (
            <div className="text-left font-semibold text-gray-900 px-4 py-3">
              Tên phần
            </div>
          );
        },
        cell: ({ row }) => {
          const title = row.original.title;
          return (
            <div className="text-left text-gray-700 px-4 py-3 font-medium hover:bg-gray-50 transition-colors">
              {title}
            </div> 
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
                    <div className="text-sm text-gray-600  cursor-pointer hover:text-gray-900 transition-colors line-clamp-3 max-w-[300px]">
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
        accessorKey: "icon_url",
        header: ({ column }) => {
          return (
            <div className="text-center font-semibold text-gray-900 px-4">
              Icon
            </div>
          );
        },
        cell: ({ row }) => {
          const iconUrl = row.original.icon_url;
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
        accessorKey: "iframe_url",
        header: ({ column }) => {
          return (
            <div className="text-left font-semibold text-gray-900 px-4">
              Iframe URL
            </div>
          );
        },
        cell: ({ row }) => {
          const iframeUrl = row.original.iframe_url;
          return (
            <div className="px-4 flex items-center gap-2">
              <a 
                href={iframeUrl}
                target="_blank"
                rel="noopener noreferrer" 
                className="truncate max-w-[250px] text-left text-indigo-600 hover:text-indigo-800 hover:underline transition-colors"
              >
                {iframeUrl}
              </a>
              
              <Dialog>
                <DialogTrigger asChild>
                  <button 
                    className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
                    title="Xem trước"
                  >
                    <svg 
                      className="w-4 h-4 text-gray-600" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
                      />
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" 
                      />
                    </svg>
                  </button>
                </DialogTrigger>
                <DialogContent className="w-[800px] h-[600px] p-0">
                  <iframe 
                    src={iframeUrl} 
                    className="w-full h-full rounded-lg"
                    title="Preview"
                  />
                </DialogContent>
              </Dialog>
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
              <div className="bg-white border-2 border-indigo-200 shadow-sm text-indigo-700 font-medium px-3 py-1.5 rounded-md transition-all hover:border-indigo-400 hover:shadow">
                {order}
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
