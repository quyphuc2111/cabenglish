"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { ActionCell } from "./action-cell";
import { Badge } from "@/components/ui/badge";
import { GripVertical } from "lucide-react";
import Image from "next/image";

export type GameRow = {
  game_id: number;
  game_name: string;
  game_name_vi: string;
  description?: string;
  image_url?: string;
  url_game: string;
  num_liked: number;
  difficulty_level: "easy" | "medium" | "hard";
  estimated_duration: number;
  is_active: boolean;
  order: number;
  topics: Array<{
    topic_id: number;
    topic_name: string;
    topic_name_vi: string;
    icon_url?: string;
  }>;
  ages: Array<{
    age_id: number;
    age_name: string;
    age_name_en: string;
  }>;
};

const getDifficultyColor = (level: string) => {
  switch (level) {
    case "easy": return "bg-green-100 text-green-700";
    case "medium": return "bg-yellow-100 text-yellow-700";
    case "hard": return "bg-red-100 text-red-700";
    default: return "bg-gray-100 text-gray-700";
  }
};

const getDifficultyLabel = (level: string) => {
  switch (level) {
    case "easy": return "Dễ";
    case "medium": return "Trung bình";
    case "hard": return "Khó";
    default: return level;
  }
};

export function useGamesColumns() {
  const columns = useMemo<ColumnDef<GameRow>[]>(
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
        accessorKey: "game_id",
        header: "ID",
        cell: ({ row }) => (
          <div className="font-medium text-gray-900">
            {row.getValue("game_id")}
          </div>
        ),
        size: 80
      },
      {
        accessorKey: "image_url",
        header: "Hình ảnh",
        cell: ({ row }) => {
          const imageUrl = row.getValue("image_url") as string;
          const gameNameVi = row.original.game_name_vi;
          return (
            <Image
            src={imageUrl || "/assets/image/no_image.png"}
            alt={gameNameVi}
            width={64}
            height={64}
            className="rounded-lg object-cover"
            unoptimized
          />
          )
        },
        size: 100
      },
      {
        id: "game_name",
        header: "Tên game",
        cell: ({ row }) => (
          <div>
            <p className="font-medium text-gray-900">{row.original.game_name_vi}</p>
            <p className="text-sm text-gray-500">{row.original.game_name}</p>
          </div>
        ),
        size: 200
      },
      {
        id: "topics",
        header: "Chủ đề",
        cell: ({ row }) => {
          const topics = row.original.topics;
          return (
            <div className="flex flex-wrap gap-1">
              {topics.slice(0, 2).map(topic => (
                <Badge key={topic.topic_id} variant="secondary" className="text-xs">
                  {topic.icon_url} {topic.topic_name_vi}
                </Badge>
              ))}
              {topics.length > 2 && (
                <Badge variant="secondary" className="text-xs">
                  +{topics.length - 2}
                </Badge>
              )}
            </div>
          );
        },
        size: 150
      },
      {
        id: "ages",
        header: "Nhóm tuổi",
        cell: ({ row }) => {
          const ages = row.original.ages;
          return (
            <div className="flex flex-wrap gap-1">
              {ages.slice(0, 2).map(age => (
                <Badge key={age.age_id} variant="outline" className="text-xs">
                  {age.age_name}
                </Badge>
              ))}
              {ages.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{ages.length - 2}
                </Badge>
              )}
            </div>
          );
        },
        size: 150
      },
      {
        accessorKey: "difficulty_level",
        header: "Độ khó",
        cell: ({ row }) => {
          const level = row.getValue("difficulty_level") as string;
          return (
            <Badge className={getDifficultyColor(level)}>
              {getDifficultyLabel(level)}
            </Badge>
          );
        },
        size: 100
      },
      {
        accessorKey: "estimated_duration",
        header: "Thời lượng",
        cell: ({ row }) => (
          <div className="text-gray-700">
            ⏱️ {row.getValue("estimated_duration")} phút
          </div>
        ),
        size: 120
      },
      {
        accessorKey: "num_liked",
        header: "Lượt thích",
        cell: ({ row }) => (
          <div className="font-medium text-gray-900">
            ❤️ {row.getValue("num_liked")}
          </div>
        ),
        size: 100
      },
      {
        accessorKey: "is_active",
        header: "Trạng thái",
        cell: ({ row }) => {
          const isActive = row.getValue("is_active") as boolean;
          return (
            <Badge className={isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
              {isActive ? "Hoạt động" : "Vô hiệu"}
            </Badge>
          );
        },
        size: 120
      },
      {
        accessorKey: "order",
        header: "Thứ tự",
        cell: ({ row }) => (
          <div className="text-gray-700">
            {row.getValue("order")}
          </div>
        ),
        size: 100
      },
      {
        id: "actions",
        header: "Hành động",
        cell: ({ row, table }) => <ActionCell row={row} table={table} />,
        size: 150,
        enableSorting: false,
        enableHiding: false
      }
    ],
    []
  );

  return columns;
}

