// "use client";

// import * as React from "react";
// import { Check, ChevronsUpDown } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
// } from "@/components/ui/command";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { useClassrooms } from "@/hooks/use-classrooms";
// import { Loading } from "@/components/common/loading";

// interface ClassroomComboboxProps {
//   onSelect: (value: string) => void;
//   placeholder?: string;
// }

// export function ClassroomCombobox({ onSelect, placeholder = "Tìm kiếm lớp học..." }: ClassroomComboboxProps) {
//   const [open, setOpen] = React.useState(false);
//   const [value, setValue] = React.useState("");
//   const { data, isLoading } = useClassrooms();

//   const handleSelect = (currentValue: string) => {
//     setValue(currentValue === value ? "" : currentValue);
//     setOpen(false);
//     onSelect(currentValue === value ? "" : currentValue);
//   };

//   // Kiểm tra và đảm bảo data.data là một mảng
//   const classrooms = React.useMemo(() => {
//     return Array.isArray(data?.data) ? data.data : [];
//   }, [data?.data]);


//  if(isLoading) return null;

//   return (
//     <Popover open={open} onOpenChange={setOpen}>
//       <PopoverTrigger asChild>
//         <Button
//           variant="outline"
//           role="combobox"
//           aria-expanded={open}
//           className="w-[300px] justify-between"
//         >
//           {value
//             ? classrooms.find((classroom) => classroom.class_id == Number(value))?.classname
//             : placeholder}
//           <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//         </Button>
//       </PopoverTrigger>
//       <PopoverContent className="w-[300px] p-0">
//         <Command>
//           <CommandInput placeholder={placeholder} />
//           <CommandEmpty>Không tìm thấy lớp học.</CommandEmpty>
//           <CommandGroup>
//             {classrooms.map((classroom) => (
//               <CommandItem
//                 key={classroom.class_id.toString()}
//                 value={classroom.class_id.toString()}
//                 onSelect={handleSelect}
//               >
//                 <Check
//                   className={cn(
//                     "mr-2 h-4 w-4",
//                     value == classroom.class_id ? "opacity-100" : "opacity-0"
//                   )}
//                 />
//                 {classroom.classname}
//               </CommandItem>
//             ))}
//           </CommandGroup>
//         </Command>
//       </PopoverContent>
//     </Popover>
//   );
// } 

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
import { useClassrooms } from "@/hooks/use-classrooms"

interface ClassroomComboboxProps {
  onSelect: (value: string) => void;
  placeholder?: string;
}

export function ClassroomCombobox({ onSelect, placeholder = "Tìm kiếm lớp học..." }: ClassroomComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  const { data, isLoading } = useClassrooms();

    // Kiểm tra và đảm bảo data.data là một mảng
  const classrooms = React.useMemo(() => {
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
            ? classrooms.find((classroom) => classroom.class_id == Number(value))?.classname
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
                classrooms.map((classroom) => (
                  <CommandItem
                    key={classroom.class_id}
                    value={classroom.class_id.toString()}
                    onSelect={handleSelect}
                  >
                    {classroom.classname}
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
