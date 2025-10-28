"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { ActionCell } from "./action-cell";
import { Badge } from "@/components/ui/badge";
import { GripVertical } from "lucide-react";

export type GameAgeRow = {
  age_id: number;
  age_name: string;
  age_name_en: string;
  description?: string;
  min_age: number;
  max_age: number;
  order: number;
};

export function useGameAgesColumns() {
  const columns = useMemo<ColumnDef<GameAgeRow>[]>(
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
          <div className="flex items-center justify-center" data-checkbox>
            <Checkbox
              checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && "indeterminate")
              }
              onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
              aria-label="Select all"
              className="translate-y-[2px]"
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center justify-center" data-checkbox>
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select row"
              className="translate-y-[2px]"
            />
          </div>
        ),
        enableSorting: false,
        enableHiding: false,
        size: 50
      },
      {
        accessorKey: "age_id",
        header: "ID",
        cell: ({ row }) => (
          <div className="font-medium text-gray-900">
            {row.getValue("age_id")}
          </div>
        ),
        size: 80
      },
      {
        accessorKey: "age_name",
        header: "Tên (Tiếng Việt)",
        cell: ({ row }) => (
          <div className="font-medium text-gray-900">
            {row.getValue("age_name")}
          </div>
        ),
        size: 200
      },
      {
        accessorKey: "age_name_en",
        header: "Tên (English)",
        cell: ({ row }) => (
          <div className="text-gray-700">
            {row.getValue("age_name_en")}
          </div>
        ),
        size: 200
      },
      {
        id: "ageRange",
        header: "Độ tuổi",
        cell: ({ row }) => {
          const minAge = row.original.min_age;
          const maxAge = row.original.max_age;
          return (
            <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200">
              {minAge} - {maxAge} tuổi
            </Badge>
          );
        },
        size: 150
      },
      {
        accessorKey: "description",
        header: "Mô tả",
        cell: ({ row }) => {
          const description = row.getValue("description") as string;
          return (
            <div className="text-gray-600 text-sm max-w-[300px] truncate">
              {description || <span className="text-gray-400 italic">Không có mô tả</span>}
            </div>
          );
        },
        size: 300
      },
      {
        accessorKey: "order",
        header: "Thứ tự",
        cell: ({ row }) => (
          <Badge variant="outline" className="font-mono">
            {row.getValue("order")}
          </Badge>
        ),
        size: 100
      },
      {
        id: "actions",
        header: "Hành động",
        cell: ({ row, table }) => <ActionCell row={row} table={table} />,
        size: 120,
        enableSorting: false,
        enableHiding: false
      }
    ],
    []
  );

  return columns;
}

