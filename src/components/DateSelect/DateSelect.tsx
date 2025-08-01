import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { FormControl } from '../ui/form';
import { MdOutlineCalendarMonth } from 'react-icons/md';

interface DateSelectProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
}

export default function DateSelect({ value, onChange }: DateSelectProps) {
  return (
    <div className="border border-slate-300 dark:border-slate-700 rounded-md">
      <Popover>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              // disabled
              variant={'outline'}
              className={cn(
                'w-[160px] flex  items-center px-2 rounded-md border-none justify-between text-left font-normal h-7',
                !value && 'text-muted-foreground',
              )}
            >
              {value ? (
                <span className="text-xs text-text-color dark:text-white">{format(value, 'PPP')}</span>
              ) : (
                <span className="text-xs text-text-color dark:text-white">Pick a date</span>
              )}
              <MdOutlineCalendarMonth className="mr-2 h-4 w-4 text-text-color" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" selected={value} onSelect={onChange} initialFocus />
        </PopoverContent>
      </Popover>
    </div>
  );
}
