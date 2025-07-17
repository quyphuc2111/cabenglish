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
import { useClassrooms } from "@/hooks/use-classrooms";
import { Skeleton } from "@/components/ui/skeleton";
import { fuzzySearch } from "@/lib/utils";

interface ClassroomComboboxProps {
  onSelect: (value: string) => void;
  placeholder?: string;
  defaultValue?: string;
  buttonClassName?: string;
}

export function ClassroomCombobox({
  onSelect,
  placeholder = "Tìm kiếm lớp học...",
  defaultValue,
  buttonClassName
}: ClassroomComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(defaultValue || "");
  const [searchValue, setSearchValue] = React.useState("");

  const { data, isLoading } = useClassrooms();

  const classrooms = React.useMemo(() => {
    return Array.isArray(data?.data) ? data.data : [];
  }, [data?.data]);

  const groupedClassrooms = React.useMemo(() => {
    // Lọc classrooms dựa trên search value
    const filteredClassrooms = searchValue 
      ? classrooms.filter(classroom => 
          fuzzySearch(searchValue, classroom.classname)
        )
      : classrooms;

    const groups = filteredClassrooms.reduce((acc, classroom) => {
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
    }, {} as Record<string, { classname: string; count: number; items: typeof classrooms }>);

    return Object.values(groups);
  }, [classrooms, searchValue]);

  const handleSelect = React.useCallback(
    (currentValue: string) => {
      const newValue = currentValue === value ? "" : currentValue;
      setValue(newValue);
      setOpen(false);
      onSelect(newValue);
    },
    [value, onSelect]
  );

  const handleReset = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setValue("");
    onSelect("");
    setOpen(false);
    setSearchValue("");
  }, [onSelect]);

  const handleSearchChange = React.useCallback((search: string) => {
    setSearchValue(search);
  }, []);

  if (isLoading) return <Skeleton className="w-[300px] h-10" />;

  const selectedClassroom = classrooms.find(
    (classroom) => classroom.class_id === Number(value)
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="flex items-center gap-2 relative">
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("w-[300px] justify-between pr-8", buttonClassName)}
          >
            <span className="truncate">
              {selectedClassroom ? selectedClassroom.classname : placeholder}
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
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder={placeholder} 
            className="h-9" 
            value={searchValue}
            onValueChange={handleSearchChange}
          />
          <CommandList>
            <CommandEmpty>
              {searchValue ? `Không tìm thấy lớp học cho "${searchValue}"` : "Không tìm thấy lớp học."}
            </CommandEmpty>
            <CommandGroup>
              {groupedClassrooms.map((group) => (
                <CommandItem
                  key={group.classname}
                  value={group.classname}
                  onSelect={(value) => {
                    if (group.items.length === 1) {
                      handleSelect(group.items[0].class_id.toString());
                    } else {
                      handleSelect(group.items[0].class_id.toString());
                    }
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      group.items.some(
                        (item) => item.class_id.toString() === value
                      )
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
  );
}
