"use client"

import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useClassrooms } from "@/hooks/use-classrooms"
import { Skeleton } from "@/components/ui/skeleton"

interface ClassroomComboboxProps {
  onSelect: (value: string) => void;
  placeholder?: string;
  defaultValue?: string;
}

export function ClassroomCombobox({ 
  onSelect, 
  placeholder = "Tìm kiếm lớp học...",
  defaultValue 
}: ClassroomComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState(defaultValue || "")

  const { data, isLoading } = useClassrooms();

  // Kiểm tra và đảm bảo data.data là một mảng
  const classrooms = React.useMemo(() => {
    return Array.isArray(data?.data) ? data.data : [];
  }, [data?.data]);

  // Thêm hàm để nhóm các lớp học
  const groupedClassrooms = React.useMemo(() => {
    const groups = classrooms.reduce((acc, classroom) => {
      const name = classroom.classname;
      if (!acc[name]) {
        acc[name] = {
          classname: name,
          count: 1,
          items: [classroom]
        };
      } else {
        acc[name].count++;
        acc[name].items.push(classroom);
      }
      return acc;
    }, {} as Record<string, { classname: string; count: number; items: typeof classrooms }>) ;

    return Object.values(groups);
  }, [classrooms]);

  const handleSelect = React.useCallback((currentValue: string) => {
    const newValue = currentValue === value ? "" : currentValue;
    setValue(newValue);
    setOpen(false);
    onSelect(newValue);
  }, [value, onSelect]);

  // Reset giá trị
  const handleReset = React.useCallback(() => {
    setValue("");
    onSelect("");
    setOpen(false);
  }, [onSelect]);

  if(isLoading) return <Skeleton className="w-[300px] h-10" />;

  const selectedClassroom = classrooms.find(
    (classroom) => classroom.class_id === Number(value)
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[300px] justify-between"
          >
            <span className="truncate">
              {selectedClassroom ? selectedClassroom.classname : placeholder}
            </span>
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
          {value && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={handleReset}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder={placeholder} className="h-9" />
          <CommandList>
            <CommandEmpty>Không tìm thấy lớp học.</CommandEmpty>
            <CommandGroup>
              {groupedClassrooms.map((group) => (
                <CommandItem
                  key={group.classname}
                  value={group.classname}
                  onSelect={(value) => {
                    // Nếu chỉ có 1 lớp trong nhóm, chọn luôn
                    if (group.items.length === 1) {
                      handleSelect(group.items[0].class_id.toString());
                    } else {
                      // Nếu có nhiều lớp, mở rộng để hiển thị chi tiết
                      // TODO: Thêm logic để xử lý trường hợp nhiều lớp
                      handleSelect(group.items[0].class_id.toString());
                    }
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      group.items.some(item => item.class_id.toString() === value) 
                        ? "opacity-100" 
                        : "opacity-0"
                    )}
                  />
                  <div className="flex items-center justify-between w-full">
                    <span>{group.classname}</span>
                    {group.count > 1 && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        ({group.count})
                      </span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
