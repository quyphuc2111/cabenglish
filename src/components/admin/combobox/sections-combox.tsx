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
import { useGetSectionByLessonId } from "@/hooks/use-sections";

const removeVietnameseAccents = (str: string): string => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
};

interface SectionsComboboxProps {
  onSelect: (value: string) => void;
  placeholder?: string;
  lessonId: string;
  defaultValue?: string;
  buttonClassName?: string;
}

export function SectionsCombobox({
  onSelect,
  placeholder = "Chọn section...",
  lessonId,
  defaultValue,
  buttonClassName,
}: SectionsComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(defaultValue || "");

  // Reset value khi lessonId thay đổi
  React.useEffect(() => {
    setValue("");
    onSelect("");
  }, [lessonId, onSelect]);

  const { data: sectionData, isLoading: sectionLoading, error: sectionError } = useGetSectionByLessonId(Number(lessonId));
  // Xử lý và validate dữ liệu
  const sections = React.useMemo(() => {
    if (!sectionData?.data || !Array.isArray(sectionData.data)) {
      return [];
    }

    // Sắp xếp theo order nếu có
    return [...sectionData.data].sort((a, b) => {
      if (typeof a.order === "number" && typeof b.order === "number") {
        return a.order - b.order;
      }
      return 0;
    });
    // return [...sectionData.data]
  }, [sectionData?.data]);

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
  if (sectionLoading) {
    return <Skeleton className="w-[300px] h-10" />;
  }

  // Hiển thị error state
  if (sectionError) {
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

  const selectedSection = sections.find(
    (section) => section.sectionId === Number(value)
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
              sections.length === 0 ? "opacity-50 cursor-not-allowed" : ""
            )}
            disabled={sections.length === 0}
            title={
              sections.length === 0 ? "Không có section cho bài học này" : undefined
            }
          >
            <span className="truncate">
              {sections.length === 0
                ? "Không có section cho bài học này"
                : selectedSection
                ? selectedSection.sectionName
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
          <CommandInput placeholder="Tìm kiếm section..." className="h-9" />
          <CommandList>
            <CommandEmpty>Không tìm thấy section nào.</CommandEmpty>
            <CommandGroup>
              {sections.map((section) => (
                <CommandItem
                  key={section.sectionId}
                  value={`${section.sectionName} ${section.sectionName.toLowerCase()} ${section.sectionName.toUpperCase()} ${removeVietnameseAccents(section.sectionName)}`} // Bao gồm cả tiếng Việt không dấu
                  onSelect={() => handleSelect(section.sectionId.toString())}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === section.sectionId.toString()
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  <span className="truncate">{section.sectionName}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
