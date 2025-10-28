"use client"

import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"
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
  defaultValue?: string;
}

export function SchoolWeekCombobox({ onSelect, placeholder = "Tìm kiếm tuần học...", defaultValue = "" }: SchoolWeekComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState(defaultValue)
  const [searchQuery, setSearchQuery] = React.useState("")

  const { data, isLoading } = useSchoolWeek();

  const schoolWeeks = React.useMemo(() => {
    return Array.isArray(data?.data) ? data.data : [];
  }, [data?.data]);

  const filteredWeeks = React.useMemo(() => {
    if (!searchQuery) return schoolWeeks;
    
    const normalizeText = (text: string) => {
      return deburr(toLower(trim(text)));
    };
    
    const normalizedQuery = normalizeText(searchQuery);
    
    return schoolWeeks.filter((week) => {
      const weekValue = week.value.toString();
      const weekLabel = normalizeText(`tuần ${weekValue}`);
      const weekLabelNoAccent = normalizeText(`tuan ${weekValue}`);
      
      // Tìm kiếm theo số tuần
      if (weekValue.includes(normalizedQuery)) {
        return true;
      }
      
      // Tìm kiếm theo "tuần + số" (có dấu)
      if (weekLabel.includes(normalizedQuery)) {
        return true;
      }
      
      // Tìm kiếm theo "tuan + số" (không dấu)
      if (weekLabelNoAccent.includes(normalizedQuery)) {
        return true;
      }
      
      // Tìm kiếm chỉ từ "tuần" hoặc "tuan"
      if ((normalizedQuery === 'tuần' || normalizedQuery === 'tuan') && weekValue) {
        return true;
      }
      
      // Tìm kiếm partial match với "tuan" hoặc "tuần"
      if (normalizedQuery.startsWith('tuan') || normalizedQuery.startsWith('tuần')) {
        const numberPart = normalizedQuery.replace(/^(tuan|tuần)\s*/, '');
        if (numberPart && weekValue.includes(numberPart)) {
          return true;
        }
      }
      
      return false;
    });
  }, [schoolWeeks, searchQuery]);

  const handleSelect = (currentValue: string) => {
    setValue(currentValue === value ? "" : currentValue);
    setOpen(false);
    onSelect(currentValue === value ? "" : currentValue);
    setSearchQuery("");
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setValue("");
    onSelect("");
    setSearchQuery("");
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
          className="w-[300px] justify-between relative"
        >
          {value ? getDisplayText(value) : placeholder}
          <div className="flex items-center gap-1">
           
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
             {value && (
              <div
                aria-label="Clear selection"
                role="button"
                className="relative z-10 p-1 -mr-1.5 rounded-full hover:bg-red-100 dark:hover:bg-red-800"
                onClick={handleClear}
              >
                <X className="h-4 w-4 shrink-0 opacity-50 hover:opacity-100 cursor-pointer" />
              </div>
            )}
          </div>
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
            <CommandEmpty>{`Không tìm thấy tuần học '${searchQuery}'`}</CommandEmpty>
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
