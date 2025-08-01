import React, { useEffect, useState } from 'react';
import { ChevronsUpDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

import {
  TableRow,
  TableCell,
  PopoverTrigger,
  Button,
  Popover,
  PopoverContent,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Input,
  Loader,
} from '@/components';
import { toast } from 'sonner';
import { formatTimestamp } from '@/utils/formatter';
import { useAppSelector } from '@/store/hooks';
import { RootState } from '@/store/store';
import { WebService } from '@/web-services/WebService';

type SiteInfo = {
  siteName: string;
  siteId: string;
  quantityOnsite?: number;
};

export interface Batch {
  batchNo: string;
  expiryDate: number;
  rate: number;
  description: string;
  quantity: number;
}

export type InventoryProduct = {
  request?: string;
  batchNo: string;
  itemName: string;
  itemId: string;
  unitOfMeasure: string;
  sites: SiteInfo[];
  expiryDate: number;
  overallQuantity: number;
  description: string;
  timeStamp: number;
  rate: number;
  salesPrice: number;
  unisOfMeasure: UnitOfMeasure[];
  batches: Batch[];
  filterBy: string | null;
  page: any | null;
};

interface SRComboBoxProps {
  selectedItem: InventoryProduct | null;
  onItemSelect: (item: InventoryProduct | null) => void;
  onQuantitySoldChange: (quantity: number) => void;
  onUnitofMeasure?: (unit: string) => void;
  onUnitPriceChange?: (unitPrice: number) => void;
}

type UnitOfMeasure = {
  sublevel: number;
  fullName: string;
  quantity: number;
};

const SRComboBox: React.FC<SRComboBoxProps> = ({
  selectedItem: externalSelectedItem,
  onItemSelect,
  onQuantitySoldChange,
  onUnitofMeasure,
  onUnitPriceChange,
}) => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<InventoryProduct[]>([]);
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<InventoryProduct | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [selectedSite, setSelectedSite] = useState<SiteInfo | null>(null);
  const [quantitySold, setQuantitySold] = useState<number>(0);
  const [unitPrice, setUnitPrice] = useState<number>(0);
  const [quantityError, setQuantityError] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const sites = useAppSelector((state: RootState) => state.bill?.sites || []);
  const userStation = useAppSelector((state: RootState) => state.auth?.user?.station[0]);
  // const [selectedItemUnit, setSelectedItem] = useState<any>(null);

  const siteName = localStorage.getItem('facilityName') || '';
  const siteId = localStorage.getItem('adsStation') || '';

  useEffect(() => {
    if (items.length === 0) {
      handleSearch('');
    }
  }, []);

  useEffect(() => {
    if (externalSelectedItem === null && selectedItem !== null) {
      // Reset all form state when the external selection is cleared
      setSelectedItem(null);
      setSelectedBatch(null);
      setQuantitySold(0);
      setUnitPrice(0);
      setQuantityError('');
      setSelectedSite(null);
      setSearch('');
      setOpen(false);

      // Clear cached search results to ensure fresh data on next search
      setItems([]);
      setIsSearching(false);
    } else if (externalSelectedItem !== null && externalSelectedItem !== selectedItem) {
      setSelectedItem(externalSelectedItem);
    }
  }, [externalSelectedItem]);

  const handleSearch = async (query: string) => {
    setSearch(query);
    if (!query.trim()) return setItems([]);

    try {
      setIsSearching(true);
      const data = {
        request: 'I_SEARCH',
        filterBy: 'itemName',
        itemName: query,
        sites: [
          {
            siteName: siteName,
            siteId: siteId,
          },
        ],
      };
      console.log('Search data:', data);

      const response = await WebService.postPharma('inventory', data);
      if (!response || !response.message) {
        setItems([]);
        setIsSearching(false);
        return;
      }

      const searchProductResponse = response?.message as unknown as InventoryProduct[];
      console.log('Search results:', searchProductResponse);

      setItems(searchProductResponse);
      // setIsSearching(false);
    } catch (error) {
      toast.error('Error fetching items');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelect = (currentValue: string) => {
    const found = items.find((item) => {
      const itemName = item.itemName;
      return itemName === currentValue;
    });

    if (found) {
      // Get the quantity from clinicPesa HQ site
      const adsSite = found.sites.find((site) => site.siteName === siteName);
      setSelectedSite(adsSite);
      // const quantityOnsite = adsSite?.quantityOnsite || 0;

      if (found.batches && found.batches.length > 0) {
        const sortedBatches = [...found.batches].sort((a, b) => a.expiryDate - b.expiryDate);
        const closestBatch = sortedBatches[0];
        setSelectedBatch(closestBatch);
        setUnitPrice(closestBatch.rate);
      }

      const selected: InventoryProduct = {
        ...found,
      };
      console.log('Selected item:', selected);
      // console.log('Quantity on site:', quantityOnsite);
      setSelectedItem(selected);
      onItemSelect(selected);
      // console.log('Setting selected item:', selected);
    } else {
      setSelectedItem(null);
      setSelectedBatch(null);
      setQuantitySold(0);
      setUnitPrice(0);
      setQuantityError('');
      setSelectedSite(null);
      onItemSelect(null);
    }
    setOpen(false);
  };

  const handleQuantitySoldChange = (value: string) => {
    const qty = parseFloat(value) || 0;
    setQuantitySold(qty);
    if (onQuantitySoldChange) {
      onQuantitySoldChange(qty);
    }

    // Validate quantity against shelf quantity
    if (selectedSite && qty > (selectedSite.quantityOnsite || 0)) {
      setQuantityError(`Value can't exceed quantity on shelf  (${selectedSite.quantityOnsite})`);
    } else {
      setQuantityError('');
    }
  };

  const handleUnitChange = (value: string) => {
    setSelectedItem((prev) => {
      if (!prev) return prev;

      const updatedItem = {
        ...prev,
        unitOfMeasure: value,
      };

      onItemSelect(updatedItem); // ✅ Pass updated item to parent
      return updatedItem;
    });

    if (onUnitofMeasure) {
      onUnitofMeasure(value); // Optional: if you want just the unit string
    }
  };


  const handleUnitPriceChange = (value: string) => {
    const price = parseFloat(value) || 0;
    setUnitPrice(price);
    if (onUnitPriceChange) {
      onUnitPriceChange(price);
    }
  };

  return (
    <TableRow className="grid lg:table-row w-full border border-red-300">
      {/* Item selection */}
      <TableCell className="w-full lg:w-auto p-2">
        <div className="flex flex-col lg:flex-row lg:items-center gap-1 min-w-0">
          <span className="block lg:hidden font-semibold text-xs">Item:</span>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full lg:max-w-[250px] text-left border rounded-md p-2 text-xs flex justify-between items-center"
              >
                <span className="truncate flex-1">
                  {selectedItem ? selectedItem.itemName : 'Add item...'}
                </span>
                <ChevronsUpDown size={16} className="opacity-50 ml-2" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-full max-w-md sm:max-w-lg md:max-w-xl">
              <Command>
                <CommandInput
                  value={search}
                  onValueChange={handleSearch}
                  placeholder="Search products..."
                  className="h-9"
                />
                <CommandList>
                  <CommandEmpty>
                    {isSearching ? (
                      <div className="flex items-center justify-center w-full py-4">
                        <Loader size={16} />
                      </div>
                    ) : (
                      'No item found.'
                    )}
                  </CommandEmpty>
                  <CommandGroup>
                    {items.map((item, index) => {
                      const quantity = item.sites?.find((site) => site.siteId === siteId)?.quantityOnsite || 0;
                      const isLast = index === items.length - 1;

                      return (
                        <CommandItem
                          key={item.itemId}
                          value={item.itemName}
                          onSelect={handleSelect}
                          className={cn(
                            "flex justify-between items-start gap-2 px-3 py-2 text-sm",
                            !isLast && "border-b border-gray-200"
                          )}
                        >
                          {/* Left: Item Name (wraps if too long) */}
                          <div className="flex-1 text-left text-sm break-words leading-snug">
                            {item.itemName}
                          </div>

                          {/* Right: Quantity and Check Icon */}
                          <div className="flex items-center gap-2 text-xs text-gray-500 whitespace-nowrap">
                            <span>QTY: {quantity}</span>
                            <Check
                              className={cn(
                                'h-4 w-4 text-green-500',
                                selectedItem?.itemId === item.itemId ? 'opacity-100' : 'opacity-0'
                              )}
                            />
                          </div>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </TableCell>

      {/* Quantity Sold */}
      <TableCell className="w-full lg:w-auto p-2">
        <div className="flex flex-col lg:flex-row lg:items-center gap-1">
          <span className="block lg:hidden font-bold text-sm">Quantity Sold:</span>
          <Input
            className="w-full lg:w-[150px] text-xs"
            value={quantitySold}
            disabled={!selectedItem}
            onChange={(e) => handleQuantitySoldChange(e.target.value)}
            placeholder="0"
          />
        </div>
        {quantityError && <p className="text-red-500 text-xs mt-1">{quantityError}</p>}
      </TableCell>

      {/* Unit Price */}
      <TableCell className="w-full lg:w-auto p-2">
        <div className="flex flex-col lg:flex-row lg:items-center gap-1">
          <span className="block lg:hidden font-bold text-sm">Unit Price:</span>
          {/* <Input
            className="w-full lg:-w-[250px] text-xs"
            defaultValue={selectedItem?.salesPrice}
            value={unitPrice}
            disabled={!selectedItem}
            onChange={(e) => handleUnitPriceChange(e.target.value)}
            placeholder="0"
          /> */}
          {selectedItem?.salesPrice}
        </div>
      </TableCell>

      {/* Unit of Measure */}
      {/* <TableCell className="w-full lg:w-auto p-2">
        <div className="flex flex-col lg:flex-row lg:items-center gap-1">
          <select
            value={selectedItem?.unitOfMeasure}
            onChange={(e) => handleUnitChange(e.target.value)}
            className="border px-2 py-1 rounded text-sm"
          >
            {selectedItem?.unisOfMeasure?.map((unit) => (
              <option key={unit.sublevel} value={unit.fullName}>
                {unit.fullName} ({unit.quantity})
              </option>
            )) || <option value="">---</option>}
          </select>
        </div>
      </TableCell> */}
      <TableCell className="w-full lg:w-auto p-2">
        <div className="flex flex-col lg:flex-row lg:items-center gap-1 text-sm">
          <span className="block lg:hidden font-bold text-sm">Unit of Measure:</span>
          {selectedItem?.unisOfMeasure?.find((u) => u.sublevel === 0)?.fullName || '---'}
        </div>
      </TableCell>


      {/* Quantity Onsite */}
      <TableCell className="w-full lg:w-auto p-2 text-center">
        <div className="flex flex-col lg:flex-row lg:items-center gap-1">
          <span className="block lg:hidden font-bold text-sm">Quantity Onsite:</span>
          {selectedSite ? selectedSite.quantityOnsite : '---'}
        </div>
      </TableCell>

      {/* Batch Number */}
      <TableCell className="w-full lg:w-auto p-2">
        <div className="flex flex-col lg:flex-row lg:items-center gap-1">
          <span className="block lg:hidden font-bold text-sm">Batch:</span>
          {selectedBatch ? selectedBatch.batchNo : '---'}
        </div>
      </TableCell>

      {/* Expiry Date */}
      <TableCell className="w-full lg:w-auto p-2">
        <div className="flex flex-col lg:flex-row lg:items-center gap-1 text-nowrap">
          <span className="block lg:hidden font-bold text-sm">Expiry Date:</span>
          {selectedBatch ? formatTimestamp(selectedBatch.expiryDate) : '---'}
        </div>
      </TableCell>
    </TableRow>

  );
};

export default SRComboBox;
