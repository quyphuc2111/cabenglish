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
import { useUnitByClassId } from "@/hooks/use-units"
import { Skeleton } from "@/components/ui/skeleton"

interface UnitByClassComboboxProps {
  onSelect: (value: string) => void;
  placeholder?: string;
  classId: string;
  defaultValue?: string;
  buttonClassName?: string;
}

export function UnitByClassCombobox({ 
  onSelect, 
  placeholder = "Chọn unit...", 
  classId,
  defaultValue,
  buttonClassName
}: UnitByClassComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState(defaultValue || "")

  // Reset value khi classId thay đổi
  React.useEffect(() => {
    setValue("")
    onSelect("")
  }, [classId, onSelect])

  const { data, isLoading, error } = useUnitByClassId(classId);

  // Xử lý và validate dữ liệu
  const units = React.useMemo(() => {
    if (!data?.data || !Array.isArray(data.data)) {
      return [];
    }
    
    // Sắp xếp theo order nếu có
    return [...data.data].sort((a, b) => {
      if (typeof a.order === 'number' && typeof b.order === 'number') {
        return a.order - b.order;
      }
      return 0;
    });
  }, [data?.data]);

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

  // Hiển thị loading state
  if (isLoading) {
    return (
      <Skeleton className="w-[300px] h-10" />
    );
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

  const selectedUnit = units.find((unit) => unit.unitId === Number(value));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-[300px] justify-between", buttonClassName)}
          disabled={units.length === 0}
        >
          <span className="truncate">
            {selectedUnit ? selectedUnit.unitName : placeholder}
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
          <CommandInput 
            placeholder="Tìm kiếm unit..." 
            className="h-9"
          />
          <CommandList>
            <CommandEmpty>Không tìm thấy unit nào.</CommandEmpty>
            <CommandGroup>
              {units.map((unit) => (
                <CommandItem
                  key={unit.unitId}
                  value={unit.unitId.toString()}
                  onSelect={handleSelect}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === unit.unitId.toString() ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span className="truncate">{unit.unitName}</span>
                  {unit.order && (
                    <span className="ml-2 text-sm text-muted-foreground">
                      (Thứ tự: {unit.order})
                    </span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
