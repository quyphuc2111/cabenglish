"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { deburr, trim, toLower } from 'lodash'

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
  const [searchQuery, setSearchQuery] = React.useState("")

  const { data, isLoading } = useSchoolWeek();

  const schoolWeeks = React.useMemo(() => {
    return Array.isArray(data?.data) ? data.data : [];
  }, [data?.data]);

  const filteredWeeks = React.useMemo(() => {
    if (!searchQuery) return schoolWeeks;
    
    const normalizeText = (text: string) => {
      return deburr(toLower(text));
    };
    
    const normalizedQuery = trim(
      normalizeText(searchQuery).replace(/(tuan|tuan)\s*/g, '')
    );
    
    return schoolWeeks.filter((week) => {
      const weekValue = week.value.toString();
      const weekLabel = normalizeText(`tuan ${weekValue}`);
      
      return weekValue.includes(normalizedQuery) || 
             weekLabel.includes(normalizedQuery);
    });
  }, [schoolWeeks, searchQuery]);

  const handleSelect = (currentValue: string) => {
    setValue(currentValue === value ? "" : currentValue);
    setOpen(false);
    onSelect(currentValue === value ? "" : currentValue);
  }

  const getDisplayText = React.useCallback((selectedValue: string) => {
    const selectedWeek = schoolWeeks.find(
      (schoolweek) => schoolweek.swId.toString() === selectedValue
    );
    if (!selectedWeek) return "";
    return `Tuần ${selectedWeek.value}`;
  }, [schoolWeeks]);

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
          {value ? getDisplayText(value) : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder={placeholder} 
            className="h-9"
            onValueChange={setSearchQuery}
          />
          <CommandList>
            <CommandEmpty>Không tìm thấy tuần học.</CommandEmpty>
            <CommandGroup>
              {filteredWeeks.map((schoolweek) => (
                <CommandItem
                  key={schoolweek.swId}
                  value={schoolweek.swId.toString()}
                  onSelect={handleSelect}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === schoolweek.swId.toString() ? "opacity-100" : "opacity-0"
                    )}
                  />
                  Tuần {schoolweek.value}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
