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
// import { unitsOfMeasure } from './Bill';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WebService } from '@/web-services/WebService';

export type BillOrderProduct = {
  itemRef: {
    fullName: string;
  };
  inventorySiteRef: {
    fullName: string;
  };
  lotNumber: string;
  expiryDate: string;
  quantity: number;
  unitOfMeasure: string;
  cost: number;
  salesPrice: number;
};

interface BillComboBoxProps {
  data?: BillOrderProduct[];
  selectedItem?: BillOrderProduct | null;
  onItemSelect?: (item: BillOrderProduct | null) => void;
  onQuantityChange?: (quantity: number) => void;
  onLotNumberChange?: (lotNumber: string) => void;
  onExpiryDateChange?: (expiryDate: string) => void;
  onSalesPriceChange?: (salesPrice: number) => void;
  onUnitOfMeasureChange?: (unitOfMeasure: string) => void;
  onCostChange?: (cost: number) => void;
  // New prop to trigger clearing of selected item
  resetSelection?: boolean;
}

const BillComboBox: React.FC<BillComboBoxProps> = ({
  onItemSelect,
  onQuantityChange,
  onLotNumberChange,
  onExpiryDateChange,
  onSalesPriceChange,
  onUnitOfMeasureChange,
  onCostChange,
  resetSelection,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<BillOrderProduct | null>(null);
  const [search, setSearch] = useState('');
  const [items, setItems] = useState<BillOrderProduct[]>([]);
  const [quantity, setQuantity] = useState<number>(0);
  const [lotNumber, setLotNumber] = useState<string>('');
  const [expiryDate, setExpiryDate] = useState<string>('');
  const [salesPrice, setSalesPrice] = useState<number>(0);
  const [unitOfMeasure, setUnitOfMeasure] = useState<string>('');
  const [cost, setCost] = useState<number>(0);

  useEffect(() => {
    if (items.length === 0) {
      handleSearch('');
    }
  }, []);

  // Effect to reset form when resetSelection prop changes
  useEffect(() => {
    if (resetSelection) {
      // Reset all state values
      setSelectedItem(null);
      setQuantity(0);
      setLotNumber('');
      setExpiryDate('');
      setSalesPrice(0);
      setUnitOfMeasure('');
      setCost(0);
      setSearch('');
      setOpen(false);
    }
  }, [resetSelection]);

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

      const billProducts = searchProductResponse.map((product): BillOrderProduct => {
        return {
          quantity: quantity,
          cost: parseFloat(product.purchaseCost || '0'),
          salesPrice: parseFloat(product.salesPrice || '0'),
          lotNumber: lotNumber,
          expiryDate: expiryDate,
          unitOfMeasure: product.unitOfMeasureSetRef?.fullName || '',
          itemRef: {
            fullName: product.fullName || product.name || '',
          },
          inventorySiteRef: {
            fullName: '',
          },
        };
      });

      setItems(billProducts);
    } catch (error) {
      toast.error('Error fetching items');
    }
  };

  const handleSelect = (currentValue: string) => {
    const found = items.find((item) => {
      const itemName = item.itemRef.fullName;
      return itemName === currentValue;
    });

    if (found) {
      // Create a new object to avoid reference issues
      const selected: BillOrderProduct = {
        ...found,
        quantity: quantity || 1, // Default to 1 if quantity is 0
        lotNumber: lotNumber || '',
        expiryDate: expiryDate || '',
        salesPrice: salesPrice || found.salesPrice || 0,
        unitOfMeasure: unitOfMeasure || found.unitOfMeasure || '',
        cost: cost || found.cost || 0,
        // Ensure inventory site ref is included
        inventorySiteRef: {
          fullName: found.inventorySiteRef?.fullName || '',
        },
      };

      // Update local state
      setSelectedItem(selected);
      setQuantity(selected.quantity);
      setLotNumber(selected.lotNumber);
      setExpiryDate(selected.expiryDate);
      setSalesPrice(selected.salesPrice);
      setUnitOfMeasure(selected.unitOfMeasure);
      setCost(selected.cost);

      // Log the item being selected to help with debugging
      console.log('Selected item in BillComboBox:', selected);

      // Important: Notify parent component at the end, after all local state is updated
      // This is the only place where we call onItemSelect with a non-null value
      setTimeout(() => {
        onItemSelect?.(selected);
      }, 0);
    } else {
      // Only clear local state, not parent state
      setSelectedItem(null);
      setQuantity(0);
      setLotNumber('');
      setExpiryDate('');
      setSalesPrice(0);
      setUnitOfMeasure('');
      setCost(0);
    }

    setOpen(false);
  };

  const handleQuantityChange = (value: string) => {
    const numericValue = Math.max(0, parseInt(value) || 0);
    setQuantity(numericValue);
    onQuantityChange?.(numericValue);

    if (selectedItem) {
      const updatedItem: BillOrderProduct = {
        ...selectedItem,
        quantity: numericValue,
      };
      setSelectedItem(updatedItem);
      onItemSelect?.(updatedItem);
    }
  };

  const handleLotNumberChange = (value: string) => {
    setLotNumber(value);
    onLotNumberChange?.(value);

    if (selectedItem) {
      const updatedItem: BillOrderProduct = {
        ...selectedItem,
        lotNumber: value,
      };
      setSelectedItem(updatedItem);
      onItemSelect?.(updatedItem);
    }
  };

  const handleExpiryDateChange = (value: string) => {
    setExpiryDate(value);
    const timestamp = value || '';
    onExpiryDateChange?.(timestamp);

    if (selectedItem) {
      const updatedItem: BillOrderProduct = {
        ...selectedItem,
        expiryDate: timestamp,
      };
      setSelectedItem(updatedItem);
      onItemSelect?.(updatedItem);
    }
  };

  const handleSalesPriceChange = (value: string) => {
    const numericValue = Math.max(0, parseFloat(value) || 0);
    setSalesPrice(numericValue);
    onSalesPriceChange?.(numericValue);

    if (selectedItem) {
      const updatedItem: BillOrderProduct = {
        ...selectedItem,
        salesPrice: numericValue,
      };
      setSelectedItem(updatedItem);
      onItemSelect?.(updatedItem);
    }
  };

  const handleUnitOfMeasureChange = (value: string) => {
    setUnitOfMeasure(value);
    onUnitOfMeasureChange?.(value);

    if (selectedItem) {
      const updatedItem: BillOrderProduct = {
        ...selectedItem,
        unitOfMeasure: value,
      };
      setSelectedItem(updatedItem);
      onItemSelect?.(updatedItem);
    }
  };

  const handleCostChange = (value: string) => {
    const numericValue = Math.max(0, parseFloat(value) || 0);
    setCost(numericValue);
    onCostChange?.(numericValue);

    if (selectedItem) {
      const updatedItem: BillOrderProduct = {
        ...selectedItem,
        cost: numericValue,
      };
      setSelectedItem(updatedItem);
      onItemSelect?.(updatedItem);
    }
  };

  const calculatedAmount = selectedItem ? quantity * selectedItem.cost : 0;

  return (
    <TableRow>
      <TableCell className="pr-0">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="min-w-[250px] max-w-[280px] text-wrap justify-between border rounded-md py-2 px-1 text-xs"
            >
              {selectedItem ? selectedItem.itemRef.fullName : 'Select item...'}
              <ChevronsUpDown className=" h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 min-w-max">
            <Command>
              <CommandInput
                className="h-9 combobox-input"
                value={search}
                onValueChange={handleSearch}
                placeholder="Search products..."
              />
              <CommandList>
                <CommandEmpty>No item found.</CommandEmpty>
                <CommandGroup>
                  {items.map((item) => {
                    console.log('Rendering item:', item);

                    return (
                      <CommandItem
                        key={item.itemRef.fullName}
                        value={item.itemRef.fullName}
                        onSelect={handleSelect}
                      >
                        {/* Log inside JSX */}
                        {(() => {
                          console.log('item fullName:', item.itemRef.fullName);
                          return item.itemRef.fullName;
                        })()}

                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            selectedItem?.itemRef.fullName === item.itemRef.fullName ? 'opacity-100' : 'opacity-0',
                          )}
                        />
                      </CommandItem>
                    );
                  })}
                </CommandGroup>

              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </TableCell>
      <TableCell>
        <span className="w-[150px]">{selectedItem?.unitOfMeasure || '---'}</span>
        {/* <Select value={unitOfMeasure} onValueChange={handleUnitOfMeasureChange} disabled={!selectedItem}>
          <SelectTrigger className="w-[100px] text-xs">
            <SelectValue placeholder="Add unit..." />
          </SelectTrigger>
          <SelectContent>
            {unitsOfMeasure.map((unit) => (
              <SelectItem key={unit} value={unit}>
                {unit}
              </SelectItem>
            ))}
          </SelectContent>
        </Select> */}
      </TableCell>
      <TableCell className="text-center px-0">
        <span className="w-[50px]">{selectedItem?.quantity || '---'}</span>
      </TableCell>
      <TableCell>
        <Input
          className="w-[100px] text-xs"
          value={cost}
          disabled={!selectedItem}
          onChange={(e) => handleCostChange(e.target.value)}
          placeholder="0.00"
          type='number'
          min={1}
        />
      </TableCell>
      <TableCell className="text-left">{calculatedAmount.toFixed(2)}</TableCell>
      <TableCell className="pl-0">
        <Input
          className="w-[80px] text-xs"
          value={quantity}
          disabled={!selectedItem}
          onChange={(e) => handleQuantityChange(e.target.value)}
          placeholder="0"
          type='number'
          min={1}
        />
      </TableCell>
       <TableCell>
        <Input
          type='number'
          min={1}
          className="w-[130px] text-xs"
          value={salesPrice}
          disabled={!selectedItem}
          onChange={(e) => handleSalesPriceChange(e.target.value)}
          placeholder="Sales Price"
        />
      </TableCell>
       {/* <TableCell>
        <Input
          type='number'
          min={1}
          className="w-[130px] text-xs"
          value={salesPrice}
          disabled={!selectedItem}
          // onChange={(e) => handleSalesPriceChange(e.target.value)}
          placeholder="Uni Price"
        />
      </TableCell> */}
      <TableCell className="pl-0">
        <Input
          type="text"
          className="w-[130px] text-xs"
          value={lotNumber}
          disabled={!selectedItem}
          onChange={(e) => handleLotNumberChange(e.target.value)}
          placeholder="LOT Number"
        />
      </TableCell>
      <TableCell>
        <Input
          type="date"
          className="w-[120px] text-xs"
          value={expiryDate}
          disabled={!selectedItem}
          onChange={(e) => handleExpiryDateChange(e.target.value)}
        />
      </TableCell>
    </TableRow>
  );
};

export default BillComboBox;
