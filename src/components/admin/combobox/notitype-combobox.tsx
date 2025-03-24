"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
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

  const handleSelect = (currentValue: string) => {
    setValue(currentValue === value ? "" : currentValue);
    setOpen(false);
    onSelect(currentValue === value ? "" : currentValue);
  };

  if (isLoading) return null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-[300px] justify-between", buttonClassName)}
        >
          {value
            ? notiTypes.find((notitype) => notitype.ntId == Number(value))?.value
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder={placeholder} className="h-9" />
          <CommandList>
            <CommandEmpty>Không tìm thấy lớp học.</CommandEmpty>
            <CommandGroup>
              {notiTypes.map((notitype) => (
                <CommandItem
                  key={notitype.ntId}
                  value={notitype.ntId.toString()}
                  onSelect={handleSelect}
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
