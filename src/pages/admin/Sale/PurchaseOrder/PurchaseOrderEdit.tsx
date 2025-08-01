import React, { useEffect, useState } from 'react';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  Input,
  Checkbox,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Loader,
  onOpenModal,
  Modal,
} from '@/components';
import VendorComboBox from './VendorComboBox';
import { IoAddCircleOutline, IoTrash } from 'react-icons/io5';
import { useAppDispatch, useAppSelector, useModalDispatch } from '@/store/hooks';
import { fetchRequestOrders, fetchVendorsList } from './purchaseOrderSlice';
import { toast } from 'sonner';
import POComboBox, { PurchaseOrderProduct } from './POComboBox';
import { RootState } from '@/store/store';
import { fetchPurchaseOrders } from '../Bill/billSlice';
import { formatTimestamp, formatCurrency } from '@/utils/formatter';
import { selectUserProfile } from '@/pages/auth/authSlice';
import { RefreshCw } from 'lucide-react';
import { pdf, PDFDownloadLink } from '@react-pdf/renderer';
import PurchaseOrderPDF from './PurchaseOrderPDF';
import { createRoot } from 'react-dom/client';
import CreateVendorForm from '@/components/Forms/Sale/productOrder/CreateVendorForm';
import { useUpdatePurchaseOrder } from './useCombinedOrders';
import { WebService } from '@/web-services/WebService';
import { units } from '@/utils/constants';
import * as XLSX from 'xlsx';

type SiteInfo = {
  siteName: string;
  siteId: string;
  quantityOnsite: number;
};

const PurchaseOrderEdit: React.FC = () => {
  const dispatch = useModalDispatch();
  const appDispatch = useAppDispatch();
  const showModalState = useAppSelector((state) => state.modal.isOpen);
  const vendors = useAppSelector((state) => state.purchaseOrder.vendors);
  const vendorNames = vendors.map((vendor) => vendor.name);
  const requestOrders = useAppSelector((state) => state.purchaseOrder.requestOrders);
  const isLoadingRequestOrders = useAppSelector((state) => state.purchaseOrder.isLoadingRequestOrders);
  const inventory = useAppSelector((state) => state.products.products);
  const purchaseOrders = useAppSelector((state) => state.bill.purchaseOrders || []);
  const isLoading = useAppSelector((state: RootState) => state.bill.isLoading || false);
  const userProfile = useAppSelector(selectUserProfile);
  const phoneNumber = localStorage.getItem('account_id')
  const dispenserName = localStorage.getItem('firstName')
  // const sites = useAppSelector((state: RootState) => state.bill.sites);
  const tillNo = userProfile?.ads.station[0];
  const facilityName = localStorage.getItem('siteName')
  const { mutate, data, isPending, error } = useUpdatePurchaseOrder();

  const [combinedOrders, setCombinedOrders] = useState(null); // Initialize state

  useEffect(() => {
    mutate(undefined, {
      onSuccess: (responseData) => {
        console.log('✅ Combined Orders Response:', responseData);
        setCombinedOrders(responseData); // Store responseData in state
      },
      onError: (err) => {
        console.error('❌ Error fetching combined orders:', err);
      },
    });
  }, [mutate]);
  // Convert inventory (Product[]) to PurchaseOrderProduct[] format
  const inventoryAsPurchaseOrderProducts: PurchaseOrderProduct[] = inventory.map((product) => ({
    itemRef: {
      fullName: product.fullName,
    },
    quantity: 0,
    unitOfMeasure: product.unitOfMeasureSetRef?.fullName,
    rate: 0,
  }));

  // State to track modified items for each order
  const [modifiedItems, setModifiedItems] = useState<
    Record<string, Record<string, { quantity: number; rate: number }>>
  >({});
  // Track selected order
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  // State for newly added items (not part of the original request order), organized by order ID
  const [addedItems, setAddedItems] = useState<Record<string, PurchaseOrderProduct[]>>({});
  // Current selected item from POComboBox
  const [selectedComboItem, setSelectedComboItem] = useState<PurchaseOrderProduct | null>(null);
  // State to track which items are checked (selected) in the request order
  const [checkedItems, setCheckedItems] = useState<Record<string, Record<string, boolean>>>({});
  // State to track which orders have been submitted
  const [submittedOrders, setSubmittedOrders] = useState<Record<string, boolean>>({});
  // State to track which specific items have been submitted
  const [submittedItems, setSubmittedItems] = useState<Record<string, Record<string, boolean>>>({});
  // State to track form submission status
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const formSchema = z.object({
    vendor: z.string().min(1, { message: 'Vendor is required' }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vendor: '',
    },
  });

  useEffect(() => {
    appDispatch(fetchVendorsList());
    dispatch(fetchPurchaseOrders());
    appDispatch(
      fetchRequestOrders({
        orderStatus: 'PROCESSING',
        filterBy: 'R_STATUS',
        facilityName,
        tillNo,
        accountId: dispenserName,
        name: phoneNumber,
      }),
    );
    // dispatch(fetchSites());
  }, [appDispatch]);

  useEffect(() => {
    const currentOrder = combinedOrders;

  }, [combinedOrders]);

  // Handle quantity change
  const handleQuantityChange = (orderId: string, itemId: string, value: number) => {
    setModifiedItems((prev) => ({
      ...prev,
      [orderId]: {
        ...(prev[orderId] || {}),
        [itemId]: {
          quantity: value,
          rate: prev[orderId]?.[itemId]?.rate || 0,
        },
      },
    }));
  };

  // Handle rate change
  const handleRateChange = (orderId: string, itemId: string, value: number) => {
    setModifiedItems((prev) => ({
      ...prev,
      [orderId]: {
        ...(prev[orderId] || {}),
        [itemId]: {
          quantity: prev[orderId]?.[itemId]?.quantity || 0,
          rate: value,
        },
      },
    }));
  };

  // Handle accordion toggle to track selected order
  const handleAccordionToggle = (orderId: string) => {
    setSelectedOrderId(orderId);

    // Initialize checked state for this order if not already done
    if (!checkedItems[orderId]) {
      // Get the order to initialize all items as checked by default
      const order = requestOrders.find((o) => o.orderId === orderId);
      if (order) {
        const initialCheckedState: Record<string, boolean> = {};
        order.items.forEach((item) => {
          initialCheckedState[item.itemName] = true; // Default to checked
        });

        setCheckedItems((prev) => ({
          ...prev,
          [orderId]: initialCheckedState,
        }));
      }
    }
  };

  // Handle checkbox change for item selection
  const handleItemCheckboxChange = (orderId: string, itemId: string, checked: boolean) => {
    setCheckedItems((prev) => ({
      ...prev,
      [orderId]: {
        ...(prev[orderId] || {}),
        [itemId]: checked,
      },
    }));
  };

  // Add the selected item from POComboBox to the list of added items
  const handleAddNewItem = () => {
    if (selectedComboItem && selectedOrderId) {
      // Initialize the added items array for this order if it doesn't exist
      const currentOrderItems = addedItems[selectedOrderId] || [];

      // Check if the item is already in the added items list for this order
      const existingItemIndex = currentOrderItems.findIndex(
        (item) => item.itemRef.fullName === selectedComboItem.itemRef.fullName,
      );

      if (existingItemIndex >= 0) {
        // Update existing item
        const updatedItems = [...currentOrderItems];
        updatedItems[existingItemIndex] = selectedComboItem;

        setAddedItems((prev) => ({
          ...prev,
          [selectedOrderId]: updatedItems,
        }));
        toast.success('Item updated in purchase order');
      } else {
        // Add new item to this specific order
        setAddedItems((prev) => ({
          ...prev,
          [selectedOrderId]: [...(prev[selectedOrderId] || []), selectedComboItem],
        }));
        toast.success('Item added to purchase order');
      }

      // Reset selected item for next addition
      setSelectedComboItem(null);
    } else {
      toast.error('Please select an item first');
    }
  };

  // Remove an added item by index from the current order
  const handleRemoveAddedItem = (orderId: string, index: number) => {
    if (addedItems[orderId]) {
      setAddedItems((prev) => ({
        ...prev,
        [orderId]: prev[orderId].filter((_, i) => i !== index),
      }));
      toast.success('Item removed from purchase order');
    }
  };


  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const currentOrder = combinedOrders.combinedOrders.find((order) => order.combinedOrderId === selectedOrderId);

    if (!currentOrder) {
      toast.error('No order selected. Please select an order first.');
      return;
    }

    // Validate selected items and their quantities
    const checkedMap = checkedItems[selectedOrderId] || {};
    const checkedOrderItems = currentOrder.combinedItems.filter(item => checkedMap[item.itemName]);

    // Check if no items are selected
    if (checkedOrderItems.length === 0) {
      toast.error('Please select at least one item for the purchase order.');
      return;
    }

    // Validate quantities for checked items
    const invalidQuantities = checkedOrderItems.some(item => {
      const modifiedItem = modifiedItems[selectedOrderId]?.[item.itemName];
      const quantity = modifiedItem?.quantity || item.quantity;
      return quantity <= 0 || isNaN(quantity);
    });

    if (invalidQuantities) {
      toast.error('All quantities must be greater than 0.');
      return;
    }

    // Proceed with the submission
    setIsSubmitting(true);
    const submitPurchaseOrder = async () => {
      // Find the selected vendor
      const selectedVendor = vendors.find((vendor) => vendor.name === data.vendor);
      if (!selectedVendor) {
        throw new Error('Selected vendor not found');
      }
      console.log('test-p', currentOrder.orderIdsCombined[0])
      // Prepare purchase order line items
      const purchaseOrderLineAdd = checkedOrderItems.map((item) => {
        const modifiedItem = modifiedItems[selectedOrderId]?.[item.itemName];
        const quantity = modifiedItem?.quantity || item.quantity;
        const rate = modifiedItem?.rate || item.rate;
        console.log('test-p', item);
        return {
          itemRef: {
            fullName: item.itemName,
          },
          quantity: quantity,
          unitOfMeasure: item.unitOfMeasure,
          unitsOfMeasure: item.unitsOfMeasure || [],
          rate: rate,
        };
      });

      // Add newly added items
      const currentOrderAddedItems = addedItems[selectedOrderId] || [];

      currentOrderAddedItems.forEach(item => {
        if (item.quantity > 0) {
          purchaseOrderLineAdd.push({
            itemRef: {
              fullName: item.itemRef.fullName,
            },
            quantity: item.quantity,
            unitOfMeasure: item.unitOfMeasure,
            unitsOfMeasure: item.unitsOfMeasure || [],
            rate: item.rate,
          });
        }
      });

      // Construct the request body
      const requestBody = {
        requestType: 'CREATE_P_ORDER',
        requestOrderId: currentOrder.orderIdsCombined[0],
        dispenser: {
          name: dispenserName,
          accountId: phoneNumber,
        },
        qBXMLMsgsRq: {
          _attr: {
            onError: 'stopOnError',
          },
          purchaseOrderAddRq: {
            purchaseOrderAdd: {
              purchaseOrderLineAdd: purchaseOrderLineAdd,
            },
          },
        },
        vendorRef: {
          listID: selectedVendor.listID,
          fullName: selectedVendor.name,
        },
      };

      console.log('Request body for purchase order:', requestBody);

      // Make API call
      const response = await WebService.postPharma('purchaseOrder', requestBody);
      console.log('Purchase order items', requestBody);

      if (!response || !response.status) {
        throw new Error('Failed to create purchase order: ' + (response?.message || 'Unknown error'));
      }

      // Reset form for this order only
      form.reset();

      // Track which specific items were submitted
      const submittedItemsForOrder: Record<string, boolean> = {};
      checkedOrderItems.forEach((item) => {
        submittedItemsForOrder[item.itemName] = true;
      });

      // Update submitted items state
      if (selectedOrderId) {
        setSubmittedItems((prev) => ({
          ...prev,
          [selectedOrderId]: {
            ...(prev[selectedOrderId] || {}),
            ...submittedItemsForOrder,
          },
        }));

        // Mark the order as having had items submitted
        setSubmittedOrders((prev) => ({
          ...prev,
          [selectedOrderId]: true,
        }));
      }

      // Reset selected combo item
      setSelectedComboItem(null);

      return 'Purchase order created successfully!';
    };

    // Create toast and handle the submission
    toast.promise(
      submitPurchaseOrder()
        .then((message) => {
          console.log('Purchase order submitted successfully');
          return message;
        })
        .finally(() => {
          setIsSubmitting(false);
        }),
      {
        loading: 'Submitting purchase order...',
        success: (message) => message,
        error: (error) => error.message,
      },
    );
  };


  const generateOrderItemsPDF = async (orderId: string) => {
    const vendor = form.getValues('vendor') || 'N/A';
    const currentOrder = combinedOrders.combinedOrders.find((order) => order.combinedOrderId === orderId);

    if (!currentOrder) {
      console.error("Order not found");
      return;
    }

    const checkedMap = checkedItems[orderId] || {};
    const hasAnyChecked = Object.values(checkedMap).some((isChecked) => isChecked);

    const itemsToInclude = hasAnyChecked
      ? currentOrder.combinedItems.filter((item) => checkedMap[item.itemName])
      : currentOrder.combinedItems;

    const purchaseOrderLineRet = [
      ...itemsToInclude.map((item) => {
        const modifiedQty = modifiedItems[orderId]?.[item.itemName]?.quantity;
        const fallbackQty =
          item.quantity === 0 || item.quantity == null
            ? item.totalQuantity
            : item.quantity;

        return {
          txnLineID: `${orderId}-${item.itemName}`,
          itemRef: { fullName: item.itemName },
          unitOfMeasure: item.unitOfMeasure,
          quantity: modifiedQty ?? fallbackQty ?? 0,
        };
      }),
      ...(addedItems[orderId] || []).map((item, index) => ({
        txnLineID: `${orderId}-added-${index}`,
        itemRef: { fullName: item.itemRef.fullName },
        unitOfMeasure: item.unitOfMeasure || 'N/A',
        quantity: item.quantity ?? 0,
      })),
    ];

    // Create PurchaseOrder object
    const order = {
      txnID: orderId,
      timeCreated: Date.now(),
      timeModified: Date.now(),
      vendorRef: { fullName: vendor },
      expectedDate: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days from now
      purchaseOrderLineRet,
    };

    // const facilityName = 'Your Facility Name'; // Replace with actual facility name or prop

    // Generate PDF
    try {
      const doc = pdf(<PurchaseOrderPDF order={order} facilityName={facilityName} />);
      const blob = await doc.toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `PurchaseOrder_${orderId}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  // Function to calculate totals for an order
  const calculateOrderTotals = (orderId: string) => {
    let totalItems = 0;
    let totalAmount = 0;

    // Get the original order
    const order = combinedOrders.combinedOrders.find((o) => o.combinedOrderId === orderId);
    if (!order) return { totalItems, totalAmount };

    // Count checked items from the original order
    order.combinedItems.forEach((item) => {
      // Check if the item is checked/selected via checkbox
      if (checkedItems[orderId]?.[item.itemName]) {
        // Get the modified values or use original ones
        const modifiedItem = modifiedItems[orderId]?.[item.itemName];
        const quantity = modifiedItem?.quantity || item.quantity;
        const rate = modifiedItem?.rate || item.rate;

        totalItems++;
        totalAmount += quantity * rate;
      }
    });

    // Count checked items from added items
    const orderAddedItems = combinedOrders.combinedOrders[orderId] || [];
    orderAddedItems.forEach((item, index) => {
      // For added items, they're implicitly selected once added
      // We could add explicit checkbox selection for these too if needed
      totalItems++;
      totalAmount += item.quantity * item.rate;
    });

    return { totalItems, totalAmount };
  };

  const [openSiteDetails, setOpenSiteDetails] = useState<{ [key: string]: boolean }>({});

  const toggleSiteDetails = (itemName: string) => {
    setOpenSiteDetails((prev) => ({
      ...prev,
      [itemName]: !prev[itemName],
    }));
  };

  // const [openAccordionIndex, setOpenAccordionIndex] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [sites, setSites] = useState<SiteInfo[]>([]);
  const [selectedItemName, setSelectedItemName] = useState('');

  const handleCheckAvailability = async (itemName: string) => {
    try {
      const response = await WebService.postPharma('inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          request: 'I_SEARCH',
          itemName,
        }),
      });

      const result = await response;

      setSelectedItemName(itemName);

      if (Array.isArray(result.message) && result.message.length > 0) {
        const siteData = result.message[0]?.sites ?? [];
        setSites(siteData);
      } else {
        setSites([]);
      }

      setOpenModal(true);
    } catch (error) {
      console.error('❌ Error checking availability:', error);
    }
  };


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

      autoFillFromExcel(jsonData, combinedOrders);
    };
    reader.readAsBinaryString(file);
  };

  const autoFillFromExcel = (excelData: any[], combinedOrders: any) => {
    const updates: typeof modifiedItems = { ...modifiedItems };

    if (!combinedOrders || !combinedOrders.combinedOrders) {
      console.error('combinedOrders is null or undefined');
      return;
    }

    // If you have multiple orders
    combinedOrders.combinedOrders.forEach((order) => {
      order.combinedItems.forEach((item) => {
        const match = excelData.find((row) =>
          row['_itemName']?.toString().toLowerCase().trim() === item.itemName?.toLowerCase().trim()
        );

        if (match) {
          const quantity = Number(match['_totalQuantity']) || 0;
          const rate = Number(match['Cost Price']) || 0;

          if (!updates[order.combinedOrderId]) updates[order.combinedOrderId] = {};

          updates[order.combinedOrderId][item.itemName] = {
            quantity,
            rate,
          };
        }
      });
    });

    setModifiedItems(updates);
  };

  


  return (
    <React.Fragment>
      <Tabs defaultValue="create-purchase-orders" className="w-full">
        <TabsList className="w-full pb-0 rounded-none px-4">
          <TabsTrigger className=" w-1/2 rounded-none" value="create-purchase-orders">
            Create Purchase Orders
          </TabsTrigger>
          <TabsTrigger className="w-1/2 rounded-none" value="view-purchase-orders">
            View Purchase Orders
          </TabsTrigger>
        </TabsList>
        <TabsContent value="create-purchase-orders">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="section">
              <div className="flex items-center gap-2 px-4 py-2">
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
                <Button
                  type="button"
                  className="flex items-center gap-2"
                  variant="secondary"
                  onClick={() => dispatch(onOpenModal())}
                >
                  Add New Vendor
                  <span>
                    <IoAddCircleOutline />
                  </span>
                </Button>
              </div>
              <hr />
              <h4 className="section-heading pl-4 py-2">Create Purchase Order</h4>
              <div className="my-4 w-full mx-2 border dark:border-slate-700">
                <div className="w-full px-4 flex items-center gap-2 py-3 border-b">
                  <div className="w-1/4 text-left px-6 ">
                    <span className="text-sm font-semibold">P.O Number</span>
                  </div>
                  <div className="w-1/4 text-left">
                    <span className="text-sm font-semibold flex items-center justify-center">Total Orders Combined</span>
                  </div>
                  <div className="w-1/4 text-left">
                    <span className="text-sm font-semibold flex items-center justify-cente">Date</span>
                  </div>
                </div>

                {isLoadingRequestOrders ? (
                  <div className="w-full flex justify-center items-center py-8">
                    <div className="flex gap-2 items-center">
                      <Loader color="text-primary" />
                      <p className="text-sm text-slate-500">Loading orders, please wait...</p>
                    </div>
                  </div>
                ) : combinedOrders?.combinedOrders?.length > 0 ? (
                  combinedOrders.combinedOrders
                    .slice()
                    .sort((a, b) => b.createdAt - a.createdAt)
                    .map((requestOrder, index) => (
                      <Accordion key={index + requestOrder.combinedOrderId} type="single" collapsible className="my-0">
                        <AccordionItem value={`item-${index}`}>
                          <AccordionTrigger
                            showIcon={false}
                            className={`hover:bg-primary hover:text-white border-b last:border-b-0 border-slate-200 group`}
                            onClick={() => handleAccordionToggle(requestOrder.combinedOrderId)}
                          >
                            <div className="px-4 w-full flex items-center gap-2">
                              <div className="w-1/4 text-left px-6">
                                <span className="text-xs ">{requestOrder.combinedOrderId.slice(0, 9)}</span>
                              </div>
                              <div className="w-1/4 flex items-center justify-center">
                                <span className="text-xs">{requestOrder.totalOrdersCombined}</span>
                              </div>
                              <div className="w-1/4 text-left flex items-center justify-cente">
                                <span className="text-xs ">
                                  {new Date(requestOrder.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <Table>
                              <TableHeader>
                                <TableRow>

                                  <TableHead className="flex items-center justify-between">
                                    <span className='mr-2'>#</span><span> Item Name</span>

                                    {/* <Button type="button" className="py-1">
                                    Create Receipt
                                  </Button> */}
                                    <TableHead className="flex items-center justify-between">
                                      <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => generateOrderItemsPDF(requestOrder.combinedOrderId)}
                                        className="text-xs"
                                      >
                                        Print Order
                                      </Button>
                                    </TableHead>
                                  </TableHead>
                                  <TableHead className="text-left">Requested Quantities</TableHead>
                                  <TableHead className="text-left">Quantity</TableHead>
                                  <TableHead className="text-left">U/M</TableHead>
                                  <TableHead className="text-left">Rate</TableHead>
                                  <TableHead className="text-left">Check Availabilit</TableHead>
                                  <TableHead className="text-left">Requested Quantities By Site</TableHead>
                                  <TableHead className="text-left">Amount</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {requestOrder.combinedItems.map((item, index) => {
                                  const modifiedItem = modifiedItems[requestOrder.combinedOrderId]?.[item.itemName];
                                  const quantity = modifiedItem?.quantity || item.quantity;
                                  const rate = modifiedItem?.rate || item.rate;
                                  const isChecked = checkedItems[requestOrder.combinedOrderId]?.[item.itemName] || false;
                                  const isItemSubmitted =
                                    submittedItems[requestOrder.combinedOrderId]?.[item.itemName] || false;

                                  return (
                                    <TableRow
                                      key={item.itemName}
                                      className={`group transition-colors duration-300 ${isItemSubmitted
                                        ? 'bg-green-50/40 dark:bg-green-900/30'
                                        : 'bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-800/40'
                                        }`}
                                    >

                                      <TableCell className="flex items-center gap-2 px-3 py-2 text-left">
                                        <span className="text-left px-3 py-2 font-medium">{index + 1})</span>
                                        <Checkbox
                                          checked={isChecked}
                                          onCheckedChange={(checked) =>
                                            handleItemCheckboxChange(
                                              requestOrder.combinedOrderId,
                                              item.itemName,
                                              checked === true,
                                            )
                                          }
                                          disabled={isItemSubmitted}
                                          className="cursor-pointer"
                                        />
                                        <span className={`${isItemSubmitted ? 'text-green-700 dark:text-green-300' : ''}`}>
                                          {item.itemName}
                                        </span>
                                      </TableCell>

                                      <TableCell className="border px-3 py-2 text-center font-semibold">{item.totalQuantity}</TableCell>

                                      <TableCell className="text-center px-3 py-2">
                                        <Input
                                          type="number"
                                          value={modifiedItems[requestOrder.combinedOrderId]?.[item.itemName]?.quantity ?? quantity ?? 0}
                                          className="w-[100px] text-xs"
                                          disabled={isItemSubmitted}
                                          min={0}
                                          onFocus={(e) => {
                                            if (Number(e.target.value) === 0) {
                                              e.target.value = ''; // Clear the "0"
                                            }
                                          }}

                                          onChange={(e) => {
                                            if (!isItemSubmitted) {
                                              handleQuantityChange(
                                                requestOrder.combinedOrderId,
                                                item.itemName,
                                                Number(e.target.value),
                                              );
                                            }
                                          }}
                                        />
                                      </TableCell>

                                      <TableCell className="text-left px-3 py-2">{item.unitOfMeasure}</TableCell>
                                      <TableCell className="text-center px-3 py-2">
                                        <Input
                                          type="number"
                                          value={modifiedItems[requestOrder.combinedOrderId]?.[item.itemName]?.rate ?? rate ?? 0}
                                          className="w-[100px] text-xs"
                                          disabled={isItemSubmitted}
                                          min={0}
                                          onFocus={(e) => {
                                            if (Number(e.target.value) === 0) {
                                              e.target.value = ''; // Clear the "0"
                                            }
                                          }}
                                          onChange={(e) => {
                                            if (!isItemSubmitted) {
                                              handleRateChange(
                                                requestOrder.combinedOrderId,
                                                item.itemName,
                                                Number(e.target.value),
                                              );
                                            }
                                          }}
                                        />
                                      </TableCell>
                                      <TableCell
                                        className="border px-3 py-2 cursor-pointer select-none user-select-none"
                                        onClick={() => toggleSiteDetails(item.itemName)}
                                        title="Toggle Site Quantities"
                                      >
                                        <div className="flex items-center gap-1 font-semibold text-sm">
                                          <span className="transition-transform duration-200 ease-in-out transform">
                                            {openSiteDetails[item.itemName] ? '▼' : '▶'}
                                          </span>
                                          <span>Site Quantities</span>
                                        </div>

                                        {openSiteDetails[item.itemName] && (
                                          <Table className="w-full text-xs border border-gray-300 rounded mt-2">
                                            <TableHeader className="bg-gray-50 dark:bg-gray-800">
                                              <TableRow>
                                                <TableHead className="text-left px-2 py-1 border-b border-gray-300">Site</TableHead>
                                                <TableHead className="text-left px-2 py-1 border-b border-gray-300">Quantity</TableHead>
                                              </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                              {Object.entries(item.siteQuantities).map(([site, qty], i) => (
                                                <TableRow key={i} className="odd:bg-gray-100 even:bg-gray-50 dark:odd:bg-gray-700 dark:even:bg-gray-800">
                                                  <TableCell className="px-2 py-1 border-t border-gray-200">{site}</TableCell>
                                                  <TableCell className="px-2 py-1 border-t border-gray-200 text-center">
                                                    {qty != null ? String(qty) : ''}
                                                  </TableCell>
                                                </TableRow>
                                              ))}
                                            </TableBody>
                                          </Table>
                                        )}
                                      </TableCell>

                                      <TableCell className="border px-3 py-2 text-center">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="px-3 py-1"
                                          onClick={() => handleCheckAvailability(item.itemName)}
                                          disabled={isItemSubmitted}
                                        >
                                          Check Availability
                                        </Button>
                                      </TableCell>



                                      <TableCell className="text-center px-3 py-2 font-semibold">
                                        {((Number(rate) || 0) * (Number(quantity) || 0)) > 0
                                          ? ((Number(rate) || 0) * (Number(quantity) || 0)).toLocaleString('en-US', {
                                            style: 'currency',
                                            currency: 'UGX',
                                          })
                                          : 'UGX 0'}
                                      </TableCell>
                                    </TableRow>
                                  );
                                })}
                                {/* Added items section (new items not in the original request) */}
                                {addedItems[requestOrder.combinedOrderId]?.length > 0 && (
                                  <>
                                    <TableRow>
                                      <TableCell colSpan={5} className="text-left font-medium py-2 bg-slate-100">
                                        Additional Items
                                      </TableCell>
                                    </TableRow>
                                    {addedItems[requestOrder.combinedOrderId].map((item, index) => {
                                      const itemKey = `added-${index}`;
                                      const isItemSubmitted = submittedItems[requestOrder.combinedOrderId]?.[itemKey] || false;

                                      return (
                                        <TableRow
                                          key={`added-${index}`}
                                          className={isItemSubmitted ? 'bg-green-50/30 dark:bg-green-950/20' : ''}
                                        >
                                          <TableCell className="text-left">
                                            <span>{item.itemRef.fullName}</span>
                                          </TableCell>
                                          {/* <TableCell className="text-left">{item.unitOfMeasure}</TableCell> */}
                                          <TableCell className="text-center">
                                            <Input
                                              value={item.quantity}
                                              disabled={isItemSubmitted}
                                              className={`w-[100px] text-xs`}
                                              onChange={(e) => {
                                                if (!isItemSubmitted) {
                                                  const newQuantity = Number(e.target.value);
                                                  const updatedItems = [...(addedItems[requestOrder.combinedOrderId] || [])];
                                                  updatedItems[index] = {
                                                    ...updatedItems[index],
                                                    quantity: newQuantity,
                                                  };
                                                  setAddedItems((prev) => ({
                                                    ...prev,
                                                    [requestOrder.combinedOrderId]: updatedItems,
                                                  }));
                                                }
                                              }}
                                            />
                                          </TableCell>
                                          <TableCell className="text-center">
                                            <Input
                                              value={item.rate}
                                              className={`w-[100px] text-xs`}
                                              disabled={isItemSubmitted}
                                              onChange={(e) => {
                                                if (!isItemSubmitted) {
                                                  const newRate = Number(e.target.value);
                                                  const updatedItems = [...(addedItems[requestOrder.combinedOrderId] || [])];
                                                  updatedItems[index] = {
                                                    ...updatedItems[index],
                                                    rate: newRate,
                                                  };
                                                  setAddedItems((prev) => ({
                                                    ...prev,
                                                    [requestOrder.combinedOrderId]: updatedItems,
                                                  }));
                                                }
                                              }}
                                            />
                                          </TableCell>
                                          <TableCell className=" flex items-center gap-2">
                                            {(item.quantity * item.rate).toLocaleString('en-US', {
                                              style: 'currency',
                                              currency: 'UGX',
                                            })}
                                            {!isItemSubmitted && (
                                              <IoTrash
                                                onClick={() => handleRemoveAddedItem(requestOrder.combinedOrderId, index)}
                                                className="text-red-500 cursor-pointer hover:text-red-600 hover:bg-red-100"
                                              />
                                            )}
                                          </TableCell>
                                        </TableRow>
                                      );
                                    })}
                                  </>
                                )}

                                {/* POComboBox for adding new items */}
                                <POComboBox
                                  data={inventoryAsPurchaseOrderProducts}
                                  selectedItem={selectedComboItem}
                                  onItemSelect={(item) => {
                                    setSelectedComboItem(item);
                                  }}
                                  onAmountChange={(amount) => {
                                    console.log('Amount changed:', amount);
                                  }}
                                  onQuantityChange={(quantity) => {
                                    if (selectedComboItem) {
                                      setSelectedComboItem({
                                        ...selectedComboItem,
                                        quantity,
                                      });
                                    }
                                  }}
                                  onRateChange={(rate) => {
                                    if (selectedComboItem) {
                                      setSelectedComboItem({
                                        ...selectedComboItem,
                                        rate,
                                      });
                                    }
                                  }}
                                />

                                {/* Add button */}
                                {selectedComboItem && (
                                  <TableRow>
                                    <TableCell colSpan={5} className="text-right">
                                      <Button variant="outline" size="sm" onClick={handleAddNewItem}>
                                        Add Item to Purchase Order
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                )}
                              </TableBody>
                              {openModal && (
                                <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
                                  <div className="bg-white rounded shadow-lg p-4 w-96 max-h-[80vh] overflow-y-auto">
                                    <h2 className="text-lg font-semibold mb-2">Availability for {selectedItemName}</h2>
                                    {sites.length === 0 ? (
                                      <p>No site availability found.</p>
                                    ) : (
                                      <Table className="w-full text-sm border-collapse border border-gray-300">
                                        <TableHeader className="bg-gray-100">
                                          <TableRow>
                                            <TableHead className="border border-gray-300 px-3 py-2 text-left">Site Name</TableHead>
                                            <TableHead className="border border-gray-300 px-3 py-2 text-left">Site ID</TableHead>
                                            <TableHead className="border border-gray-300 px-3 py-2 text-left">Quantity Onsite</TableHead>
                                          </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                          {sites.map((site, idx) => (
                                            <TableRow key={idx} className="odd:bg-white even:bg-gray-50">
                                              <TableCell className="border border-gray-300 px-3 py-2">{site.siteName}</TableCell>
                                              <TableCell className="border border-gray-300 px-3 py-2">{site.siteId}</TableCell>
                                              <TableCell className="border border-gray-300 px-3 py-2">{site.quantityOnsite}</TableCell>
                                            </TableRow>
                                          ))}
                                        </TableBody>
                                      </Table>
                                    )}
                                    <div className="text-right mt-4">
                                      <Button onClick={() => setOpenModal(false)}>Close</Button>
                                    </div>
                                  </div>
                                </div>
                              )}

                              <TableFooter>
                                <TableRow>
                                  <TableCell className="flex items-center gap-6">
                                    {/* {submittedOrders[requestOrder.orderId] && ( */}
                                    <>
                                      <span>
                                        <span className="pr-2 font-medium">Total Items Selected:</span>
                                        {calculateOrderTotals(requestOrder.combinedOrderId).totalItems}
                                      </span>
                                      <span>
                                        <span className="pr-2 font-medium">Total Amount:</span>
                                        {calculateOrderTotals(requestOrder.combinedOrderId).totalAmount.toLocaleString(
                                          'en-US',
                                          {
                                            style: 'currency',
                                            currency: 'UGX',
                                          },
                                        )}
                                      </span>
                                    </>
                                    {/* )} */}
                                  </TableCell>
                                  <TableCell colSpan={4} className="text-right">
                                    <Button type="button" onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting}>
                                      {isSubmitting ? 'Submitting...' : 'Submit Order'}
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              </TableFooter>
                            </Table>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    ))
                ) : (
                  <div className="flex items-center justify-center py-4">No Request Orders Found</div>
                )}
              </div>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="view-purchase-orders">
          <div className="section">
            <div className="flex items-center justify-end p-2">
              <Button variant="outline" type="button" onClick={() => dispatch(fetchPurchaseOrders())}>
                <RefreshCw size={16} />
                <span className="px-1">Refresh</span>
              </Button>
            </div>
            <div className="my-4 mx-2 border dark:border-slate-700">
              <div className="w-full px-4 flex items-center gap-2 py-3 border-b">
                <div className="w-1/4 text-left">
                  <span className="text-sm font-semibold">#</span>
                  <span className="text-sm font-semibold">P.O Number</span>
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
                  <span className="text-sm font-semibold ">Expected Date</span>
                </div>
                <div className="w-1/4 text-left">
                  <span className="text-sm font-semibold ">Created By</span>
                </div>
              </div>
            </div>
            {isLoading ? (
              <div className="w-full flex justify-center items-center py-8">
                <div className="flex gap-2 items-center">
                  <Loader color="text-primary" />
                  <p className="text-sm text-slate-500">Loading orders, please wait...</p>
                </div>
              </div>
            ) : purchaseOrders && purchaseOrders.length > 0 ? (
              purchaseOrders
                .slice()
                .sort((a, b) => b.timeModified - a.timeModified)
                .map((order, index) => (
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
                            <span className="text-xs ">{formatTimestamp(order.timeModified)}</span>
                          </div>
                          <div className="w-1/4 text-left">
                            <span className="text-xs ">{order.vendorRef.fullName}</span>
                          </div>
                          <div className="w-1/4 text-left">
                            <span className="text-xs ">{formatTimestamp(order.expectedDate)}</span>
                          </div>
                          <div className="w-1/4 text-left">
                            <span className="text-xs ">{order.dispenser?.name}</span>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="mx-4 my-2 bg-white border border-slate-200 shadow-sm rounded-md">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="flex items-center justify-between">
                                  <span>#</span>
                                  <span>Item</span>
                                  {/* <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => generateOrderItemsPDF()}
                                    className="text-xs"
                                  >
                                    Print Order
                                  </Button> */}
                                </TableHead>
                                <TableHead className="text-left">U/M</TableHead>
                                <TableHead className="text-left">Rate</TableHead>
                                <TableHead className="text-left">Amount</TableHead>
                                <TableHead className="text-left">Qty</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody className="mt-6">
                              {order && order?.purchaseOrderLineRet?.length > 0 ? (
                                <>
                                  {order?.purchaseOrderLineRet?.map((item, index) => {
                                    return (
                                      <TableRow key={item.txnLineID}>
                                        <TableCell className="pr-0 w-[400px]"> <span>{index + 1}</span><span>{item.itemRef?.fullName ?? 'Unnamed Item'}</span></TableCell>
                                        <TableCell className="pl-0">{item.unitOfMeasure}</TableCell>
                                        <TableCell>{formatCurrency(item.rate, false)}</TableCell>
                                        <TableCell>{formatCurrency(item.amount)}</TableCell>
                                        <TableCell className="pl-0">{item.quantity}</TableCell>
                                      </TableRow>
                                    );
                                  })}
                                </>
                              ) : (
                                <div className="text-center py-4">No products found</div>
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ))
            ) : (
              <div className="flex items-center justify-center py-4">No Purchase Orders Found</div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      <div className="my-4">
        <label htmlFor="excel-upload" className="block text-sm font-medium mb-1">Upload Excel to Autofill</label>
        <Input type="file" accept=".xlsx, .xls" id="excel-upload" onChange={handleFileUpload} />
      </div>

      {showModalState && (
        <Modal title="Create vendor">
          <CreateVendorForm />
        </Modal>
      )}
    </React.Fragment>
  );
};

export default PurchaseOrderEdit;
