import React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { FormControl } from '@/components';
import { useQuery } from '@tanstack/react-query';
import { postQBXMLData } from '@/services/httphandler';
import { WebService } from '@/web-services/WebService';

interface Vendor {
  listID: string;
  name: string;
  email: string;
  phone: string;
  isActive: boolean;
  vendorAddress: {
    addr1: string;
    city: string;
    country: string;
    postalCode: string;
    note?: string;
  };
}

interface VendorComboBoxProps {
  value?: string;
  onChange?: (value: string) => void;
  onSelect?: (item: string) => void; // passing vendor name on select
   options?: Vendor[]; 
}

const VendorComboBox: React.FC<VendorComboBoxProps> = ({ value, onChange, onSelect, options = []  }) => {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');

  const { data: vendors = [], isLoading } = useQuery({
    queryKey: ['vendors', searchTerm],
    queryFn: async (): Promise<Vendor[]> => {
      if (!searchTerm) return [];

      const res = await WebService.postPharma('vendors', {
        requestType: 'SEARCH_VENDOR',
        qbxmlMsgsRq: {
          _attr: { onError: 'stopOnError' },
          vendorAddRq: [
            {
              vendorAdd: {
                name: searchTerm,
              },
            },
          ],
        },
      });

      // Only return the message array if status is true
      if (res.status === true && Array.isArray(res.message)) {
        return res.message;
      }

      return [];
    },
    enabled: Boolean(searchTerm),
  });


  const handleSelect = (currentValue: string) => {
    const selectedItem = vendors.find((item) => item.name === currentValue);
    const newValue = currentValue === value ? '' : currentValue;

    onChange?.(newValue);
    if (selectedItem) {
      console.log('Selected vendor:', selectedItem);
      onSelect?.(selectedItem.name);
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
            className="w-[250px] justify-between shadow-none p-2 text-xs"
          >
            {value || 'Select vendor...'}
            <ChevronsUpDown size={16} className="opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="p-0 min-w-max">
        <Command>
          <CommandInput
            placeholder="Search vendor..."
            className="h-9"
            value={searchTerm}
            onValueChange={(val) => setSearchTerm(val)}
          />
          <CommandList>
            <CommandEmpty>No vendor found.</CommandEmpty>
            <CommandGroup>
              {vendors.map((vendor) => (
                <CommandItem
                  key={vendor.listID}
                  value={vendor.name}
                  onSelect={handleSelect}
                >
                  {vendor.name}
                  <Check
                    className={cn(
                      'ml-auto',
                      value === vendor.name ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default VendorComboBox;
