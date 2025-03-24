"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { ActionCell } from "./action-cell";
import Image from "next/image";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { TooltipContent } from "@radix-ui/react-tooltip";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { NotiAdminType } from "@/types/notification";

// Tối ưu lại hàm formatDate
const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "-";

  // Format ngày hôm nay
  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();
  
  if (isToday) {
    return new Intl.DateTimeFormat("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  }

  // Format ngày trong tuần này
  const diffDays = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 7) {
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    return `${days[date.getDay()]} ${new Intl.DateTimeFormat("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)}`;
  }

  // Format các ngày khác
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  }).format(date);
};

// Cập nhật style chung cho tooltip
const tooltipContentStyles = "bg-white p-4 shadow-xl rounded-lg border border-gray-100 z-50 animate-in fade-in-0 zoom-in-95";

// Style cho các badge status
const typeBadgeStyles = {
  default: "bg-blue-50 text-blue-600",
  success: "bg-green-50 text-green-600",
  warning: "bg-amber-50 text-amber-600",
  error: "bg-red-50 text-red-600"
};

// Tách ActionCell ra component riêng
export function useNotiColumns() {
  const columns = useMemo<ColumnDef<NotiAdminType>[]>(
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
        header: () => <div className="font-semibold text-gray-900">#</div>,
        accessorKey: "index",
        cell: ({ row, table }) => {
          const index = table.getState().pagination.pageIndex * table.getState().pagination.pageSize + row.index + 1;
          return (
            <div className="w-8 h-8 flex items-center justify-center">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center font-medium text-indigo-700 text-xs shadow-sm">
                {String(index).padStart(2, "0")}
              </div>
            </div>
          );
        },
        size: 60
      },
      {
        accessorKey: "title",
        header: () => <div className="font-semibold text-gray-900">Tiêu đề</div>,
        cell: ({ row }) => {
          const title = row.original.title;
          return (
            <TooltipProvider>
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <div className="max-w-[180px] truncate text-sm text-gray-700 hover:text-indigo-600 transition-colors cursor-default">
                    {title}
                  </div>
                </TooltipTrigger>
                <TooltipContent className={tooltipContentStyles}>
                  <p className="text-sm font-medium text-gray-800">{title}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        },
        size: 200
      },
      {
        accessorKey: "description",
        header: () => <div className="font-semibold text-gray-900">Mô tả</div>,
        cell: ({ row }) => {
          const description = row.original.description;
          return (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="max-w-[200px] truncate text-sm text-gray-600">
                    {description}
                  </div>
                </TooltipTrigger>
                <TooltipContent className={tooltipContentStyles}>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        },
        size: 220
      },
      {
        accessorKey: "contentHtml",
        header: () => <div className="font-semibold text-gray-900">Nội dung</div>,
        cell: ({ row }) => {
          const contentHtml = row.original.contentHtml;
          return (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="max-w-[150px] truncate text-sm text-gray-600">
                    {contentHtml.replace(/<[^>]+>/g, ' ')}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className={`${tooltipContentStyles} w-[400px]`}>
                  <div className="max-h-[300px] overflow-y-auto prose prose-sm">
                    <div 
                      dangerouslySetInnerHTML={{ __html: contentHtml }}
                      className="text-gray-700"
                    />
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        },
        size: 170
      },
      {
        accessorKey: "lastSentTime",
        header: () => <div className="font-semibold text-gray-900">Gửi lúc</div>,
        cell: ({ row }) => {
          const lastSentTime = row.original.lastSentTime;
          return (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="text-sm text-gray-600 whitespace-nowrap">
                    {formatDate(lastSentTime)}
                  </div>
                </TooltipTrigger>
                <TooltipContent className={tooltipContentStyles}>
                  <p className="text-sm text-gray-700">
                    {new Intl.DateTimeFormat("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    }).format(new Date(lastSentTime))}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        },
        size: 100
      },
      {
        accessorKey: "createdAt",
        header: () => <div className="font-semibold text-gray-900">Tạo lúc</div>,
        cell: ({ row }) => {
          const createdAt = row.original.createdAt;
          return (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="text-sm text-gray-600 whitespace-nowrap">
                    {formatDate(createdAt)}
                  </div>
                </TooltipTrigger>
                <TooltipContent className={tooltipContentStyles}>
                  <p className="text-sm text-gray-700">
                    {new Intl.DateTimeFormat("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    }).format(new Date(createdAt))}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        },
        size: 100
      },
      {
        id: "actions",
        cell: ActionCell,
        header: () => <div className="font-semibold text-gray-900">Thao tác</div>,
        size: 100,
        meta: {
          position: "sticky",
          style: {
            right: 0,
            backgroundColor: "white",
            zIndex: 10,
            boxShadow: "-8px 0 16px -6px rgba(0,0,0,0.1)"
          }
        }
      }
    ],
    []
  );

  return columns;
}
