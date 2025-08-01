import React from 'react';
import { addDays, format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface DatePickerWithRangeProps {
  className?: string;
  startDate?: Date;
  endDate?: Date;
  onDateChange: (range: { from: Date; to: Date }) => void;
  placeholder?: string;
  onClear?: () => void;
}

export function DatePickerWithRange({
  className,
  startDate,
  endDate,
  onDateChange,
  onClear,
  placeholder = 'Pick a date',
}: DatePickerWithRangeProps) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: startDate,
    to: endDate,
  });

  // Sync with props when they change
  React.useEffect(() => {
    setDate({
      from: startDate,
      to: endDate,
    });
  }, [startDate, endDate]);

  const handleDateChange = (range: DateRange) => {
    setDate(range);
    if (range?.from && range?.to) {
      onDateChange({ from: range.from, to: range.to });
    }
  };

  const handleClear = () => {
    setDate(undefined);
    onClear?.();
  };

  return (
    <div className={cn('grid gap-2 border border-slate-300 dark:border-slate-700 rounded-md', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'w-[220px] justify-start border-none text-left font-normal h-[30px]',
              !date?.from && 'text-muted-foreground',
            )}
          >
            <CalendarIcon className="mr-2 h-3 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'LLL dd, y')} - {format(date.to, 'LLL dd, y')}
                </>
              ) : (
                format(date.from, 'LLL dd, y')
              )
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar initialFocus mode="range" selected={date} onSelect={handleDateChange} numberOfMonths={2} />
          <Button variant={'link'} onClick={handleClear} className="w-full justify-start p-2">
            Clear date range
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
}
