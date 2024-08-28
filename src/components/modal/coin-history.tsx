import React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon } from "lucide-react";
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";
import { Calendar } from "../ui/calendar";
import { DataTable } from "../table/coin-table/data-table";
import { columns } from "../table/coin-table/columns";

function CoinHistory({ children }: any) {
  const [data, setData] = React.useState([
    {
      time: new Date(),
      paymentype: "currency",
      amount: 200,
      note: 'Mua ban'
    },
    {
      time: new Date(),
      paymentype: "currency",
      amount: 10,
      note: 'Mua ban'
    },
    {
      time: new Date(),
      paymentype: "currency",
      amount: 20,
      note: 'Mua ban'
    },
    {
      time: new Date(),
      paymentype: "currency",
      amount: 25,
      note: 'Mua ban'
    },
  ])
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2022, 0, 20),
    to: addDays(new Date(2022, 0, 20), 20),
  });

  const handleDateChange = (newDate: DateRange | undefined) => {
    // Ensure that the state update doesn't trigger any side-effects that might close the dialog
    setDate(newDate);
  };

  return (
    <Dialog >
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1000px] overflow-hidden" style={{borderRadius: '50px'}}>
        <DialogHeader>
          <DialogTitle>
            <h2 className="text-2xl border-l-[#ff9213] border-l-4 px-2 py-1">Lịch sử dùng xu</h2>
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col lg:flex-row gap-3">
          <Tabs defaultValue="1" className="w-[300px]">
            <TabsList className="grid w-full grid-cols-2 h-[48px]">
              <TabsTrigger className="py-2" value="1">Lịch sử đổi quà</TabsTrigger>
              <TabsTrigger  className="py-2" value="2">Lịch sử nhận xu</TabsTrigger>
            </TabsList>
            <TabsContent value="1">
              {/* Content for Lịch sử đổi quà */}
            </TabsContent>
            <TabsContent value="2">
              {/* Content for Lịch sử nhận xu */}
            </TabsContent>
          </Tabs>

          <div className={cn("grid gap-2")}>
            <Popover modal={true}>
              <PopoverTrigger asChild >
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-[300px] justify-start text-left font-normal h-[48px]",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} -{" "}
                        {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={handleDateChange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>

          <Button className="bg-[#21bdc6] shadow-course-inset py-6">Tìm kiếm</Button>
        </div>

        <div className="h-[450px]">
        <DataTable columns={columns} data={data} />
        </div>
        {/* <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
}

export default CoinHistory;
