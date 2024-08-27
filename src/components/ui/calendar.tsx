'use client';

import * as React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import { DayPicker } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

import { SelectComponent } from './select';

interface CalendarProps {
  translate?: 'en' | 'es';
  [key: string]: any;
}

const montsLib: Record<'es' | 'en', Record<number, string>> = {
  es: {
    1: 'Enero',
    2: 'Febrero',
    3: 'Marzo',
    4: 'Abril',
    5: 'Mayo',
    6: 'Junio',
    7: 'Julio',
    8: 'Agosto',
    9: 'Septiembre',
    10: 'Octubre',
    11: 'Noviembre',
    12: 'Diciembre'
  },
  en: {
    1: 'January',
    2: 'February',
    3: 'March',
    4: 'April',
    5: 'May',
    6: 'June',
    7: 'July',
    8: 'August',
    9: 'September',
    10: 'October',
    11: 'November',
    12: 'December'
  }
};

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      classNames={{
        months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
        month: 'space-y-4',
        caption: 'flex justify-center pt-1 relative items-center',
        caption_label: 'text-sm font-medium',
        nav: 'space-x-1 flex items-center',
        nav_button: cn(
          buttonVariants({ variant: 'outline' }),
          'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
        ),
        nav_button_previous: 'absolute left-1',
        nav_button_next: 'absolute right-1',
        table: 'w-full border-collapse space-y-1',
        head_row: 'flex',
        head_cell:
          'text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]',
        row: 'flex w-full mt-2',
        cell: cn(
          'relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent',
          props.mode === 'range'
            ? '[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md'
            : '[&:has([aria-selected])]:rounded-md'
        ),
        day: cn(
          buttonVariants({ variant: 'ghost' }),
          'h-8 w-8 p-0 font-normal aria-selected:opacity-100'
        ),
        day_range_start: 'day-range-start',
        day_range_end: 'day-range-end',
        day_selected:
          'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
        day_today: 'bg-accent text-accent-foreground',
        day_outside: 'text-muted-foreground opacity-50',
        day_disabled: 'text-muted-foreground opacity-50',
        day_range_middle:
          'aria-selected:bg-accent aria-selected:text-accent-foreground',
        day_hidden: 'invisible',
        ...classNames
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeftIcon className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRightIcon className="h-4 w-4" />
      }}
      {...props}
    />
  );
}
Calendar.displayName = 'Calendar';

const CalendarComponent: React.FC<CalendarProps> = ({ translate = 'en', ...props }) => {
  const [date, setDate] = React.useState<Date>(new Date());

  const handleMonthChange = React.useCallback((value: string) => {
    const newDate = new Date(date);
    newDate.setMonth(parseInt(value) - 1);
    setDate(newDate);
  }, [date]);
  
  const handleYearChange = React.useCallback((value: string) => {
    const newDate = new Date(date);
    newDate.setFullYear(parseInt(value));
    setDate(newDate);
  }, [date]);

  return (
    <>
      <div className="flex space-x-2">
        <SelectComponent
          items={[...(new Array(12) as number[])].map((_, index) => ({
            label: montsLib[translate][index + 1], 
            value: (index + 1).toString(),
          }))}
          value={(date.getMonth() + 1).toString()}
          onValueChange={handleMonthChange}
        />
        <SelectComponent
          items={[...(new Array(new Date().getFullYear() - 1900 + 1) as number[])]
            .map((_, index) => ({
              label: (index + 1900).toString(),
              value: (index + 1900).toString(),
            }))
            .reverse()}
          value={date.getFullYear().toString()}
          onValueChange={handleYearChange}
        />
      </div>
      <Calendar {...props} month={date} />
    </>
  );
};


export { Calendar, CalendarComponent };