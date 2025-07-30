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

const removeVietnameseTones = (str: string): string => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
};

// Utility function để tìm kiếm không phân biệt dấu
const searchMatch = (searchTerm: string, targetText: string): boolean => {
  const normalizedSearch = removeVietnameseTones(searchTerm.trim());
  const normalizedTarget = removeVietnameseTones(targetText);
  return normalizedTarget.includes(normalizedSearch);
};

interface UnitByClassComboboxProps {
  onSelect: (value: string) => void;
  onChange?: (value: string) => void;
  placeholder?: string;
  classId: string;
  defaultValue?: string;
  buttonClassName?: string;
}

export function UnitByClassCombobox({ 
  onSelect, 
  onChange,
  placeholder = "Chọn unit...", 
  classId,
  defaultValue,
  buttonClassName
}: UnitByClassComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState(defaultValue || "")
  const [searchValue, setSearchValue] = React.useState("")

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

  // Lọc units theo search value
  const filteredUnits = React.useMemo(() => {
    if (!searchValue.trim()) {
      return units;
    }
    
    return units.filter(unit => 
      searchMatch(searchValue, unit.unitName)
    );
  }, [units, searchValue]);

  const handleSelect = React.useCallback((currentValue: string) => {
    const newValue = currentValue === value ? "" : currentValue;
    setValue(newValue);
    setSearchValue(""); // Clear search khi select
    setOpen(false);
    onSelect(newValue);
    onChange?.(newValue);
  }, [value, onSelect, onChange]);

  // Reset giá trị
  const handleReset = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setValue("");
    onSelect("");
    onChange?.("");
    setSearchValue("");
    setOpen(false);
  }, [onSelect, onChange]);

  // Xử lý thay đổi search value
  const handleSearchChange = React.useCallback((search: string) => {
    setSearchValue(search);
    // Clear selection khi người dùng bắt đầu tìm kiếm
    if (search.trim() && value) {
      setValue("");
      onSelect("");
      onChange?.("");
    }
  }, [value, onSelect, onChange]);

  // Xử lý khi popover đóng
  const handleOpenChange = React.useCallback((isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setSearchValue(""); // Clear search khi đóng popover
    }
  }, []);

  const selectedUnit = units.find((unit) => unit.unitId === Number(value));

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

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <div className="flex items-center gap-2 relative">
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("w-[300px] justify-between pr-8", buttonClassName)}
            disabled={units.length === 0}
            onClick={() => setSearchValue("")}
          >
            <span className="truncate">
              {selectedUnit ? selectedUnit.unitName : placeholder}
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
            placeholder="Tìm kiếm unit theo tên..." 
            className="h-9"
            value={searchValue}
            onValueChange={handleSearchChange}
          />
          <CommandList>
            <CommandEmpty>
              {searchValue.trim() 
                ? `Không tìm thấy unit nào với từ khóa "${searchValue}"`
                : "Không có unit nào."
              }
            </CommandEmpty>
            <CommandGroup>
              {filteredUnits.map((unit) => (
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
