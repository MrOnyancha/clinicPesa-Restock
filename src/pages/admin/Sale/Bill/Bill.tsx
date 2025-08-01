import React, { useEffect, useMemo, useState } from 'react';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  Input,
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Pagination,
} from '@/components';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchVendorsList, Vendor } from '../PurchaseOrder/purchaseOrderSlice';
import { fetchBills, fetchPurchaseOrders, PurchaseOrder } from './billSlice';
import { Button } from '@/components/ui/button';
import { RootState } from '@/store/store';
import Loader from '@/components/Loader/Loader';
import { formatTimestamp, formatCurrency } from '@/utils/formatter';
import VendorComboBox from '../PurchaseOrder/VendorComboBox';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';
import BillComboBox, { BillOrderProduct } from './BillComboBox';
import { RefreshCw, Trash2 } from 'lucide-react';
import { selectUserProfile } from '@/pages/auth/authSlice';
import { WebService } from '@/web-services/WebService';
import * as XLSX from 'xlsx';
import { ColumnDef, getCoreRowModel, getPaginationRowModel, useReactTable, flexRender } from '@tanstack/react-table';

interface LineItemData {
  quantity: number;
  lotNumber: string;
  expiryDate: string;
  salesPrice: number;
  unitOfMeasure: string;
  unitOfMeasureId?: []; // Optional, if you want to track the ID
  rate: number;
}

interface LineItemErrors {
  quantity?: string;
  lotNumber?: string;
  expiryDate?: string;
  salesPrice?: string;
  unitOfMeasure?: string;
  rate?: string;
}

// export const unitsOfMeasure: string[] = [
//   'Bottle',
//   'Capsule',
//   'Dose',
//   'Packet',
//   'Pair',
//   'Piece',
//   'Sachet',
//   'Strip',
//   'Tablets',
//   'Tin',
//   'Tube',
// ];

const Bill: React.FC = () => {
  // Store line item data in a Map with the txnLineID as key
  const [lineItemsData, setLineItemsData] = React.useState<Map<string, LineItemData>>(new Map());
  const [lineItemErrors, setLineItemErrors] = React.useState<Map<string, LineItemErrors>>(new Map());
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = React.useState<string | null>(null);
  // Store which items are checked for inclusion in the bill
  const [checkedItems, setCheckedItems] = React.useState<Map<string, boolean>>(new Map());
  // New state for manually added items
  const [manualItems, setManualItems] = React.useState<BillOrderProduct[]>([]);
  const [currentManualItem, setCurrentManualItem] = React.useState<BillOrderProduct | null>(null);
  const [selectedVendor, setSelectedVendor] = React.useState<string>('');
  const [manualItemErrors, setManualItemErrors] = React.useState<{
    quantity?: string;
    lotNumber?: string;
    expiryDate?: string;
    salesPrice?: string;
    unitOfMeasure?: string;
    cost?: string;
  }>({});
  // State to track whether BillComboBox should reset
  const [resetComboBox, setResetComboBox] = React.useState(false);

  const dispatch = useAppDispatch();
  const vendors = useAppSelector((state: RootState) => state.purchaseOrder.vendors);
  const vendorNames = vendors.map((vendor: Vendor) => vendor.name);
  const purchaseOrders = useAppSelector((state: RootState) => state.bill?.purchaseOrders || []);
  const isLoadingPurchaseOrders = useAppSelector((state: RootState) => state.bill?.isLoading || false);
  const sites = useAppSelector((state: RootState) => state.bill?.sites || []);
  const siteNames = sites.map((site) => site.name);
  const bills = useAppSelector((state: RootState) => state.bill?.bills || []);
  const isBillsLoading = useAppSelector((state: RootState) => state.bill.isBillsLoading || false);
  const userProfile = useAppSelector(selectUserProfile);
  const phoneNumber = localStorage.getItem('account_id') || '';
  const dispenserName = localStorage.getItem('firstName') || '';
  // const userRole = localStorage.getItem('adsRole') || 'DISPENSER';
  // If you need these variables, define them inside the map callback where 'order' is available.


  React.useEffect(() => {
    dispatch(fetchVendorsList());
    dispatch(fetchPurchaseOrders());

    // Initial bills fetch with P_ALL filter
    dispatch(fetchBills({ filterBy: 'P_ALL' }));
  }, [dispatch]);

  React.useEffect(() => {
    if (selectedVendor) {
      dispatch(fetchBills({ vendorName: selectedVendor, filterBy: 'VENDOR' }));
    }
  }, [selectedVendor, dispatch]);

  const formSchema = z.object({
    vendor: z.string().min(1, { message: 'Vendor is required' }),
    // site: z.string().min(1, { message: 'Class is required' }),
    invoiceNo: z.string().min(1, { message: 'Invoice No. is required' }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vendor: '',
      // site: '',
      invoiceNo: '',
    },
  });

  // Generic function to handle all input changes for line items
  const handleLineItemChange = <K extends keyof LineItemData>(field: K, value: LineItemData[K], lineItemId: string) => {
    setLineItemsData((prevData) => {
      const newData = new Map(prevData);
      const currentData = newData.get(lineItemId) || {
        quantity: 0,
        lotNumber: '',
        expiryDate: '',
        salesPrice: 0,
        unitOfMeasure: '',
        rate: 0,
      };
      newData.set(lineItemId, { ...currentData, [field]: value });
      return newData;
    });

    // Clear errors for this field when changed
    setLineItemErrors((prevErrors) => {
      const newErrors = new Map(prevErrors);
      const currentErrors = newErrors.get(lineItemId) || {};
      if (currentErrors[field as keyof LineItemErrors]) {
        const { [field as keyof LineItemErrors]: _, ...rest } = currentErrors;
        newErrors.set(lineItemId, rest);
      }
      return newErrors;
    });
  };

  // Handle checkbox changes for item selection
  const handleCheckItem = (lineItemId: string, checked: boolean) => {
    setCheckedItems((prev) => {
      const newChecked = new Map(prev);
      newChecked.set(lineItemId, checked);
      return newChecked;
    });

    // If checking the item, initialize the line item data with defaults
    if (checked) {
      const order = purchaseOrders.find((order) =>
        order.purchaseOrderLineRet.some((item) => item.txnLineID === lineItemId),
      );

      if (order) {
        const item = order.purchaseOrderLineRet.find((item) => item.txnLineID === lineItemId);
        if (item) {
          setLineItemsData((prev) => {
            const newData = new Map(prev);
            const currentData = newData.get(lineItemId) || {
              quantity: 0,
              lotNumber: '',
              expiryDate: '',
              salesPrice: 0,
              rate: 0,
            };

            console.log('Initializing line item data for:', lineItemId, item);

            // Initialize with values from the purchase order item
            newData.set(lineItemId, {
              ...currentData,
              unitOfMeasure: item.unitOfMeasure,
              rate: parseFloat(item.rate) || 0,
            });
            return newData;
          });
        }
      }
    }

    // If unchecking, clear any errors for this item
    if (!checked) {
      setLineItemErrors((prev) => {
        const newErrors = new Map(prev);
        newErrors.delete(lineItemId);
        return newErrors;
      });
    }
  };

  const handleSelectAllForOrder = (order: PurchaseOrder, checked: boolean) => {
    const items = order.purchaseOrderLineRet || [];
    items.forEach(item => {
      handleCheckItem(item.txnLineID, checked);
    });
  };



  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    let loadingToast: string | number = '';

    try {
      // Prevent double submission
      if (isSubmitting) return;
      setIsSubmitting(true);
      // Validate required data
      if (!selectedOrder) {
        toast.error('Please select a purchase order.');
        setIsSubmitting(false);
        return;
      }

      // Find the selected purchase order
      const selectedPurchaseOrder = purchaseOrders.find((order) => order.txnID === selectedOrder);
      if (!selectedPurchaseOrder) {
        toast.error('Selected purchase order not found.');
        setIsSubmitting(false);
        return;
      }

      // Get all items that are checked
      const checkedItemIds = Array.from(checkedItems.entries())
        .filter(([_, checked]) => checked)
        .map(([id, _]) => id);

      if (checkedItemIds.length === 0 && manualItems.length === 0) {
        toast.error('Please select at least one item to add to the bill.');
        setIsSubmitting(false);
        return;
      }

      // Collect all items from purchase orders that are checked
      const itemsToSubmit: any[] = [];

      selectedPurchaseOrder.purchaseOrderLineRet.forEach((item) => {
        if (checkedItems.get(item.txnLineID)) {
          itemsToSubmit.push(item);
        }
      });

      // Validate all selected items have required data
      let hasErrors = false;
      itemsToSubmit.forEach((item) => {
        const lineData = lineItemsData.get(item.txnLineID);
        const errors: LineItemErrors = {};

        // Check if we have data for this item
        if (!lineData) {
          errors.quantity = 'Quantity is required';
          errors.lotNumber = 'Lot number is required';
          errors.expiryDate = 'Expiry date is required';
          errors.salesPrice = 'Sales price is required';
          errors.unitOfMeasure = 'Unit of measure is required';
          errors.rate = 'Rate is required';
          hasErrors = true;
        } else {
          // Validate quantity
          if (!lineData.quantity || lineData.quantity <= 0) {
            errors.quantity = 'Quantity must be greater than 0';
            hasErrors = true;
          }

          // Validate lot number
          if (!lineData.lotNumber || lineData.lotNumber.toString().trim() === '') {
            errors.lotNumber = 'Lot number is required';
            hasErrors = true;
          }

          // Validate expiry date
          if (!lineData.expiryDate || lineData.expiryDate.trim() === '') {
            errors.expiryDate = 'Expiry date is required';
            hasErrors = true;
          }

          // // Validate sales price
          if (!lineData.salesPrice || lineData.salesPrice <= 0) {
            errors.salesPrice = 'Sales price must be greater than 0';
            hasErrors = true;
          }

          // Validate unit of measure
          if (!lineData.unitOfMeasure || lineData.unitOfMeasure.trim() === '') {
            errors.unitOfMeasure = 'Unit of measure is required';
            hasErrors = true;
          }

          // Validate rate
          if (!lineData.rate || lineData.rate <= 0) {
            errors.rate = 'Rate must be greater than 0';
            hasErrors = true;
          }
        }

        if (Object.keys(errors).length > 0) {
          setLineItemErrors((prev) => {
            const newErrors = new Map(prev);
            newErrors.set(item.txnLineID, errors);
            return newErrors;
          });
        }
      });

      if (hasErrors) {
        toast.error('Please fix the errors in the form before submitting.');
        setIsSubmitting(false);
        return;
      }

      // Prepare the line items in the required format
      const lineItems = itemsToSubmit.map((item) => {
        const lineData = lineItemsData.get(item.txnLineID)!; // We already validated this exists

        // Convert date string to timestamp if exists
        let expiryTimestamp = 0;
        if (lineData.expiryDate) {
          expiryTimestamp = new Date(lineData.expiryDate).getTime();
        }

        console.log('Line Item Data:', item);

        return {
          itemRef: {
            fullName: item.itemRef.fullName,
          },
          inventorySiteRef: {
            fullName: 'clinicPesa HQ',
          },
          lotNumber: lineData.lotNumber,
          expiryDate: expiryTimestamp,
          quantity: lineData.quantity,
          unitOfMeasure: lineData.unitOfMeasure || item.unitOfMeasure,
          cost: lineData.rate || parseFloat(item.rate),
          salesPrice: lineData.salesPrice,
        };
      });

      // Add manually entered items
      const manualLineItems = manualItems.map((item) => {
        // Convert date string to timestamp if exists
        let expiryTimestamp = 0;
        if (item.expiryDate) {
          expiryTimestamp = new Date(item.expiryDate).getTime();
        }

        return {
          itemRef: {
            fullName: item.itemRef.fullName,
          },
          inventorySiteRef: {
            fullName: 'clinicPesa HQ',
          },
          lotNumber: item.lotNumber,
          expiryDate: expiryTimestamp,
          quantity: item.quantity,
          unitOfMeasure: item.unitOfMeasure,
          cost: item.cost,
          salesPrice: item.salesPrice,
        };
      });

      // Combine both types of items
      const allLineItems = [...lineItems, ...manualLineItems];

      // Construct the request body according to the specified format
      const requestBody = {
        request: 'CREATE_BILL',
        dispenser: {
          name: dispenserName,
          accountId: phoneNumber,
        },
        purchaseOrderId: selectedPurchaseOrder.txnID,
        invoiceNo: data.invoiceNo,
        billAddRq: {
          billAdd: {
            vendorRef: {
              fullName: data.vendor,
            },
            itemLineAdd: allLineItems,
          },
        },
      };

      // Show loading toast now that everything has been validated
      loadingToast = toast.loading('Creating bill...');
      console.log('Bill Request Body: ', requestBody);
      // Make the API request
      const response = await WebService.postPharma('bills', requestBody);
      console.log('Bill Request Body: ', requestBody);

      // Handle the response
      if (response && response.status) {
        toast.success('Bill created successfully!');

        // Reset form and state
        form.reset();
        setLineItemsData(new Map());
        setSelectedOrder(null);
        setCheckedItems(new Map());
        setManualItems([]);
        setCurrentManualItem(null);

        // Refresh purchase orders list
        dispatch(fetchPurchaseOrders());
      } else {
        const errorMessage = response?.message || 'Failed to create bill';
        toast.error(errorMessage);
      }

      // For demo, always show success
      toast.success('Bill created successfully!');
      toast.dismiss(loadingToast);
    } catch (error) {
      console.error('Error creating bill:', error);
      toast.error('Failed to create bill. Please try again.');

      // Dismiss loading toast if it exists
      if (typeof loadingToast === 'number' || typeof loadingToast === 'string') {
        toast.dismiss(loadingToast);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuantityChange = (value: string, lineItemId: string) => {
    const numericValue = parseInt(value, 10);
    // Optional: Prevent setting invalid values like negative or zero here
    if (isNaN(numericValue) || numericValue <= 0) {
      handleLineItemChange('quantity', 0, lineItemId); // or don't update
    } else {
      handleLineItemChange('quantity', numericValue, lineItemId);
    }
  };

  const handleSalesPriceChange = (value: string, lineItemId: string) => {
    const numericValue = parseFloat(value) || 0;

    console.log(`User typed salesPrice: "${value}"`);
    console.log(`Parsed numeric salesPrice for lineItemId ${lineItemId}: ${numericValue}`);

    handleLineItemChange('salesPrice', numericValue, lineItemId);
  };

  // Helper function to handle rate changes - converts string to number first
  const handleRateChange = (value: string, lineItemId: string) => {
    const numericValue = parseFloat(value) || 0;
    handleLineItemChange('rate', numericValue, lineItemId);
  };

  // Helper function to get line item data, providing default values if not set
  const getLineItemData = (lineItemId: string): LineItemData => {
    return (
      lineItemsData.get(lineItemId) || {
        quantity: 0,
        lotNumber: '',
        expiryDate: '',
        salesPrice: 0,
        unitOfMeasure: '',
        rate: 0,
      }
    );
  };

  // Helper function to validate manual items
  const validateManualItem = (item: BillOrderProduct | null): boolean => {
    if (!item) return false;

    const errors: {
      quantity?: string;
      lotNumber?: string;
      expiryDate?: string;
      salesPrice?: string;
      unitOfMeasure?: string;
      cost?: string;
    } = {};

    if (!item.quantity || item.quantity <= 0) {
      errors.quantity = 'Quantity must be greater than 0';
    }

    if (!item.lotNumber || item.lotNumber.toString().trim() === '') {
      errors.lotNumber = 'Lot number is required';
    }

    if (!item.expiryDate || item.expiryDate.trim() === '') {
      errors.expiryDate = 'Expiry date is required';
    }

    if (!item.salesPrice || item.salesPrice <= 0) {
      errors.salesPrice = 'Sales price must be greater than 0';
    }

    if (!item.unitOfMeasure || item.unitOfMeasure.trim() === '') {
      errors.unitOfMeasure = 'Unit of measure is required';
    }

    if (!item.cost || item.cost <= 0) {
      errors.cost = 'Cost must be greater than 0';
    }

    // Critical: make sure item has an itemRef with a fullName
    if (!item.itemRef || !item.itemRef.fullName || item.itemRef.fullName.trim() === '') {
      errors.quantity = 'Please select a valid product';
    }

    setManualItemErrors(errors);

    return Object.keys(errors).length === 0;
  };

  // Handlers for BillComboBox
  const handleItemSelect = (item: BillOrderProduct | null) => {
    // console.log('Selected item in Bill component:', item);
    if (item) {
      // Deep clone the item to avoid reference issues
      const itemCopy = JSON.parse(JSON.stringify(item));
      setCurrentManualItem(itemCopy);
    } else {
      setCurrentManualItem(null);
    }
    // Clear any previous errors when selecting a new item
    setManualItemErrors({});
  };

  const handleQuantityChangeManual = (quantity: number) => {
    if (currentManualItem) {
      setCurrentManualItem({
        ...currentManualItem,
        quantity,
      });
    }
  };

  const handleLotNumberChangeManual = (lotNumber: string) => {
    if (currentManualItem) {
      setCurrentManualItem({
        ...currentManualItem,
        lotNumber,
      });
    }
  };

  const handleExpiryDateChangeManual = (expiryDate: string) => {
    if (currentManualItem) {
      setCurrentManualItem({
        ...currentManualItem,
        expiryDate,
      });
    }
  };

  const handleSalesPriceChangeManual = (salesPrice: number) => {
    if (currentManualItem) {
      setCurrentManualItem({
        ...currentManualItem,
        salesPrice,
      });
    }
  };

  const handleUnitOfMeasureChangeManual = (unitOfMeasure: string) => {
    if (currentManualItem) {
      setCurrentManualItem({
        ...currentManualItem,
        unitOfMeasure,
      });
    }
  };

  const handleCostChangeManual = (cost: number) => {
    if (currentManualItem) {
      setCurrentManualItem({
        ...currentManualItem,
        cost,
      });
    }
  };

  // Add manual item to the list
  const addManualItem = () => {
    // console.log('Attempting to add manual item:', currentManualItem);

    if (!currentManualItem) {
      // console.log('No manual item to add');
      return;
    }

    // Perform validation
    const isValid = validateManualItem(currentManualItem);
    // console.log('Validation result:', isValid, 'Errors:', manualItemErrors);

    if (isValid) {
      // Create a deep copy of the item to avoid reference issues
      const itemToAdd = JSON.parse(JSON.stringify(currentManualItem));

      // Add item to the list
      setManualItems((prevItems) => [...prevItems, itemToAdd]);
      // console.log('Item added successfully:', itemToAdd);
      // console.log('Updated manual items list:', [...manualItems, itemToAdd]);

      // Reset current manual item
      setCurrentManualItem(null);
      setManualItemErrors({});

      // Trigger BillComboBox reset with a more reliable pattern
      setResetComboBox(false); // First set to false to ensure the useEffect will trigger when we set to true
      setTimeout(() => {
        setResetComboBox(true); // Then set to true
        // Reset back to false after a reasonable delay
        setTimeout(() => setResetComboBox(false), 200);
      }, 50);
    }
  };

  // Remove manual item from the list
  const removeManualItem = (index: number) => {
    const updatedItems = [...manualItems];
    updatedItems.splice(index, 1);
    setManualItems(updatedItems);
  };

  // Button condition for adding manual items
  const canAddManualItem =
    currentManualItem &&
    currentManualItem.itemRef &&
    currentManualItem.itemRef.fullName &&
    currentManualItem.itemRef.fullName.trim() !== '';

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const workbook = XLSX.read(bstr, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData: any[] = XLSX.utils.sheet_to_json(sheet);

      // console.log("Extracted Excel data:", jsonData); // Log the extracted data

      autoFillLineItemsFromExcel(jsonData);
    };
    reader.readAsBinaryString(file);
  };

  const formatExcelDate = (excelDate: string | number): string => {
    // console.log("Formatting excel date:", excelDate); // Log the date being formatted
    if (typeof excelDate === 'number') {
      const date = new Date((excelDate - 25569) * 86400 * 1000);
      const formattedDate = date.toISOString().split('T')[0]; // YYYY-MM-DD
      // console.log("Formatted date (number):", formattedDate); // Log the formatted date
      return formattedDate;
    }

    if (typeof excelDate === 'string') {
      const [month, year] = excelDate.split('/');
      if (month && year) {
        const paddedMonth = month.padStart(2, '0');
        const formattedDate = `${year}-${paddedMonth}-01`; // always day=01
        // console.log("Formatted date (string):", formattedDate); // Log the formatted date
        return formattedDate;
      }
    }

    // console.log("Date could not be formatted:", excelDate); // Log if the date cannot be formatted
    return '';
  };

  const autoFillLineItemsFromExcel = (excelData: any[]) => {
    const updatedMap = new Map(lineItemsData);

    purchaseOrders.forEach(order => {
      order.purchaseOrderLineRet?.forEach(lineItem => {
        const itemName = lineItem.itemRef?.fullName?.toLowerCase().trim();
        const match = excelData.find(row => {
          const excelItemName = row.ITEM?.toString().toLowerCase().trim();
          // console.log(`Comparing "${excelItemName}" (Excel) with "${itemName}" (Item)`); // Log comparison
          return excelItemName === itemName;
        });

        if (match) {
          // console.log(
          //   `Matched item: ${lineItem.itemRef?.fullName}, Batch Number from Excel:`,
          //   match['BATCH NO']
          // );

          const quantity = match._totalQuantity;
          const salesPrice = match['Market Price'] || match['Sale Price'];
          const lotNumber = match['BATCH NO'];
          const expiryDate = formatExcelDate(match['EXPIRY']) || '';

          console.log(`Extracted data - Quantity: ${quantity}, Sales Price: ${salesPrice}, Lot Number: ${lotNumber}, Expiry Date: ${expiryDate}`);

          updatedMap.set(lineItem.txnLineID, {
            ...updatedMap.get(lineItem.txnLineID),
            quantity: quantity,
            salesPrice: salesPrice, // Adjust if needed
            lotNumber: lotNumber,
            expiryDate: expiryDate, // Adjust if needed
          });
        } else {
          console.warn(`No matching Excel row found for item: ${lineItem.itemRef?.fullName}`);
        }
      });
    });

    setLineItemsData(updatedMap);
    // console.log("Updated line items data:", updatedMap); // Log the updated data
  };

  const formatToDayMonthYear = (dateString: string): string => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';

    const day = '01';
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`; // 01/MM/YYYY
  };

  const handleCustomDateInput = (inputValue: string, txnLineID: string) => {
    const parts = inputValue.split('/');
    if (parts.length === 3) {
      const [, month, year] = parts;
      const isoDate = `${year}-${month.padStart(2, '0')}-01`; // Back to ISO for storage
      handleLineItemChange('expiryDate', isoDate, txnLineID);
    }
  };

  // const unitsPerPack = 24; // assume 100 for now, you can make it dynamic
  const roundBasedOnQuantity = (value: number, quantity: number): number => {
    if (quantity === 1) return Math.round(value / 1000) * 1000;
    if (quantity > 1 && quantity <= 10) return Math.round(value / 100) * 100;
    if (quantity > 10) return Math.round(value / 10) * 10;
    return value;
  };

  return (
    <React.Fragment>
      <Tabs defaultValue="create-bills" className="w-full">
        <TabsList className="w-full pb-0 rounded-none px-4">
          <TabsTrigger className=" w-1/2 rounded-none" value="create-bills">
            Create Bills
          </TabsTrigger>
          <TabsTrigger className="w-1/2 rounded-none" value="view-bills">
            View Billed Products
          </TabsTrigger>
        </TabsList>
        <TabsContent value="create-bills">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="section">
              <div className=" px-4 py-2 flex items-center gap-4">
                <FormField
                  control={form.control}
                  name="vendor"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormLabel className="text-xs text-nowrap">Vendor:</FormLabel>
                      <div>
                        <VendorComboBox
                          value={field.value}
                          onChange={field.onChange}
                        />
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                {/* <FormField
                  control={form.control}
                  // name="site"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormLabel className="text-xs text-nowrap">Site:</FormLabel>
                      <div>
                        <VendorComboBox value={field.value} onChange={field.onChange} />
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                /> */}
              </div>
              <hr />
              <div className="px-4 py-2">
                <h4 className="section-heading">Bill</h4>
                <div className="flex items-center justify-between mt-2">
                  <FormField
                    control={form.control}
                    name="invoiceNo"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-1">
                        <FormLabel className="pl-4 pr-2 text-xs text-nowrap">Invoice No:</FormLabel>
                        <div>
                          <FormControl>
                            <Input type="text" className="w-[200px] bg-slate-100" {...field} />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <Button variant="outline" type="button" onClick={() => dispatch(fetchPurchaseOrders())}>
                    <RefreshCw size={16} />
                    <span className="px-1">Refresh</span>
                  </Button>
                </div>
              </div>

              <div className="my-4 mx-2 border dark:border-slate-700">
                <div className="w-full px-4 flex items-center gap-2 py-3 border-b">
                  <div className="w-1/4 text-left ">
                    <span className="text-sm font-semibold">P.O Number</span>
                  </div>
                  <div className="w-1/4 text-left">
                    <span className="text-sm font-semibold ">Date Created</span>
                  </div>
                  <div className="w-1/4 text-left">
                    <span className="text-sm font-semibold ">Vendor</span>
                  </div>
                  <div className="w-1/4 text-left">
                    <span className="text-sm font-semibold ">Total Amount</span>
                  </div>
                  <div className="w-1/4 text-left">
                    <span className="text-sm font-semibold ">Created By</span>
                  </div>
                </div>
                {isLoadingPurchaseOrders ? (
                  <div className="w-full flex justify-center items-center py-8">
                    <div className="flex gap-2 items-center">
                      <Loader color="text-primary" />
                      <p className="text-sm text-slate-500">Loading purchase orders, please wait...</p>
                    </div>
                  </div>
                ) : purchaseOrders && purchaseOrders.length > 0 ? (
                  purchaseOrders.map((order, index) => {

                    return (
                      <Accordion key={index + order.timeCreated} type="single" collapsible className="my-0">
                        <AccordionItem value={`item-${index}`}>
                          <AccordionTrigger
                            showIcon={false}
                            className="hover:bg-primary hover:text-white border-b last:border-b-0 border-slate-200 group"
                          >
                            <div className="px-4 w-full flex items-center gap-2">
                              <div className="w-1/4 text-left">
                                <span className="text-xs ">{order.txnID.slice(0, 9)}</span>
                              </div>
                              <div className="w-1/4 text-left">
                                <span className="text-xs ">{formatTimestamp(order.timeCreated)}</span>
                              </div>
                              <div className="w-1/4 text-left">
                                <span className="text-xs ">{order.vendorRef.fullName}</span>
                              </div>
                              <div className="w-1/4 text-left">
                                <span className="text-xs ">UGX {formatCurrency(order.totalAmount)}</span>
                              </div>
                              <div className="w-1/4 text-left">
                                <span className="text-xs ">{order.dispenser?.name}</span>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="mx-4 my-2 bg-white border border-slate-200 shadow-sm rounded-md">
                              <Table>
                                <TableCaption>A list of your bills.</TableCaption>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>
                                      <div className="flex items-center gap-2">
                                        <Checkbox
                                          checked={
                                            order.purchaseOrderLineRet?.every(item => checkedItems.get(item.txnLineID)) ?? false
                                          }
                                          onCheckedChange={(checked) => handleSelectAllForOrder(order, checked === true)}
                                        />
                                        <span>Item</span>
                                      </div>
                                    </TableHead>
                                    <TableHead className="text-left">U/M</TableHead>
                                    <TableHead className="text-left px-0">Ordered</TableHead>
                                    <TableHead className="text-left">Rate</TableHead>
                                    <TableHead className="text-left pl-0">Amount</TableHead>
                                    <TableHead className="text-left pl-0">Qty</TableHead>
                                    <TableHead className="text-left">Sales Price</TableHead>
                                    <TableHead className="text-left pl-0">Uni-Price</TableHead>
                                    <TableHead className="text-left">BATCH NO</TableHead>
                                    <TableHead className="text-left">Expiry Date</TableHead>
                                  </TableRow>
                                </TableHeader>

                                <TableBody className="mt-6">
                                  {/* Products Table */}
                                  {order && order.purchaseOrderLineRet?.length > 0 ? (
                                    <>
                                      {order.purchaseOrderLineRet.map((item, index) => {
                                        const lineItemData = getLineItemData(item.txnLineID);
                                        // console.log('Rendering item:', item);
                                        return (
                                          <TableRow key={item.txnLineID}>
                                            <TableCell className="font-medium max-w-[580px]">
                                              <div className="flex items-center space-x-2">
                                                <div>
                                                  <span className='nr-2'>{index + 1}</span>
                                                </div>
                                                <Checkbox
                                                  id={`select-${item.txnLineID}`}
                                                  checked={checkedItems.get(item.txnLineID) === true}
                                                  onCheckedChange={(checked) =>
                                                    handleCheckItem(item.txnLineID, checked === true)
                                                  }
                                                />
                                                <label
                                                  htmlFor={`select-${item.txnLineID}`}
                                                  className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                  {/* Safely access fullName */}
                                                  {item.itemRef?.fullName || 'No Item Name'}
                                                </label>
                                              </div>
                                            </TableCell>
                                            <TableCell>
                                              <span className="w-[50px]">{item.unitOfMeasure}</span>
                                              {/* <Select
                                                value={lineItemData.unitOfMeasure || item.unitOfMeasure}
                                                defaultValue={item.unitOfMeasure}
                                                onValueChange={(value) =>
                                                  handleLineItemChange('unitOfMeasure', value, item.txnLineID)
                                                }
                                              >
                                                <SelectTrigger className="w-[100px]">
                                                  <SelectValue placeholder="select unit..."></SelectValue>
                                                </SelectTrigger>
                                                <SelectContent>
                                                  {unitsOfMeasure.map((unit) => (
                                                    <SelectItem key={unit} value={unit}>
                                                      {unit}
                                                    </SelectItem>
                                                  ))}
                                                </SelectContent>
                                              </Select> */}
                                              {lineItemErrors.get(item.txnLineID)?.unitOfMeasure && (
                                                <p className="text-xs text-red-500 mt-1">
                                                  {lineItemErrors.get(item.txnLineID)?.unitOfMeasure}
                                                </p>
                                              )}
                                            </TableCell>
                                            <TableCell className="text-center px-0">
                                              <span className="w-[50px]">{item.quantity}</span>
                                            </TableCell>
                                            <TableCell>
                                              <Input
                                                className="w-[100px] text-xs"
                                                value={lineItemData.rate}
                                                defaultValue={item.rate}
                                                onChange={(e) => handleRateChange(e.target.value, item.txnLineID)}
                                              />
                                              {lineItemErrors.get(item.txnLineID)?.rate && (
                                                <p className="text-xs text-red-500 mt-1">
                                                  {lineItemErrors.get(item.txnLineID)?.rate}
                                                </p>
                                              )}
                                            </TableCell>
                                            <TableCell className="pl-0">{formatCurrency(item.amount)}</TableCell>

                                            <TableCell className="pl-0">
                                              <Input
                                                className="w-[80px] text-xs"
                                                value={lineItemsData.get(item.txnLineID)?.quantity ?? item.quantity}
                                                onChange={(e) => handleQuantityChange(e.target.value, item.txnLineID)}
                                              />
                                              {lineItemErrors.get(item.txnLineID)?.quantity && (
                                                <p className="text-xs text-red-500 mt-1">
                                                  {lineItemErrors.get(item.txnLineID)?.quantity}
                                                </p>
                                              )}
                                            </TableCell>
                                            <TableCell>
                                              <Input
                                                type="text"
                                                className="w-[120px] text-xs"
                                                value={lineItemData.salesPrice}
                                                onChange={(e) => handleSalesPriceChange(e.target.value, item.txnLineID)}
                                              />
                                              {lineItemErrors.get(item.txnLineID)?.salesPrice && (
                                                <p className="text-xs text-red-500 mt-1">
                                                  {lineItemErrors.get(item.txnLineID)?.salesPrice}
                                                </p>
                                              )}
                                            </TableCell>

                                            <TableCell className="pl-0">
                                              {(() => {
                                                //  console.log('Line Item Data:2', item.unitsOfMeasure);
                                                const selectedUom = item.unitsOfMeasure?.find(
                                                  (u) => u.fullName === item.unitOfMeasure
                                                ) ?? (item.unitOfMeasure ? { fullName: item.unitOfMeasure, quantity: item.quantity || 1 } : undefined);
                                                // console.log('Line Item Data:', item.unitOfMeasure); // 🔍 Log line item data
                                                // 🔍 Log line item data
                                                // console.log('Selected UOM:', selectedUom); // 🔍 Log selected UOM
                                                if (!selectedUom) return 0;

                                                const quantity = Number(selectedUom.quantity);
                                                const salesPrice = parseFloat(String(lineItemData.salesPrice ?? "0")); // 👈 use updated input value

                                                if (!salesPrice || salesPrice === 0 || isNaN(salesPrice)) return 0;

                                                const rawUnitPrice = salesPrice / (quantity || 1);
                                                const finalUnitPrice = roundBasedOnQuantity(rawUnitPrice, quantity);

                                                return finalUnitPrice;
                                              })()}
                                            </TableCell>


                                            <TableCell className="pl-0">
                                              <Input
                                                type="text"
                                                className="w-[130px] text-xs"
                                                value={lineItemData.lotNumber || ''}
                                                onChange={(e) =>
                                                  handleLineItemChange('lotNumber', e.target.value, item.txnLineID)
                                                }
                                              />
                                              {lineItemErrors.get(item.txnLineID)?.lotNumber && (
                                                <p className="text-xs text-red-500 mt-1">
                                                  {lineItemErrors.get(item.txnLineID)?.lotNumber}
                                                </p>
                                              )}
                                            </TableCell>
                                            <TableCell>
                                              {/* <DateSelect
                                            value={lineItemData.expiryDate}
                                            onChange={(e) => handleExpiryDateChange(e.target.value, item.txnLineID)}
                                          /> */}
                                              <Input
                                                type="date"
                                                className="w-[120px] text-xs"
                                                value={lineItemData.expiryDate}
                                                onChange={(e) =>
                                                  handleLineItemChange('expiryDate', e.target.value, item.txnLineID)
                                                }
                                              />
                                              {lineItemErrors.get(item.txnLineID)?.expiryDate && (
                                                <p className="text-xs text-red-500 mt-1">
                                                  {lineItemErrors.get(item.txnLineID)?.expiryDate}
                                                </p>
                                              )}
                                            </TableCell>
                                          </TableRow>
                                        );
                                      })}
                                    </>
                                  ) : (
                                    <div className="text-center py-4">No products found</div>
                                  )}

                                  {/* Display validation errors for the manual item */}
                                  {Object.keys(manualItemErrors).length > 0 && (
                                    <TableRow>
                                      <TableCell colSpan={9} className="px-4 py-2">
                                        <div className="bg-red-50 border border-red-200 rounded p-2 text-sm">
                                          <h4 className="font-medium text-red-800 mb-1">
                                            Please fix the following errors:
                                          </h4>
                                          <ul className="list-disc pl-5 space-y-1 text-red-700">
                                            {Object.entries(manualItemErrors).map(([field, error]) => (
                                              <li key={field}>{error}</li>
                                            ))}
                                          </ul>
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  )}

                                  {/* Display manually added items */}
                                  {manualItems.length > 0 && (
                                    <>
                                      <TableRow>
                                        <TableCell colSpan={9} className="bg-muted">
                                          <h3 className="font-medium">Added Items</h3>
                                        </TableCell>
                                      </TableRow>
                                      {manualItems.map((item, index) => {
                                        console.log('manualItem:', item); // 🔍 Log each manualItem

                                        return (
                                          <TableRow key={index} className="border-b">
                                            <TableCell className="max-w-[280px]">{item.itemRef.fullName}</TableCell>
                                            <TableCell className="pl-0">{item.unitOfMeasure}</TableCell>
                                            <TableCell className="pl-0">{formatCurrency(item.cost)}</TableCell>
                                            <TableCell className="pl-0">
                                              {formatCurrency(item.cost * item.quantity)}
                                            </TableCell>
                                            <TableCell className="pl-0">{item.quantity}</TableCell>

                                            <TableCell className="pl-0">{item.lotNumber}</TableCell>
                                            {/* <TableCell className="pl-0">{item.salesPrice}</TableCell> */}
                                            <TableCell className="pl-0 flex items-center gap-2">
                                              <span>{item.expiryDate}</span>
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0 text-red-500"
                                                onClick={() => removeManualItem(index)}
                                              >
                                                <Trash2 className="h-4 w-4" />
                                              </Button>
                                            </TableCell>
                                          </TableRow>
                                        );
                                      })}
                                    </>
                                  )}

                                  {/* ComboBox for selecting manual items */}
                                  <BillComboBox
                                    onItemSelect={handleItemSelect}
                                    onQuantityChange={handleQuantityChangeManual}
                                    onLotNumberChange={handleLotNumberChangeManual}
                                    onExpiryDateChange={handleExpiryDateChangeManual}
                                    // onSalesPriceChange={handleSalesPriceChangeManual}
                                    onUnitOfMeasureChange={handleUnitOfMeasureChangeManual}
                                    onCostChange={handleCostChangeManual}
                                    resetSelection={resetComboBox}
                                  />

                                  {/* Only display add item button if there's a valid currentManualItem */}
                                  {canAddManualItem && (
                                    <TableRow>
                                      <TableCell colSpan={9}>
                                        <div className="flex justify-end">
                                          <Button
                                            type="button"
                                            onClick={addManualItem}
                                            disabled={Object.keys(manualItemErrors).length > 0}
                                            className="mt-2"
                                          >
                                            Add Item
                                          </Button>
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  )}
                                </TableBody>
                                <TableFooter>
                                  <TableRow>
                                    <TableCell colSpan={7}>
                                      Total Items:{' '}
                                      {Array.from(checkedItems.entries()).filter(
                                        ([_, checked]) =>
                                          checked && order?.purchaseOrderLineRet.some((item) => item.txnLineID === _),
                                      ).length + manualItems.length}
                                    </TableCell>
                                    <TableCell>
                                      <Button
                                        size="lg"
                                        variant="default"
                                        type="submit"
                                        disabled={isSubmitting}
                                        onClick={() => setSelectedOrder(order.txnID)}
                                      >
                                        {isSubmitting && selectedOrder === order.txnID ? (
                                          <span className="flex items-center gap-2">
                                            <Loader color="text-white" /> Processing...
                                          </span>
                                        ) : (
                                          'Create Bill'
                                        )}
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                </TableFooter>
                              </Table>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    );
                  })
                ) : (
                  <div className="flex items-center justify-center py-4">No Billed Orders</div>
                )}
              </div>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="view-bills">
          <div className="section">
            <div className="flex items-center justify-between m-2">
              <Select onValueChange={(value) => setSelectedVendor(value)}>
                <SelectTrigger className="w-[250px] ">
                  <SelectValue placeholder="Select a vendor" />
                </SelectTrigger>
                <SelectContent>
                  {vendorNames.map((vendorName) => (
                    <SelectItem key={vendorName} value={vendorName}>
                      {vendorName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                type="button"
                onClick={() => dispatch(fetchBills({ filterBy: selectedVendor ? 'VENDOR' : 'P_ALL' }))}
              >
                <RefreshCw size={16} />
                <span className="px-1">Refresh</span>
              </Button>
            </div>
            <div className="my-4 mx-2 border dark:border-slate-700">
              <div className="w-full px-4 flex items-center gap-2 py-3 border-b">
                <div className="w-1/4 text-left">
                  <span className="text-sm font-semibold">P.O Number</span>
                </div>
                <div className="w-1/4 text-left">
                  <span className="text-sm font-semibold ">Invoice No.</span>
                </div>
                <div className="w-1/4 text-left">
                  <span className="text-sm font-semibold ">Date Created</span>
                </div>
                <div className="w-1/4 text-left">
                  <span className="text-sm font-semibold ">Last Modified</span>
                </div>
                <div className="w-1/4 text-left">
                  <span className="text-sm font-semibold ">Vendor</span>
                </div>
                <div className="w-1/4 text-left">
                  <span className="text-sm font-semibold ">Bill Amount</span>
                </div>
                <div className="w-1/4 text-left">
                  <span className="text-sm font-semibold ">Created By</span>
                </div>
              </div>
            </div>
            <BillsTable />
          </div>
        </TabsContent>
      </Tabs>
      <div className="my-4">
        <label htmlFor="excel-upload" className="block text-sm font-medium mb-1">Upload Excel to Autofill</label>
        <Input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      </div>

    </React.Fragment>
  );
};

const BillsTable = () => {
  const dispatch = useAppDispatch();

  const bills = useAppSelector((state) => state.bill.bills) || [];
  const totalBills = useAppSelector((state) => state.bill.totalBills) || 0;
  const isLoading = useAppSelector((state) => state.bill.isBillsLoading);
  const error = useAppSelector((state) => state.bill.error);

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // Fetch bills when page or pageSize changes
  useEffect(() => {
    dispatch(fetchBills({ filterBy: "P_ALL", page: pageIndex + 1, max: pageSize }));
  }, [dispatch, pageIndex, pageSize]);

  const columns = useMemo<ColumnDef<any>[]>(() => [
    { header: "P.O Number", accessorFn: (row) => row.purchaseOrderId?.slice(0, 7), size: 15 },
    { header: "Invoice No.", accessorFn: (row) => row.invoiceNo, size: 15 },
    { header: "Date Created", accessorFn: (row) => formatTimestamp(row.timeCreated), size: 15 },
    { header: "Last Modified", accessorFn: (row) => formatTimestamp(row.timeModified), size: 15 },
    { header: "Vendor", accessorFn: (row) => row.vendorRef?.fullName, size: 20 },
    { header: "Amount", accessorFn: (row) => formatCurrency(row.amountDue, false), size: 10 },
    { header: "Created By", accessorFn: (row) => row.dispenser?.name, size: 10 },
  ], []);

  const pageCount = Math.ceil(totalBills / pageSize);

  const table = useReactTable({
    data: bills,
    columns,
    pageCount,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    onPaginationChange: (updater) => {
      const next = typeof updater === "function" ? updater({ pageIndex, pageSize }) : updater;
      setPageIndex(next.pageIndex);
      setPageSize(next.pageSize);
    },
  });

  if (isLoading) {
    return <div>Loading bills...</div>;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-4 text-red-500">
        Error fetching bills! Please contact Admin.
      </div>
    );
  }

  if (bills.length === 0) {
    return <div className="flex items-center justify-center py-4">No Bills Found</div>;
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-slate-50 p-4 font-semibold border-b text-sm hidden md:flex">
        {columns.map((col) => (
          <div
            key={col.header as string}
            style={{ flexBasis: `${(col as any).size}%` }}
            className="px-2"
          >
            {col.header as string}
          </div>
        ))}
      </div>

      {table.getRowModel().rows.map((row) => (
        <Accordion key={row.id} type="single" collapsible className="border-b last:border-b-0">
          <AccordionItem value={`item-${row.id}`} className="border-none">
            <AccordionTrigger className="p-4 hover:bg-slate-50 text-xs w-full">
              <div className="w-full flex flex-col md:flex-row items-start md:items-center text-left">
                {row.getVisibleCells().map((cell) => (
                  <div
                    key={cell.id}
                    style={{ flexBasis: `${(cell.column.columnDef as any).size}%` }}
                    className="mb-2 md:mb-0 px-2"
                  >
                    <span className="font-semibold md:hidden">
                      {(cell.column.columnDef.header as string)}:
                    </span>{" "}
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                ))}
              </div>
            </AccordionTrigger>
            <AccordionContent className="bg-white p-4">
              <div className="border rounded-md overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>U/M</TableHead>
                      <TableHead>Rate</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>LOT No.</TableHead>
                      <TableHead>Expiry Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {row.original.itemLineRet?.length > 0 ? (
                      row.original.itemLineRet.map((item: any) => (
                        <TableRow key={item?.itemRef?.listID}>
                          <TableCell>{item.itemRef?.fullName}</TableCell>
                          <TableCell>{item.unitOfMeasure}</TableCell>
                          <TableCell>{formatCurrency(item.cost, false)}</TableCell>
                          <TableCell>{formatCurrency(item.amount)}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{item.lotNumber}</TableCell>
                          <TableCell>{formatTimestamp(item.expiryDate)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center">
                          No products found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}

      <Pagination table={table} />
    </div>
  );
};


export default Bill;


