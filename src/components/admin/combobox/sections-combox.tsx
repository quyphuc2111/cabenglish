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

  console.log("sectionData", sectionData);
  // Xử lý và validate dữ liệu
  const sections = React.useMemo(() => {
    if (!sectionData || !Array.isArray(sectionData)) {
      return [];
    }

    // Sắp xếp theo order nếu có
    // return [...data.data].sort((a, b) => {
    //   if (typeof a.order === "number" && typeof b.order === "number") {
    //     return a.order - b.order;
    //   }
    //   return 0;
    // });
    return [...sectionData]
  }, [sectionData]);

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
  const handleReset = React.useCallback(() => {
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
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-[300px] justify-between",
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
          <div className="flex items-center gap-2">
            {value && (
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={(e) => {
                  e.stopPropagation();
                  handleReset();
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Tìm kiếm bài học..." className="h-9" />
          <CommandList>
            <CommandEmpty>Không tìm thấy unit nào.</CommandEmpty>
            <CommandGroup>
              {sections.map((section) => (
                <CommandItem
                  key={section.sectionId}
                  value={section.sectionId.toString()}
                  onSelect={handleSelect}
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
