"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
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
import { useNotiType } from "@/hooks/use-notitype";
import { cn } from "@/lib/utils";

// Hàm normalize text để hỗ trợ tìm kiếm tiếng Việt
const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Loại bỏ dấu
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d");
};

interface NotiTypeComboboxProps {
  onSelect: (value: string) => void;
  placeholder?: string;
  buttonClassName?: string;
}

export function NotiTypeCombobox({
  onSelect,
  placeholder = "Tìm kiếm loại thông báo...",
  buttonClassName
}: NotiTypeComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  const { data, isLoading } = useNotiType();

  // Kiểm tra và đảm bảo data.data là một mảng
  const notiTypes = React.useMemo(() => {
    return Array.isArray(data?.data) ? data.data : [];
  }, [data?.data]);

  // Hàm filter tùy chỉnh cho tìm kiếm tiếng Việt
  const filterFunction = React.useCallback((value: string, search: string) => {
    const normalizedValue = normalizeText(value);
    const normalizedSearch = normalizeText(search);
    return normalizedValue.includes(normalizedSearch);
  }, []);

  const handleSelect = (currentValue: string) => {
    setValue(currentValue === value ? "" : currentValue);
    setOpen(false);
    onSelect(currentValue === value ? "" : currentValue);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setValue("");
    onSelect("");
  };

  if (isLoading) return null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-[300px] justify-between relative", buttonClassName)}
        >
          {value
            ? notiTypes.find((notitype) => notitype.ntId == Number(value))?.value
            : placeholder}
          <div className="flex items-center space-x-1">
            {value && (
              <button
                type="button"
                onClick={handleClear}
                className="
                  h-4 w-4 rounded-full 
                  bg-gray-200 hover:bg-gray-300 
                  flex items-center justify-center 
                  transition-colors duration-200
                  group
                "
              >
                <X className="h-3 w-3 text-gray-600 group-hover:text-gray-800" />
              </button>
            )}
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command filter={filterFunction}>
          <CommandInput placeholder={placeholder} className="h-9" />
          <CommandList>
            <CommandEmpty>Không tìm thấy loại thông báo.</CommandEmpty>
            <CommandGroup>
              {notiTypes.map((notitype) => (
                <CommandItem
                  key={notitype.ntId}
                  value={notitype.value}
                  keywords={[normalizeText(notitype.value)]}
                  onSelect={() => handleSelect(notitype.ntId.toString())}
                >
                  <Check 
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === notitype.ntId.toString() ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {notitype.value}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
