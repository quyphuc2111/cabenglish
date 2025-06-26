"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { useLessonsByClassIdUnitId } from "@/hooks/use-lessons";

interface LessonComboboxProps {
  onSelect: (value: string) => void;
  placeholder?: string;
  classId: string;
  defaultValue?: string;
  buttonClassName?: string;
  unitId: string;
}

export function LessonCombobox({
  onSelect,
  placeholder = "Chọn unit...",
  classId,
  defaultValue,
  buttonClassName,
  unitId
}: LessonComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(defaultValue || "");

  // Reset value khi classId thay đổi
  React.useEffect(() => {
    setValue("");
    onSelect("");
  }, [classId, onSelect]);

  const { data, isLoading, error } = useLessonsByClassIdUnitId(classId, unitId);

  // Xử lý và validate dữ liệu
  const lessons = React.useMemo(() => {
    if (!data?.data || !Array.isArray(data.data)) {
      return [];
    }

    // Sắp xếp theo order nếu có
    // return [...data.data].sort((a, b) => {
    //   if (typeof a.order === "number" && typeof b.order === "number") {
    //     return a.order - b.order;
    //   }
    //   return 0;
    // });
    return [...data.data]
  }, [data?.data]);

  const handleSelect = React.useCallback(
    (currentValue: string) => {
      const newValue = currentValue === value ? "" : currentValue;
      setValue(newValue);
      setOpen(false);
      onSelect(newValue);
    },
    [value, onSelect]
  );

  // Reset giá trị
  const handleReset = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setValue("");
    onSelect("");
    setOpen(false);
  }, [onSelect]);

  // Hiển thị loading state
  if (isLoading) {
    return <Skeleton className="w-[300px] h-10" />;
  }

  // Hiển thị error state
  if (error) {
    return (
      <Button
        variant="outline"
        className="w-[300px] justify-between text-red-500"
        disabled
      >
        Lỗi tải dữ liệu
      </Button>
    );
  }

  const selectedLesson = lessons.find(
    (lesson) => lesson.lessonId === Number(value)
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="flex items-center gap-2 relative">
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-[300px] justify-between pr-8",
              buttonClassName,
              lessons.length === 0 ? "opacity-50 cursor-not-allowed" : ""
            )}
            disabled={lessons.length === 0}
            title={
              lessons.length === 0 ? "Không có bài học cho unit này" : undefined
            }
          >
            <span className="truncate">
              {lessons.length === 0
                ? "Không có bài học cho unit này"
                : selectedLesson
                ? selectedLesson.lessonName
                : placeholder}
            </span>
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        
        {value && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 absolute right-1 top-1/2 -translate-y-1/2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full z-10"
            onClick={handleReset}
          >
            <X className="h-3 w-3 text-muted-foreground hover:text-red-500" />
          </Button>
        )}
      </div>
      
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Tìm kiếm bài học..." className="h-9" />
          <CommandList>
            <CommandEmpty>Không tìm thấy unit nào.</CommandEmpty>
            <CommandGroup>
              {lessons.map((lesson) => (
                <CommandItem
                  key={lesson.lessonId}
                  value={lesson.lessonId.toString()}
                  onSelect={handleSelect}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === lesson.lessonId.toString()
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  <span className="truncate">{lesson.lessonName}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
