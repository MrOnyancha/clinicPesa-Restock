import React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { FormControl } from '../ui/form';

interface ComboBoxProps {
  data: any[];
  value?: string;
  onChange?: (value: string) => void;
  onSelect?: (item: any) => void;
}

const ComboBox: React.FC<ComboBoxProps> = ({ data, value, onChange, onSelect }) => {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (currentValue: string) => {
    const newValue = currentValue === value ? '' : currentValue;
    const selectedItem = data.find((item) => item.name === currentValue);

    onChange?.(newValue);
    if (selectedItem) {
      onSelect?.(selectedItem);
    }
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between shadow-none p-2 text-xs"
          >
            {value ? data.find((item) => item.Name?._text === value)?.Name?._text : 'Select item...'}
            <ChevronsUpDown size={16} className="opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="p-0 min-w-max">
        <Command>
          <CommandInput placeholder="Search item..." className="h-9" />
          <CommandList>
            <CommandEmpty>No item found.</CommandEmpty>
            <CommandGroup>
              {data?.map((item) => {
                const name = item.Name?._text;
                if (!name) return null;
                return (
                  <CommandItem key={name} value={name} onSelect={handleSelect}>
                    {name}
                    <Check className={cn('ml-auto', value === name ? 'opacity-100' : 'opacity-0')} />
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ComboBox;
