"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

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
import { useSchoolWeek } from "@/hooks/use-schoolweek"

interface SchoolWeekComboboxProps {
  onSelect: (value: string) => void;
  placeholder?: string;
}

export function SchoolWeekCombobox({ onSelect, placeholder = "Tìm kiếm tuần học..." }: SchoolWeekComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  const { data, isLoading } = useSchoolWeek();

    // Kiểm tra và đảm bảo data.data là một mảng
  const schoolWeeks = React.useMemo(() => {
    return Array.isArray(data?.data) ? data.data : [];
  }, [data?.data]);

  const handleSelect = (currentValue: string) => {
    setValue(currentValue === value ? "" : currentValue);
    setOpen(false);
    onSelect(currentValue === value ? "" : currentValue);
  }

  if(isLoading) return null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
      <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[300px] justify-between"
        >
          {value
            ? schoolWeeks.find((schoolweek) => schoolweek.swId == Number(value))?.swId
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
              {
                schoolWeeks.map((schoolweek) => (
                  <CommandItem
                    key={schoolweek.swId}
                    value={schoolweek.swId.toString()}
                    onSelect={handleSelect}
                  >
                    Tuần {schoolweek.value}
                  </CommandItem>
                ))
              }
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
