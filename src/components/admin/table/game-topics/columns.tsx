"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { ActionCell } from "./action-cell";
import { Badge } from "@/components/ui/badge";
import { GripVertical } from "lucide-react";
import Image from "next/image";

export type GameTopicRow = {
  topic_id: number;
  topic_name: string;
  topic_name_vi: string;
  icon_url?: string;
  description?: string;
  order: number;
  is_active: boolean;
};

export function useGameTopicsColumns() {
  const columns = useMemo<ColumnDef<GameTopicRow>[]>(
    () => [
      {
        id: "drag-handle",
        header: "",
        cell: () => (
          <div 
            className="cursor-grab active:cursor-grabbing p-2 hover:bg-gray-100 rounded transition-colors" 
            data-drag-handle
          >
            <GripVertical className="w-5 h-5 text-gray-400 hover:text-gray-600" />
          </div>
        ),
        size: 50,
        enableSorting: false,
        enableHiding: false
      },
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
        accessorKey: "icon_url",
        header: () => (
          <div className="font-semibold text-gray-900">Icon</div>
        ),
        cell: ({ row }) => {
          const icon = row.original.icon_url;
          return (
            <Image unoptimized src={icon || "/assets/image/no_image.png"} alt="Icon" width={48} height={48} />
          );
        }
      },
      {
        accessorKey: "topic_name",
        header: () => (
          <div className="font-semibold text-gray-900">Tên (English)</div>
        ),
        cell: ({ row }) => {
          const value = row.original.topic_name;
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
        accessorKey: "topic_name_vi",
        header: () => (
          <div className="font-semibold text-gray-900">Tên (Tiếng Việt)</div>
        ),
        cell: ({ row }) => {
          const value = row.original.topic_name_vi;
          return (
            <div className="font-medium text-gray-700 line-clamp-1 max-w-[300px]">
              {value}
            </div>
          );
        }
      },
      {
        accessorKey: "description",
        header: () => (
          <div className="font-semibold text-gray-900">Mô tả</div>
        ),
        cell: ({ row }) => {
          const value = row.original.description;
          return (
            <div className="font-medium text-gray-700 line-clamp-1 max-w-[300px]">{value}</div>
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
      {
        accessorKey: "is_active",
        header: () => (
          <div className="font-semibold text-gray-900">Trạng thái</div>
        ),
        cell: ({ row }) => {
          const isActive = row.original.is_active;
          return (
            <Badge
              variant={isActive ? "default" : "secondary"}
              className={`${
                isActive
                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              } font-medium`}
            >
              {isActive ? "Hoạt động" : "Vô hiệu"}
            </Badge>
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

