import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import Tesseract from 'tesseract.js';
import { Check, ChevronsUpDown } from 'lucide-react';
import {
  TableCell,
  TableRow,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Button,
} from '@/components';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { RequestOrderItem, Site } from '@/utils/types';
import { useSearchItemsQuery } from '@/utils/useSearchItemsQuery';
import { useItemStockQuery } from '@/utils/useItemStockQuery';

export interface ROComboBoxHandle {
  getSelectedItem: () => RequestOrderItem | null;
  reset: () => void;
}

interface ROComboBoxProps {
  resetFields?: boolean;
  onItemSelect?: (item: RequestOrderItem | null) => void;
}

const ROComboBox = forwardRef<ROComboBoxHandle, ROComboBoxProps>(
  ({ resetFields, onItemSelect }, ref) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [items, setItems] = useState<RequestOrderItem[]>([]);
    const [selectedItem, setSelectedItem] = useState<RequestOrderItem | null>(null);
    const [orderQuantity, setOrderQuantity] = useState('');
    const [selectedUnit, setSelectedUnit] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [ocrText, setOcrText] = useState('');
    const [isScanning, setIsScanning] = useState(false);

    const searchItems = useSearchItemsQuery();

    const { data: itemStockData } = useItemStockQuery({
      itemName: selectedItem?.fullName || '',
      enabled: !!selectedItem?.fullName,
    });

    useEffect(() => {
      if (selectedItem && itemStockData?.sites) {
        const updated = { ...selectedItem, sites: itemStockData.sites };
        setSelectedItem(updated);
        onItemSelect?.(updated);
      }
    }, [itemStockData]);

    const handleSearch = (query: string) => {
      setSearch(query);
      if (!query.trim()) return setItems([]);

      searchItems.mutate(query, {
        onSuccess: (data) => {
          setItems(data?.message || []);
        },
        onError: () => {
          toast.error('Failed to search items.');
        },
      });
    };

    const handleSelect = (itemName: string) => {
      const item = items.find((i) => i.fullName === itemName);
      if (!item) {
        toast.error('Item not found.');
        setSelectedItem(null);
        setOpen(false);
        return;
      }

      const defaultUnit = item.unitsOfMeasure?.[0]?.fullName || '';
      setSelectedUnit(defaultUnit); // 💡 Ensure selectedUnit state updates

      const selectedItemData: RequestOrderItem = {
        ...item,
        quantityOrdered: 0,
        selectedUnit: defaultUnit,
      };

      console.log('🔍 Selected Item:', selectedItemData);


      setSelectedItem(selectedItemData);
      setOpen(false);
      onItemSelect?.(selectedItemData);
    };

    const handleOrderChange = (value: string) => {
      setOrderQuantity(value);
      const quantity = parseInt(value);
      if (!selectedItem || isNaN(quantity) || quantity <= 0) return;

      const updatedItem = { ...selectedItem, quantityOrdered: quantity, selectedUnit };
      setSelectedItem(updatedItem);
      onItemSelect?.(updatedItem);
    };

    useEffect(() => {
      if (resetFields) {
        setSelectedItem(null);
        setOrderQuantity('');
        setSearch('');
        setItems([]);
        setSelectedUnit('');
      }
    }, [resetFields]);

    useEffect(() => {
      if (selectedItem?.unitsOfMeasure?.length > 0) {
        const valid = selectedItem.unitsOfMeasure.find(
          (u) => u.fullName === selectedUnit
        );
        setSelectedUnit(valid ? selectedUnit : selectedItem.unitsOfMeasure[0].fullName);
      } else {
        setSelectedUnit('');
      }
    }, [selectedItem]);

    useEffect(() => {
      if (selectedItem && orderQuantity && selectedUnit) {
        const updatedItem = {
          ...selectedItem,
          quantityOrdered: Number(orderQuantity),
          selectedUnit,
        };
        onItemSelect?.(updatedItem);
      }
    }, [selectedItem, orderQuantity, selectedUnit]);

    useImperativeHandle(ref, () => ({
      getSelectedItem: () => {
        if (!selectedItem || !orderQuantity || !selectedUnit) return null;
        return {
          ...selectedItem,
          quantityOrdered: parseInt(orderQuantity),
          selectedUnit,
        };
      },
      reset: () => {
        setSelectedItem(null);
        setOrderQuantity('');
        setSelectedUnit('');
      },
    }));

    const handleScanImage = async () => {
      if (!imageFile) return;
      setIsScanning(true);

      try {
        const result = await Tesseract.recognize(imageFile, 'eng');
        const text = result.data.text.trim();

        if (!text) {
          toast.info('No text found in image.');
          return;
        }

        setSearch(text);
        handleSearch(text);
        toast.success(`Extracted: ${text}`);
        setOcrText(text);
      } catch (error) {
        toast.error('Image scan failed.');
      } finally {
        setIsScanning(false);
      }
    };

    return (
      <TableRow className="group relative flex flex-col md:table-row w-full border md:border-0">

        {/* Item Selector */}
        <TableCell className="md:table-cell">
          <span className="font-semibold block md:hidden">Item:</span>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-[200px] lg:w-[450px] justify-between text-wrap text-left border rounded-md p-2 text-xs"
              >
                {selectedItem ? selectedItem.fullName : '🔍 Search and select item...'}
                <ChevronsUpDown size={16} className="opacity-50 ml-2" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-full max-w-xl">
              <Command>
                <CommandInput
                  placeholder="Type to search product name..."
                  className="h-9"
                  value={search}
                  onValueChange={handleSearch}
                />
                <CommandList>
                  <CommandEmpty>No items found.</CommandEmpty>
                  <CommandGroup>
                    {items.map((item, index) => {
                      const isSelected = selectedItem?.listID === item.listID;
                      return (
                        <CommandItem
                          key={item.listID}
                          value={item.fullName}
                          onSelect={() => handleSelect(item.fullName)}
                          className={cn(
                            'flex justify-between items-start gap-2 px-3 py-2 text-sm',
                            isSelected && 'bg-green-100 border-l-4 border-green-500',
                            index < items.length - 1 && 'border-b border-gray-200'
                          )}
                        >
                          <div className="flex-1 text-left break-words leading-snug">
                            {item.fullName}
                          </div>
                          <Check className={cn('h-4 w-4 text-green-500', isSelected ? 'opacity-100' : 'opacity-0')} />
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </TableCell>

        {/* Available Quantities */}
        <TableCell className="md:table-cell text-center">
          <span className="font-semibold block md:hidden">In stock:</span>
          {selectedItem?.sites?.length
            ? selectedItem.sites.map((site: Site, index: number) => (
              <div key={index}>{site.quantityOnsite ?? '----'}</div>
            ))
            : 0}
        </TableCell>

        {/* Quantity Input */}
        <TableCell className="md:table-cell text-left">
          <span className="font-semibold block md:hidden">Quantity:</span>
          <input
            type="number"
            min={1}
            disabled={!selectedItem}
            value={orderQuantity}
            placeholder="e.g. 10"
            title={!selectedItem ? 'Select an item first' : ''}
            onChange={(e) => handleOrderChange(e.target.value)}
            className="w-[95px] px-2 py-1 border border-gray-300 rounded text-left"
          />
        </TableCell>

        {/* Unit Dropdown */}
        <TableCell className="md:table-cell text-left">
          <span className="font-semibold block md:hidden">Unit:</span>
          {selectedItem?.unitsOfMeasure?.length ? (
            <select
              className="border rounded p-1 text-sm"
              value={selectedUnit}
              disabled={!selectedItem}
              title={!selectedItem ? 'Select an item first' : ''}
              onChange={(e) => {
                const newUnit = e.target.value;
                console.log('Unit selected:', newUnit);
                setSelectedUnit(newUnit);

                if (!selectedItem) return;

                const updatedItem = {
                  ...selectedItem,
                  quantityOrdered: Number(orderQuantity),
                  selectedUnit: newUnit,
                };
                setSelectedItem(updatedItem);
                onItemSelect?.(updatedItem);
              }}
            >
              {selectedItem.unitsOfMeasure.map((unit) => (
                <option key={unit.fullName} value={unit.fullName}>
                  {unit.fullName} ({unit.quantity})
                </option>
              ))}
            </select>
          ) : (
            <span>---</span>
          )}
        </TableCell>
      </TableRow>
    );
  },
);

export default ROComboBox;
