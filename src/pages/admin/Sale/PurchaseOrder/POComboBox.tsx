import React, { useState, useEffect } from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Product } from '@/utils/types';
import { toast } from 'sonner';
import { WebService } from '@/web-services/WebService';

type UnitOfMeasure = {
  fullName: string;
};

export type PurchaseOrderProduct = {
  quantity: number;
  rate: number;
  // Change unitOfMeasure type to allow array or string to match your data
  unitsOfMeasure?: UnitOfMeasure[]; // Optional array of unit of measure
  unitOfMeasure: string | UnitOfMeasure[];
  itemRef: {
    fullName: string;
  };
};

interface POComboBoxProps {
  data?: PurchaseOrderProduct[];
  selectedItem?: PurchaseOrderProduct | null;
  onItemSelect?: (item: PurchaseOrderProduct | null) => void;
  onAmountChange?: (amount: number) => void;
  onQuantityChange?: (quantity: number) => void;
  onRateChange?: (rate: number) => void;
  onUnitOfMeasureChange?: (unitOfMeasure: string) => void; // NEW callback prop
}

const POComboBox: React.FC<POComboBoxProps> = ({
  selectedItem: externalSelectedItem,
  onItemSelect,
  onAmountChange,
  onQuantityChange,
  onRateChange,
  onUnitOfMeasureChange,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PurchaseOrderProduct | null>(null);
  const [quantity, setQuantity] = useState<number>(0);
  const [rate, setRate] = useState<number>(0);
  const [search, setSearch] = useState('');
  const [items, setItems] = useState<PurchaseOrderProduct[]>([]);

  // NEW: track selected unit of measure string
  const [selectedUnitOfMeasure, setSelectedUnitOfMeasure] = useState<string>('');

  useEffect(() => {
    if (items.length === 0) {
      handleSearch('');
    }
  }, []);

  useEffect(() => {
    if (externalSelectedItem) {
      const newItem: PurchaseOrderProduct = {
        ...externalSelectedItem,
        quantity: quantity,
        rate: rate,
      };
      setSelectedItem(newItem);

      // Initialize selectedUnitOfMeasure
      const uom = externalSelectedItem.unitOfMeasure;

      if (typeof uom === 'string') {
        setSelectedUnitOfMeasure(uom);
      } else if (Array.isArray(uom) && uom.length > 0 && 'fullName' in uom[0]) {
        setSelectedUnitOfMeasure(uom[0].fullName);
      } else {
        setSelectedUnitOfMeasure('');
      }
    } else {
      setSelectedItem(null);
      setQuantity(0);
      setRate(0);
      setSearch('');
      setSelectedUnitOfMeasure('');
    }
  }, [externalSelectedItem, quantity, rate]);


  const handleSearch = async (query: string) => {
    setSearch(query);
    if (!query.trim()) return setItems([]);

    try {
      const data = {
        itemsRsAction: 'SEARCH_ITEMS',
        search: query,
        filterBy: 'NAME',
        declaration: {
          _attributes: { version: '1.0' },
        },
      };
      const response = await WebService.postPharma('items', data);

      if (!response || !response.message) {
        setItems([]);
        return;
      }

      const searchProductResponse = response?.message as unknown as Product[];

      const purchasedProducts = searchProductResponse.map((product): PurchaseOrderProduct => {
        return {
          quantity: quantity,
          rate: rate || parseFloat(product.purchaseCost || '0'),
          unitOfMeasure: product.unitsOfMeasure || [],
          itemRef: {
            fullName: product.fullName || product.name || '',
          },
        };
      });

      setItems(purchasedProducts);
    } catch (error) {
      toast.error('Error fetching items');
    }
  };

  const handleSelect = (currentValue: string) => {
    const found = items.find((item) => item.itemRef.fullName === currentValue);

    if (found) {
      const selected: PurchaseOrderProduct = {
        ...found,
        quantity: quantity || 1,
        rate: rate || found.rate || 0,
      };
      setSelectedItem(selected);
      setQuantity(selected.quantity);
      setRate(selected.rate);

      // Update selectedUnitOfMeasure and notify parent
      if (typeof selected.unitOfMeasure === 'string') {
        setSelectedUnitOfMeasure(selected.unitOfMeasure);
        onUnitOfMeasureChange?.(selected.unitOfMeasure); // ✅ Notify parent
      } else if (Array.isArray(selected.unitOfMeasure) && selected.unitOfMeasure.length > 0) {
        const firstUnit = selected.unitOfMeasure[0].fullName;
        setSelectedUnitOfMeasure(firstUnit);
        onUnitOfMeasureChange?.(firstUnit); // ✅ Notify parent
      } else {
        setSelectedUnitOfMeasure('');
        onUnitOfMeasureChange?.(''); // ✅ Notify parent
      }

      onItemSelect?.(selected);
      onQuantityChange?.(selected.quantity);
      onRateChange?.(selected.rate);

      const amount = selected.quantity * selected.rate;
      onAmountChange?.(amount);
    } else {
      setSelectedItem(null);
      setQuantity(0);
      setRate(0);
      setSelectedUnitOfMeasure('');
      onUnitOfMeasureChange?.(''); // ✅ Notify parent
      onItemSelect?.(null);
      onQuantityChange?.(0);
      onRateChange?.(0);
      onAmountChange?.(0);
    }

    setOpen(false);
  };


  const handleQuantityChange = (value: string) => {
    const numericValue = Math.max(0, parseInt(value) || 0);
    setQuantity(numericValue);
    onQuantityChange?.(numericValue);

    if (selectedItem) {
      const updatedItem: PurchaseOrderProduct = {
        ...selectedItem,
        quantity: numericValue,
      };
      setSelectedItem(updatedItem);
      onItemSelect?.(updatedItem);
    }
  };

  const handleRateChange = (value: string) => {
    const numericValue = Math.max(0, parseFloat(value) || 0);
    setRate(numericValue);
    onRateChange?.(numericValue);

    if (selectedItem) {
      const updatedItem: PurchaseOrderProduct = {
        ...selectedItem,
        rate: numericValue,
      };
      setSelectedItem(updatedItem);
      onItemSelect?.(updatedItem);
    }
  };

  const handleUnitChange = (unitName: string) => {
    setSelectedUnitOfMeasure(unitName);

    if (selectedItem) {
      const updatedItem: PurchaseOrderProduct = {
        ...selectedItem,
        unitOfMeasure: unitName, // Set to selected string
      };

      setSelectedItem(updatedItem);
      onItemSelect?.(updatedItem);
      onUnitOfMeasureChange?.(unitName); // Notify parent
    }
  };


  const calculatedAmount = selectedItem ? quantity * selectedItem.rate : 0;

  return (
  <TableRow className="align-top">
    <TableCell>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Item</label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="min-w-[250px] justify-between border rounded-md p-2 text-sm"
            >
              {selectedItem ? selectedItem.itemRef.fullName : 'Select item...'}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 min-w-[250px]">
            <Command>
              <CommandInput
                className="h-9"
                value={search}
                onValueChange={handleSearch}
                placeholder="Search products..."
              />
              <CommandList>
                <CommandEmpty>No item found.</CommandEmpty>
                <CommandGroup>
                  {items.map((item) => (
                    <CommandItem
                      key={item.itemRef.fullName}
                      value={item.itemRef.fullName}
                      onSelect={handleSelect}
                    >
                      {item.itemRef.fullName}
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          selectedItem?.itemRef.fullName === item.itemRef.fullName
                            ? 'opacity-100'
                            : 'opacity-0'
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </TableCell>

    <TableCell>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Unit</label>
        {Array.isArray(selectedItem?.unitOfMeasure) && selectedItem.unitOfMeasure.length > 0 ? (
          <select
            className="text-sm border border-gray-300 rounded-md p-2 min-w-[100px]"
            value={selectedUnitOfMeasure}
            onChange={(e) => handleUnitChange(e.target.value)}
            disabled={!selectedItem}
          >
            {selectedItem.unitOfMeasure.map((unit, idx) => (
              <option key={idx} value={unit.fullName}>
                {unit.fullName}
              </option>
            ))}
          </select>
        ) : (
          <span className="text-sm text-gray-600">
            {typeof selectedItem?.unitOfMeasure === 'string' ? selectedItem.unitOfMeasure : '---'}
          </span>
        )}
      </div>
    </TableCell>

    <TableCell>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Quantity</label>
        <Input
          className="w-[100px] text-sm"
          value={quantity}
          disabled={!selectedItem}
          onChange={(e) => handleQuantityChange(e.target.value)}
          placeholder="0"
        />
      </div>
    </TableCell>

    <TableCell>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Rate</label>
        <Input
          className="w-[100px] text-sm"
          value={rate}
          disabled={!selectedItem}
          onChange={(e) => handleRateChange(e.target.value)}
          placeholder="0"
        />
      </div>
    </TableCell>

    <TableCell>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Amount</label>
        <span className="text-sm">{calculatedAmount.toFixed(2)}</span>
      </div>
    </TableCell>
  </TableRow>
);

};

export default POComboBox;
