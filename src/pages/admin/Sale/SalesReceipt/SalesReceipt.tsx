import React, { useEffect, useMemo, useReducer, useState } from 'react';
import { toast } from 'sonner';
import { FilterIcon, AlertCircle } from 'lucide-react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Table,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Button,
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  MultiSelectDropdown,
  Input,
  Loader,
  DatePickerWithRange,
} from '@/components';
import Pagination from '@/components/pagination/Pagination';
import { RootState } from '@/store/store';
import SRComboBox, { InventoryProduct } from './SRComboBox';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { formatCurrency, formatTimestamp } from '@/utils/formatter';
import { isShiftActive } from '@/utils/shiftUtils';
import { fetchSales, fetchCashiers, updateFilterParams, FilterParams } from './salesReceiptSlice';
import {
  customerTypes,
  multiPaymentMethodsOptions,
  filterSalesBy,
  cashierFilterOptions,
  singlePaymentMethods,
  reducer,
} from './constants';
import useRolesAndPermissions from '@/utils/rolesAndPermissions';
import { selectUserProfile, selectUserType } from '@/pages/auth/authSlice';
import { WebService } from '@/web-services/WebService';

export interface SelectedInventoryProduct extends InventoryProduct {
  quantitySold: number;
  amountPaid: number;
  customUnitPrice?: number; // Optional custom unit price if user modifies it
}

const SalesReceipt: React.FC = () => {
  // Initialize reducer with initial state
  // Calculate default date range for cashiers (today to 7 days ago)
  const today = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 7);
  const shiftActiveStart = Boolean(localStorage.getItem("shift_id"));
  const DispenserTest = localStorage.getItem('adsRole');
  const dispenserShow = DispenserTest === 'DISPENSER';
  const { VIEW_ALL_SALES_PERMISSIONS } = useRolesAndPermissions();
  const [activeTab, setActiveTab] = useState('make-sale');

  // Set initial state based on user role
  const [state, stateDispatch] = useReducer(reducer, {
    customerType: '',
    payments: [],
    selectedPaymentMethods: [],
    selectedPaymentMethod: '',
    currentAmountPaid: 0,
    paymentAmount: 0,
    currentUnitPrice: 0,
    currentQuantity: 0,
    isSubmitting: false,
    selectedCashier: '',
    customerTypeFilter: '',
    filterBy: VIEW_ALL_SALES_PERMISSIONS ? 'All Sites' : 'Date', // Default to Date filter for cashiers
    startDate: VIEW_ALL_SALES_PERMISSIONS ? undefined : sevenDaysAgo, // Set default date range for cashiers
    endDate: VIEW_ALL_SALES_PERMISSIONS ? undefined : today,
    errors: {},
    selectedItems: [],
    currentItem: null,
    formError: '',
    selectedSite: null,
    shiftActive: isShiftActive(), // Initialize with current shift status
  });

  // Extract values from state
  const {
    customerType,
    payments,
    selectedPaymentMethods,
    selectedPaymentMethod,
    currentAmountPaid,
    paymentAmount,
    currentUnitPrice,
    currentQuantity,
    isSubmitting,
    selectedCashier,
    customerTypeFilter,
    filterBy,
    startDate,
    endDate,
    errors,
    selectedItems,
    currentItem,
    formError,
    selectedSite,
    shiftActive,
  } = state;

  const sites = useAppSelector((state: RootState) => state.bill?.sites || []);
  const sales = useAppSelector((state: RootState) => (state as RootState).sales.sales || []);
  const cashiers = useAppSelector((state: RootState) => state.sales.cashiers || []);
  const isLoadingSales = useAppSelector((state: RootState) => state.sales.loading);
  const errorSales = useAppSelector((state: RootState) => state.sales.error);
  const storeDispatch = useAppDispatch();
  const userProfile = useAppSelector(selectUserProfile);
  const userType = useAppSelector(selectUserType);
  const phoneNumber = localStorage.getItem('account_id') || '';
  // const siteId = userProfile?.ads.station[0];
  // const siteName = sites && sites?.find((site) => site.tillNo === siteId)?.name;
  const dispenserName = localStorage.getItem('firstName') || '';
  const userRole = localStorage.getItem('adsRole')
  const isDispenser = userRole === 'DISPENSER';
  const siteName = localStorage.getItem('facilityName');
  const siteId = localStorage.getItem('adsStation')
  const shiftId = Boolean(localStorage.getItem("shift_id"));
  // Simple effect to check shift status initially
  useEffect(() => {
    // Check once on component mount
    const initialStatus = isShiftActive();
    stateDispatch({ type: 'SET_SHIFT_ACTIVE', payload: initialStatus });
  }, []);

  // Separate effect to handle localStorage changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'shiftStatus') {
        console.log('Shift status changed in localStorage');
        const currentStatus = isShiftActive();
        stateDispatch({ type: 'SET_SHIFT_ACTIVE', payload: currentStatus });
      }
    };

    // Add event listener for storage changes (works for cross-tab changes)
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Manual check for shift status changes
  useEffect(() => {
    // We need to manually poll for header toggle changes in the same tab
    let previousShiftId = localStorage.getItem('shift_id');

    const checkShiftChange = () => {
      const currentShiftId = localStorage.getItem('shift_id');
      if (previousShiftId !== currentShiftId) {
        console.log('Detected shiftId change:', previousShiftId, '->', currentShiftId);
        previousShiftId = currentShiftId;
        stateDispatch({ type: 'SET_SHIFT_ACTIVE', payload: isShiftActive() });
      }
    };

    const intervalId = setInterval(checkShiftChange, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {

    storeDispatch(fetchCashiers());

    // Apply default filters based on user role
    if (VIEW_ALL_SALES_PERMISSIONS) {
      // For admin and other privileged users, show all sales
      storeDispatch(fetchSales({ filterBy: 'ALL_SITES' }));
    } else {
      // For cashiers/dispensers, set default date range filter (7 days)
      storeDispatch(
        fetchSales({
          filterBy: 'S_DATE',
          filterDate: {
            startTime: sevenDaysAgo.getTime(),
            endTime: today.getTime(),
          },
        }),
      );
    }
  }, [storeDispatch, VIEW_ALL_SALES_PERMISSIONS]);

  const handleFilter = () => {
    if (!validateFields()) return;

    let params: FilterParams = { filterBy: '' };

    if (isDispenser && siteId) {
      params = {
        ...params,
        siteId: siteId,
      };
    }

    switch (filterBy) {
      case 'All Sites & Date':
        if (!startDate || !endDate) return;
        params = {
          filterBy: 'ALL_SITES_DATE',
          filterDate: {
            startTime: startDate.getTime(),
            endTime: endDate.getTime(),
          },
        };
        break;
      case 'Date':
        if (!startDate || !endDate) return;
        params = {
          filterBy: 'S_DATE',
          filterDate: {
            startTime: startDate.getTime(),
            endTime: endDate.getTime(),
          },
        };
        break;
      case 'Site':
        if (!selectedSite) return;
        params = {
          filterBy: 'S_SITE',
          siteName: selectedSite.name,
          siteId: selectedSite.tillNo,
        };
        break;
      case 'Site & Date':
        if (!selectedSite || !startDate || !endDate) return;
        params = {
          filterBy: 'SITE_DATE',
          siteName: selectedSite.name,
          siteId: selectedSite.tillNo,
          filterDate: {
            startTime: startDate.getTime(),
            endTime: endDate.getTime(),
          },
        };
        break;
      case 'Cashier':
        if (!selectedCashier) return;
        const cashier = cashiers.find((c) => c.phone === selectedCashier);
        if (!cashier) return;
        params = {
          filterBy: 'CASHIER_ALL_SITES',
          cashier: {
            accountId: cashier.phone,
          },
        };
        break;
      case 'Cashier & Date':
        if (!selectedCashier || !startDate || !endDate) return;
        const cashierDate = cashiers.find((c) => c.phone === selectedCashier);
        if (!cashierDate) return;
        params = {
          filterBy: 'CASHIER_ALL_SITES_DATE',
          cashier: {
            accountId: cashierDate.phone,
          },
          filterDate: {
            startTime: startDate.getTime(),
            endTime: endDate.getTime(),
          },
        };
        break;
      case 'Payment Method':
        if (!selectedPaymentMethod) return;
        params = {
          filterBy: 'S_PAYMENT',
          payment: [
            {
              modeOfPayment: selectedPaymentMethod,
            },
          ],
        };

        break;
      case 'Payment Method & Date':
        if (!selectedPaymentMethod || !startDate || !endDate) return;
        params = {
          filterBy: 'S_PAYMENT_DATE',
          payment: [
            {
              modeOfPayment: selectedPaymentMethod,
            },
          ],
          filterDate: {
            startTime: startDate.getTime(),
            endTime: endDate.getTime(),
          },
        };
        break;
      case 'Customer Type':
        if (!customerTypeFilter) return;
        params = {
          filterBy: 'S_CUSTOMER',
          customerName: customerTypeFilter,
        };
        console.log('customer type params', params);
        break;
      case 'Customer Type & Date':
        if (!customerTypeFilter || !startDate || !endDate) return;
        params = {
          filterBy: 'S_CUSTOMER_DATE',
          customerName: customerTypeFilter,
          filterDate: {
            startTime: startDate.getTime(),
            endTime: endDate.getTime(),
          },
        };
        break;
      default:
        params = {
          filterBy: 'ALL_SITES',
        };
    }

    storeDispatch(updateFilterParams(params));
    storeDispatch(fetchSales(params));
  };

  const validateFields = () => {
    const newErrors: typeof errors = {};

    switch (filterBy) {
      case 'All Sites & Date':
        if (!startDate || !endDate) {
          newErrors.date = 'Please select both start and end dates';
        }
        break;
      case 'Date':
        if (!startDate || !endDate) {
          newErrors.date = 'Please select both start and end dates';
        }
        break;
      case 'Site':
        if (!selectedSite) {
          newErrors.site = 'Please select a site';
        }
        break;
      case 'Site & Date':
        if (!selectedSite) {
          newErrors.site = 'Please select a site';
        }
        if (!startDate || !endDate) {
          newErrors.date = 'Please select both start and end dates';
        }
        break;
      case 'Cashier':
        if (!selectedCashier) {
          newErrors.cashier = 'Please select a cashier';
        }
        break;
      case 'Cashier & Date':
        if (!selectedCashier) {
          newErrors.cashier = 'Please select a cashier';
        }
        if (!startDate || !endDate) {
          newErrors.date = 'Please select both start and end dates';
        }
        break;
      case 'Payment Method':
        if (!selectedPaymentMethod) {
          newErrors.payment = 'Please select a payment method';
        }
        break;
      case 'Payment Method & Date':
        if (!selectedPaymentMethod) {
          newErrors.payment = 'Please select a payment method';
        }
        if (!startDate || !endDate) {
          newErrors.date = 'Please select both start and end dates';
        }
        break;
      case 'Customer Type':
        if (!customerTypeFilter) {
          newErrors.customerTypeFilter = 'Please select a customer type';
        }
        break;
      case 'Customer Type & Date':
        if (!customerTypeFilter) {
          newErrors.customerTypeFilter = 'Please select a customer type';
        }
        if (!startDate || !endDate) {
          newErrors.date = 'Please select both start and end dates';
        }
        break;
      default:
        break;
    }

    stateDispatch({ type: 'SET_ERRORS', payload: newErrors });
    return Object.keys(newErrors).length === 0;
  };

  // Handle adding an item to the sales list
  const handleAddItem = (item: InventoryProduct | null) => {
    if (!item) return;
    stateDispatch({ type: 'SET_CURRENT_ITEM', payload: item });
  };

  // Handle quantity change for current item
  const handleQuantityChange = (quantity: number) => {
    stateDispatch({ type: 'SET_CURRENT_QUANTITY', payload: quantity });
  };

  // Handle unit price change for current item
  const handleUnitPriceChange = (price: number) => {
    stateDispatch({ type: 'SET_CURRENT_UNIT_PRICE', payload: price });
  };

  // Add the current item to the sales list
  const addItemToList = () => {
    if (!currentItem) {
      stateDispatch({ type: 'SET_FORM_ERROR', payload: 'Please select an item to add' });
      return;
    }

    if (currentQuantity <= 0) {
      stateDispatch({ type: 'SET_FORM_ERROR', payload: 'Please enter a valid quantity' });
      return;
    }

    // Check if item already exists in the selectedItems list
    const isDuplicate = selectedItems.some((item) => item.itemId === currentItem.itemId);
    if (isDuplicate) {
      toast.error('This item is already in your list', {
        description: 'You cannot add the same item multiple times',
      });
      return;
    }

    // Clear any existing error
    stateDispatch({ type: 'CLEAR_FORM_ERROR' });

    // Create a new sales item
    const newItem: SelectedInventoryProduct = {
      ...currentItem,
      quantitySold: currentQuantity,
      amountPaid: currentAmountPaid,
      customUnitPrice: currentUnitPrice > 0 ? currentUnitPrice : currentItem.salesPrice,
    };

    // Add item to list
    stateDispatch({ type: 'ADD_SELECTED_ITEM', payload: newItem });

    // Reset current values
    stateDispatch({ type: 'SET_CURRENT_ITEM', payload: null });
    stateDispatch({ type: 'SET_CURRENT_QUANTITY', payload: 0 });
    stateDispatch({ type: 'SET_CURRENT_UNIT_PRICE', payload: 0 });
    stateDispatch({ type: 'SET_CURRENT_AMOUNT_PAID', payload: 0 });
  };

  // Remove an item from the list
  const removeItem = (index: number) => {
    const newItems = [...selectedItems];
    newItems.splice(index, 1);
    stateDispatch({ type: 'SET_SELECTED_ITEMS', payload: newItems });
  };

  // Calculate total expected amount from payments
  const calculateTotalExpectedAmount = () => {
    return selectedItems.reduce((total, item) => total + item.customUnitPrice * item.quantitySold, 0);
  };


  // Calculate total expected amount from payments
  const calculateTotalEnteredAmount = () => {
    return payments.reduce((total, payment) => total + payment.amountPaid, 0);
  };


  const remainingAmount = calculateTotalExpectedAmount() - calculateTotalEnteredAmount();

  const handlePaymentAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    const expectedTotal = calculateTotalExpectedAmount();
    const enteredTotal = calculateTotalEnteredAmount();
    const remainingAmount = expectedTotal - enteredTotal;

    if (value <= remainingAmount) {
      stateDispatch({ type: 'SET_PAYMENT_AMOUNT', payload: value });
    } else {
      toast.error(`You can only pay up to UGX ${remainingAmount.toLocaleString()}`);
    }
  };


  const handlePaymentMethodChange = (selectedValues: string[]) => {
    stateDispatch({ type: 'SET_SELECTED_PAYMENT_METHODS', payload: selectedValues });
    stateDispatch({ type: 'FILTER_PAYMENTS', payload: selectedValues });
  };

  const handleAddPayment = () => {
    if (paymentAmount <= 0 || selectedPaymentMethods.length === 0) return;

    // Create/update payments only for newly selected methods without overwriting existing ones
    const newPayments = selectedPaymentMethods
      .filter((method) => !payments.some((p) => p.modeOfPayment === method))
      .map((method) => ({
        amountPaid: paymentAmount,
        modeOfPayment: method,
        transactionId: '',
      }));

    // Calculate what the total WILL BE after update
    const futurePayments = [...payments, ...newPayments];
    const futureTotal = futurePayments.reduce((total, p) => total + p.amountPaid, 0);

    stateDispatch({ type: 'ADD_PAYMENTS', payload: newPayments });
    stateDispatch({ type: 'SET_PAYMENT_AMOUNT', payload: 0 });
    // stateDispatch({ type: 'CLEAR_SELECTED_PAYMENT_METHODS' });

    // Compare against expected amount
    const expectedTotal = calculateTotalExpectedAmount();

    if (futureTotal < expectedTotal) {
      toast.error(`Entered total is less by Ugx ${formatCurrency(expectedTotal - futureTotal)}`);
    } else if (futureTotal > expectedTotal) {
      toast.error(`Entered total exceeds by Ugx ${formatCurrency(futureTotal - expectedTotal)}`);
    } else {
      toast.success('Ready to submit');
    }


  };

  const currentTotal = payments.reduce((total, p) => total + p.amountPaid, 0);

  const capitalizeName = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  const handleClearFilters = () => {
    // Reset filter selection to default based on user role
    stateDispatch({ type: 'SET_FILTER_BY', payload: isDispenser ? 'Date' : VIEW_ALL_SALES_PERMISSIONS ? 'All Sites' : 'Date' });

    // Reset date range - for cashiers and dispensers, set to last 7 days
    if (VIEW_ALL_SALES_PERMISSIONS && !isDispenser) {
      stateDispatch({ type: 'SET_START_DATE', payload: undefined });
      stateDispatch({ type: 'SET_END_DATE', payload: undefined });
    } else {
      stateDispatch({ type: 'SET_START_DATE', payload: sevenDaysAgo });
      stateDispatch({ type: 'SET_END_DATE', payload: today });
    }

    // Reset site selection
    stateDispatch({ type: 'SET_SELECTED_SITE', payload: null });

    // Reset cashier selection
    stateDispatch({ type: 'SET_SELECTED_CASHIER', payload: '' });

    // Reset payment method
    stateDispatch({ type: 'SET_SELECTED_PAYMENT_METHOD', payload: '' });

    // Reset customer type
    stateDispatch({ type: 'SET_CUSTOMER_TYPE_FILTER', payload: '' });

    // Clear all validation errors
    stateDispatch({ type: 'CLEAR_ERRORS' });

    // Reset filter parameters in Redux store based on user role
    if (isDispenser) {
      const site = sites.find((s) => s.tillNo === siteId);
      if (site) {
        const params = {
          filterBy: 'S_SITE',
          siteName: site.name,
          siteId: site.tillNo,
        };
        storeDispatch(updateFilterParams(params));
        storeDispatch(fetchSales(params));
      } else {
        const params = {
          filterBy: 'S_DATE',
          filterDate: {
            startTime: sevenDaysAgo.getTime(),
            endTime: today.getTime(),
          },
        };
        storeDispatch(updateFilterParams(params));
        storeDispatch(fetchSales(params));
      }
    } else if (VIEW_ALL_SALES_PERMISSIONS) {
      storeDispatch(updateFilterParams({ filterBy: 'ALL_SITES' }));
      storeDispatch(fetchSales({ filterBy: 'ALL_SITES' }));
    } else {
      // For cashiers, use date range filter
      const params = {
        filterBy: 'S_DATE',
        filterDate: {
          startTime: sevenDaysAgo.getTime(),
          endTime: today.getTime(),
        },
      };
      storeDispatch(updateFilterParams(params));
      storeDispatch(fetchSales(params));
    }
  };

  const onSubmit = async () => {
    stateDispatch({ type: 'SET_IS_SUBMITTING', payload: true });
    stateDispatch({ type: 'SET_FORM_ERROR', payload: '' });

    // Check if shift is active for dispensers
    if (isDispenser && !shiftActiveStart) {
      toast.error('Cannot create sale', {
        description: 'You must start a shift before making sales',
      });
      stateDispatch({ type: 'SET_IS_SUBMITTING', payload: false });
      return;
    }

    // Validate form fields
    if (!customerType) {
      stateDispatch({ type: 'SET_FORM_ERROR', payload: 'Please select a customer type' });
      stateDispatch({ type: 'SET_IS_SUBMITTING', payload: false });
      return;
    }

    if (selectedItems.length === 0) {
      toast.error('Please add at least one item');
      stateDispatch({ type: 'SET_IS_SUBMITTING', payload: false });
      return;
    }

    const loadingToast = toast.loading('Creating sale...', {
      description: 'Please wait while we process your request',
    });

    try {
      const requestPayload = {
        request: 'S_CREATE',
        customerName: customerType,
        salesItems: selectedItems.map((item) => ({
          itemId: item.itemId,
          itemName: item.itemName,
          quantity: item.quantitySold,
          unitPrice: item.customUnitPrice || item.salesPrice,
          unitOfMeasure: item.unisOfMeasure?.find((u) => u.sublevel === 0)?.fullName || '---',
        })),
        payment: payments,
        cashier: {
          accountId: phoneNumber,
          name: dispenserName,
        },
        siteName,
        siteId,
      };


      // Send request to API
      const response = await WebService.postPharma('sales', requestPayload);

      console.log('Submitting sale:', requestPayload);

      if (response && response.status) {
        toast.dismiss(loadingToast);
        toast.success('Sale created successfully', {
          description: 'Your sale has been recorded',
        });

        // Refresh sales data based on current filter or default settings
        const filterParams = isDispenser
          ? {
            filterBy: 'S_SITE',
            siteName,
            siteId,
          }
          : VIEW_ALL_SALES_PERMISSIONS
            ? { filterBy: 'ALL_SITES' }
            : {
              filterBy: 'S_DATE',
              filterDate: {
                startTime: sevenDaysAgo.getTime(),
                endTime: today.getTime(),
              },
            };
        storeDispatch(fetchSales(filterParams));

        // Reset form fields
        stateDispatch({ type: 'CLEAR_SELECTED_ITEMS' });
        stateDispatch({ type: 'SET_CUSTOMER_TYPE', payload: '' });
        stateDispatch({ type: 'CLEAR_PAYMENTS' });
        stateDispatch({ type: 'CLEAR_SELECTED_PAYMENT_METHODS' });
        stateDispatch({ type: 'SET_CURRENT_ITEM', payload: null });
        stateDispatch({ type: 'SET_CURRENT_QUANTITY', payload: 0 });
        stateDispatch({ type: 'SET_CURRENT_UNIT_PRICE', payload: 0 });
        stateDispatch({ type: 'SET_CURRENT_AMOUNT_PAID', payload: 0 });
        stateDispatch({ type: 'SET_FORM_ERROR', payload: '' });  // Reset any form errors

        // Reset the phone number input field (this is what you were missing)
        setPhoneNumberInput('');  // This clears the phone number input field
        setActiveTab('see-sales');
      } else {
        toast.dismiss(loadingToast);
        toast.error('Failed to create sale', {
          description: response?.message || 'Please try again later',
        });
      }
    } catch (error: any) {
      console.error('Sale creation error:', error);
      toast.dismiss(loadingToast);
      toast.error('Failed to create sale', {
        description: error.message || 'Please try again later',
      });
    } finally {
      stateDispatch({ type: 'SET_IS_SUBMITTING', payload: false });
    }
  };



  const handleClearForm = () => {
    // Reset selected items and customer type
    stateDispatch({ type: 'CLEAR_SELECTED_ITEMS' });
    stateDispatch({ type: 'SET_CUSTOMER_TYPE', payload: '' });
    stateDispatch({ type: 'CLEAR_PAYMENTS' });

    // Reset current item being added
    stateDispatch({ type: 'SET_CURRENT_ITEM', payload: null });
    stateDispatch({ type: 'SET_CURRENT_QUANTITY', payload: 0 });
    stateDispatch({ type: 'SET_CURRENT_UNIT_PRICE', payload: 0 });
    stateDispatch({ type: 'SET_CURRENT_AMOUNT_PAID', payload: 0 });
  };

  const [phoneNumberInPut, setPhoneNumberInput] = React.useState('');



  return (
    <React.Fragment>
      {dispenserShow && !shiftActiveStart ? (
        <div className="h-full flex items-center justify-center ">
          <div className=" mb-4 p-8 border shadow  text-red-700 bg-red-100 border-red-700 dark:text-red-500 dark:border-red-500 rounded flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            <p className="text-sm font-semibold">
              You must start a shift before you can make sales. Please use the shift toggle in the header.
            </p>
          </div>
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="make-sale">Make Sale</TabsTrigger>
            <TabsTrigger value="see-sales">See Sales</TabsTrigger>
          </TabsList>
          <TabsContent value="make-sale">
            <form onSubmit={onSubmit} className="section pb-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-4 py-2">
                <div className="">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold">Customer Type:</span>
                    <Select
                      value={customerType}
                      onValueChange={(value) => stateDispatch({ type: 'SET_CUSTOMER_TYPE', payload: value })}
                    >
                      <SelectTrigger className="w-[160px] sm:w-[180px]">
                        <SelectValue className="text-xs" placeholder="Select customer type..." />
                      </SelectTrigger>
                      <SelectContent>
                        {customerTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <label htmlFor="phoneNumber" className="text-xs font-semibold">
                    Phone Number:
                  </label>
                  <input
                    id="phoneNumber"
                    type="tel"
                    className="w-[160px] sm:w-[180px] text-xs border rounded px-2 py-1"
                    placeholder="Enter phone number"
                    value={phoneNumberInPut}
                    onChange={(e) => setPhoneNumberInput(e.target.value)}
                  />
                </div>


                <div className="flex flex-col gap-1 w-full sm:w-auto">
                  <span className="text-xs font-semibold">Payment Method:</span>
                  <MultiSelectDropdown
                    options={multiPaymentMethodsOptions}
                    onChange={handlePaymentMethodChange}
                    isDisabled={selectedItems.length === 0}
                    value={selectedPaymentMethods}
                  />
                </div>

                <div className="flex flex-col gap-1 w-full sm:w-auto">
                  <div>
                    <span className="text-xs font-semibold">Amount Paid:</span>
                    <Input
                      className="w-full text-xs"
                      value={paymentAmount}
                      onChange={handlePaymentAmountChange}
                      placeholder="0"
                      min={1}
                      disabled={
                        selectedItems.length === 0 ||
                        selectedPaymentMethods.length === 0 ||
                        calculateTotalExpectedAmount() - calculateTotalEnteredAmount() <= 0
                      }
                    />

                  </div>
                  <div>
                    <span className="font-semibold text-xs">Total Recorded Ugx: </span>
                    {calculateTotalEnteredAmount().toLocaleString()}
                  </div>
                </div>

                <div>
                  <Button
                    type="button"
                    className="text-xs p-2 mt-2 sm:mt-6 bg-primary-dark text-white hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
                    disabled={selectedItems.length === 0 || paymentAmount === 0 || selectedPaymentMethods.length === 0}
                    onClick={handleAddPayment}
                  >
                    Add Payment
                  </Button>
                </div>
              </div>


              <div className="mx-2 mt-4">
                {/* Desktop and tablet view */}
                <div className="w-full overflow-hidden sm:overflow-visible">
                  <Table className="w-full table-fixed sm:table-auto border-collapse">
                    <TableHeader className="hidden sm:table-header-group bg-gray-100">
                      <TableRow>
                        <TableHead className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Item</TableHead>
                        <TableHead className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Quantity Sold</TableHead>
                        <TableHead className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Unit Price</TableHead>
                        <TableHead className="text-left py-3 px-4 text-sm font-semibold text-gray-700">U/M</TableHead>
                        <TableHead className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Quantity on Shelf</TableHead>
                        <TableHead className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Batch Number</TableHead>
                        <TableHead className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Expiry Date</TableHead>
                        <TableHead className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="overflow-x-auto">

                      {/* ✅ Mobile Total Row */}
                      <TableRow className="sm:hidden">
                        <TableCell colSpan={8} className="py-2 px-4">
                          <div>
                            <span className="font-semibold">Total: </span>
                            UGX {calculateTotalExpectedAmount().toLocaleString()}
                          </div>
                        </TableCell>
                      </TableRow>

                      {selectedItems.map((item, index) => (
                        <TableRow
                          key={`${item.itemId}-${index}`}
                          className="border-b sm:table-row flex flex-col sm:flex-row sm:border-b sm:hover:bg-gray-50"
                        >
                          <TableCell className="text-left py-2 px-4 text-sm text-gray-900 sm:table-cell flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-0 before:content-['Item:'] before:font-semibold before:mr-2 sm:before:content-none">
                            <span className="whitespace-normal break-words">{item.itemName}</span>
                          </TableCell>

                          <TableCell className="text-left py-2 px-4 text-sm text-gray-900 sm:table-cell flex items-start before:content-['Quantity_Sold:'] before:font-semibold before:mr-2 sm:before:content-none">
                            {item.quantitySold}
                          </TableCell>

                          <TableCell className="text-left py-2 px-4 text-sm text-gray-900 sm:table-cell flex items-start before:content-['Unit_Price:'] before:font-semibold before:mr-2 sm:before:content-none">
                            {item.customUnitPrice || item.salesPrice}
                          </TableCell>

                          {(() => {
                            const unit = item.unisOfMeasure?.find((u) => u.sublevel === 0)?.fullName || '---';
                            return (
                              <TableCell className="text-left py-2 px-4 text-sm text-gray-900 sm:table-cell flex items-start before:content-['U/M:'] before:font-semibold before:mr-2 sm:before:content-none">
                                {unit}
                              </TableCell>
                            );
                          })()}

                          <TableCell className="text-center py-2 px-4 text-sm text-gray-900 sm:table-cell flex items-start before:content-['Quantity_on_Shelf:'] before:font-semibold before:mr-2 sm:before:content-none sm:text-center">
                            {item.sites?.[0]?.quantityOnsite}
                          </TableCell>

                          <TableCell className="text-left py-2 px-4 text-sm text-gray-900 sm:table-cell flex items-start before:content-['Batch_Number:'] before:font-semibold before:mr-2 sm:before:content-none">
                            {item.batchNo}
                          </TableCell>

                          <TableCell className="text-left py-2 px-4 text-sm text-gray-900 sm:table-cell flex items-start before:content-['Expiry_Date:'] before:font-semibold before:mr-2 sm:before:content-none">
                            {new Date(item.expiryDate).toLocaleDateString()}
                          </TableCell>

                          {/* ✅ Responsive Remove Button */}
                          <TableCell className="py-2 px-4 w-full sm:table-cell sm:text-right">
                            <div className="flex justify-end sm:justify-end mt-2 sm:mt-0">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeItem(index)}
                               className="text-xs p-2 mt-2 sm:mt-6 bg-primary-dark text-white hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
                                aria-label={`Remove ${item.itemName}`}
                              >
                                Remove
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}

                      {/* ✅ Responsive Add & Submit Buttons */}
                      <TableRow className="sm:hidden">
                        <TableCell colSpan={8} className="w-full bg-gray-100 py-4 px-4">
                          <div className="flex flex-col gap-3 w-full">

                            {/* Add Item Button */}
                            <Button
                              type="button"
                              onClick={addItemToList}
                              variant="outline"
                              disabled={
                                !currentItem ||
                                currentQuantity <= 0 ||
                                currentQuantity > currentItem.sites?.[0]?.quantityOnsite
                              }
                              className="text-xs p-2 mt-2 sm:mt-6 bg-primary-dark text-white hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
                            >
                              Add Item
                            </Button>

                            {/* Submit Sale Button */}
                            <Button
                              type="button"
                              onClick={onSubmit}
                              variant="default"
                              className="text-sm w-full bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed"
                              disabled={
                                isSubmitting ||
                                selectedItems.length === 0 ||
                                payments.length === 0 ||
                                customerType === '' ||
                                currentTotal !== calculateTotalExpectedAmount()
                              }
                            >
                              {isSubmitting ? 'Processing...' : 'Submit Sale'}
                            </Button>

                          </div>
                        </TableCell>
                      </TableRow>


                      {/* ✅ ComboBox for item input */}
                      <TableRow className="sm:table-row flex flex-col border border-blue-300">
                        <SRComboBox
                          selectedItem={currentItem}
                          onItemSelect={handleAddItem}
                          onUnitofMeasure={(unit) => console.log("Selected unit:", unit)}
                          onQuantitySoldChange={handleQuantityChange}
                          onUnitPriceChange={handleUnitPriceChange}
                        />
                      </TableRow>
                    </TableBody>
                    <TableFooter className="hidden sm:table-footer-group w-full">
                      <TableRow className="bg-gray-50 flex flex-col sm:table-row sm:flex-row">
                        <TableCell colSpan={3} className="py-3 px-4 w-full sm:w-auto">
                          <Button
                            type="button"
                            onClick={addItemToList}
                            variant="outline"
                            disabled={
                              !currentItem ||
                              currentQuantity <= 0 ||
                              currentQuantity > currentItem.sites?.[0]?.quantityOnsite
                            }
                            className="w-full sm:w-auto"
                          >
                            Add Item
                          </Button>
                        </TableCell>

                        <TableCell colSpan={4} className="py-3 px-4 text-left sm:text-right w-full sm:w-auto">
                          <div>
                            <span className="font-semibold">Total: </span>
                            UGX {calculateTotalExpectedAmount().toLocaleString()}
                          </div>
                        </TableCell>

                        <TableCell colSpan={2} className="py-3 px-4 text-left sm:text-right w-full sm:w-auto">
                          <Button
                            type="button"
                            onClick={onSubmit}
                            variant="default"
                            className="w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
                            disabled={
                              isSubmitting ||
                              selectedItems.length === 0 ||
                              payments.length === 0 ||
                              customerType === '' ||
                              currentTotal !== calculateTotalExpectedAmount()
                            }
                          >
                            {isSubmitting ? 'Processing...' : 'Submit Sale'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableFooter>

                  </Table>

                  {/* Custom CSS for mobile column stacking */}
                </div>
              </div>

            </form>

            {/* {showPreview && (
            <div className="receipt-modal">
              <ReceiptPreview items={selectedItems} payments={payments} total={calculateTotalExpectedAmount()} />
              <button onClick={() => printReceipt(selectedItems, payments, calculateTotalExpectedAmount())}>
                Confirm Print
              </button>
              <button onClick={() => setShowPreview(false)}>Cancel</button>
            </div>
          )} */}
          </TabsContent>

          <TabsContent value="see-sales">
            <div className=" rounded-md w-full max-w-screen-xl mx-auto px-4 py-4">
              <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 mt-4">
                {/* Column 1: Filter By + Date Range */}
                <div className="flex-1 space-y-4">
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-semibold">Filter By:</span>
                    <Select
                      value={filterBy}
                      onValueChange={(value) => stateDispatch({ type: 'SET_FILTER_BY', payload: value })}
                    >
                      <SelectTrigger className="w-full max-w-xs">
                        <SelectValue className="text-xs" placeholder="Select filter..." />
                      </SelectTrigger>
                      <SelectContent>
                        {(VIEW_ALL_SALES_PERMISSIONS ? filterSalesBy : cashierFilterOptions).map((option) => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-semibold">Date Range:</span>
                    <DatePickerWithRange
                      className="w-full max-w-xs"
                      startDate={startDate}
                      endDate={endDate}
                      onDateChange={(range) => {
                        stateDispatch({ type: 'SET_START_DATE', payload: range.from });
                        stateDispatch({ type: 'SET_END_DATE', payload: range.to });
                        stateDispatch({ type: 'SET_ERRORS', payload: { date: undefined } });
                      }}
                      placeholder="Pick date range..."
                      onClear={() => {
                        stateDispatch({ type: 'SET_START_DATE', payload: undefined });
                        stateDispatch({ type: 'SET_END_DATE', payload: undefined });
                        stateDispatch({ type: 'SET_ERRORS', payload: { date: undefined } });
                      }}
                    />
                    {errors.date && <span className="text-xs text-red-500">{errors.date}</span>}
                  </div>
                </div>

                {/* Column 2: Site + Cashier (Only if permitted) */}
                {VIEW_ALL_SALES_PERMISSIONS && (
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-semibold">Site:</span>
                      <Select
                        value={selectedSite?.name || ''}
                        onValueChange={(siteName) => {
                          const site = sites.find((s) => s.name === siteName);
                          stateDispatch({ type: 'SET_SELECTED_SITE', payload: site });
                          stateDispatch({ type: 'SET_ERRORS', payload: { site: undefined } });
                        }}
                      >
                        <SelectTrigger className="w-full max-w-xs">
                          <SelectValue className="text-xs" placeholder="Select site..." />
                        </SelectTrigger>
                        <SelectContent>
                          {sites.map((site) => (
                            <SelectItem key={site.listId} value={site.name}>{site.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.site && <span className="text-xs text-red-500">{errors.site}</span>}
                    </div>

                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-semibold">Cashier:</span>
                      <Select
                        value={selectedCashier}
                        onValueChange={(cashierId: string) => {
                          const cashier = cashiers.find((c) => c.phone === cashierId);
                          if (cashier) {
                            stateDispatch({ type: 'SET_SELECTED_CASHIER', payload: cashierId });
                            stateDispatch({ type: 'SET_ERRORS', payload: { cashier: undefined } });
                          } else {
                            stateDispatch({ type: 'SET_SELECTED_CASHIER', payload: '' });
                          }
                        }}
                      >
                        <SelectTrigger className="w-full max-w-xs">
                          <SelectValue className="text-xs" placeholder="Select cashier..." />
                        </SelectTrigger>
                        <SelectContent>
                          {cashiers.map((cashier) => (
                            <SelectItem className="text-xs capitalize" key={cashier.phone} value={cashier.phone}>
                              {`${cashier.accountDetails.firstName} ${capitalizeName(cashier.accountDetails.lastName)}`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.cashier && <span className="text-xs text-red-500">{errors.cashier}</span>}
                    </div>
                  </div>
                )}

                {/* Column 3: Payment + Customer Type */}
                <div className="flex-1 space-y-4">
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-semibold">Payment Method:</span>
                    <Select
                      value={selectedPaymentMethod}
                      onValueChange={(value) => stateDispatch({ type: 'SET_SELECTED_PAYMENT_METHOD', payload: value })}
                    >
                      <SelectTrigger className="w-full max-w-xs">
                        <SelectValue className="text-xs" placeholder="Select payment method..." />
                      </SelectTrigger>
                      <SelectContent>
                        {singlePaymentMethods.map((method) => (
                          <SelectItem key={method} value={method}>{method}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.payment && <span className="text-sm text-red-500">{errors.payment}</span>}
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-semibold">Customer Type Filter:</span>
                    <Select
                      value={customerTypeFilter}
                      onValueChange={(value) => stateDispatch({ type: 'SET_CUSTOMER_TYPE_FILTER', payload: value })}
                    >
                      <SelectTrigger className="w-full max-w-xs">
                        <SelectValue className="text-xs" placeholder="Select customer type..." />
                      </SelectTrigger>
                      <SelectContent>
                        {customerTypes.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.customerTypeFilter && <span className="text-sm text-red-500">{errors.customerTypeFilter}</span>}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center mt-4 mb-3 gap-3">
                <Button variant="outline" onClick={handleFilter} className="flex gap-1 py-1">
                  <FilterIcon size={16} />
                  Filter
                </Button>
                <Button
                  variant="link"
                  onClick={handleClearFilters}
                  className="bg-transparent hover:underline hover:text-red-400 text-text-color text-xs"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
            <SalesTable />
          </TabsContent>
        </Tabs>
      )
      }
    </React.Fragment>
  );
};

const SalesTable = () => {
  const sales = useAppSelector((state: RootState) => (state as RootState).sales.sales || []);
  const isLoadingSales = useAppSelector((state: RootState) => state.sales.loading);
  const errorSales = useAppSelector((state: RootState) => state.sales.error);
  const { VIEW_ALL_SALES_PERMISSIONS } = useRolesAndPermissions();
  const userRole = localStorage.getItem('adsRole');
  const dispenserName = localStorage.getItem('firstName') || '';

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const filteredSales = useMemo(() => {
    if (userRole === 'DISPENSER' && !VIEW_ALL_SALES_PERMISSIONS) {
      return sales.filter((sale) => sale.cashier.name === dispenserName);
    }
    return sales;
  }, [sales, userRole, dispenserName, VIEW_ALL_SALES_PERMISSIONS]);

  const columns = useMemo<ColumnDef<any>[]>(() => [
    ...(VIEW_ALL_SALES_PERMISSIONS ? [{ header: 'Site', accessorKey: 'siteName', size: 15 }] : []),
    { header: 'Cashier', accessorFn: (row) => row.cashier.name, size: 15 },
    { header: 'Date', accessorFn: (row) => formatTimestamp(row.saleDate), size: 20 },
    { header: 'Payment Method', accessorFn: (row) => row.payment.map((p) => p.modeOfPayment).join(', '), size: 25 },
    { header: 'Customer Type', accessorKey: 'customerName', size: 15 },
    { header: 'Total Amount', accessorFn: (row) => formatCurrency(row.totalAmount, true), size: 10 },
  ], [VIEW_ALL_SALES_PERMISSIONS]);

  const table = useReactTable({
    data: filteredSales,
    columns,
    pageCount: Math.ceil(filteredSales.length / pageSize),
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
      const next = typeof updater === 'function' ? updater({ pageIndex, pageSize }) : updater;
      setPageIndex(next.pageIndex);
      setPageSize(next.pageSize);
    },
  });

  const paginatedRows = useMemo(() => {
    const start = pageIndex * pageSize;
    const end = start + pageSize;
    return table.getRowModel().rows.slice(start, end);
  }, [table.getRowModel().rows, pageIndex, pageSize]);

  if (isLoadingSales) {
    return (
      <div className="w-full flex justify-center items-center py-8">
        <div className="flex gap-2 items-center">
          <Loader color="text-primary" />
          <p className="text-sm text-slate-500">Loading sales, please wait...</p>
        </div>
      </div>
    );
  }

  if (errorSales) {
    return (
      <div className="flex items-center justify-center py-4 text-red-500">
        Error fetching sales! Please contact the Admin.
      </div>
    );
  }

  if (filteredSales.length === 0) {
    return <div className="flex items-center justify-center py-4">No Sales found</div>;
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-slate-50 p-4 font-semibold border-b text-sm hidden md:flex">
        {columns.map(col => (
          <div key={col.header as string} style={{ flexBasis: `${(col as any).size}%` }} className="px-2">{col.header as string}</div>
        ))}
      </div>
      {paginatedRows.map((row) => (
        <Accordion key={row.id} type="single" collapsible className="border-b last:border-b-0">
          <AccordionItem value={`item-${row.id}`} className="border-none">
            <AccordionTrigger className="p-4 hover:bg-slate-50 text-xs w-full">
              <div className="w-full flex flex-col md:flex-row items-start md:items-center text-left">
                {row.getVisibleCells().map((cell) => (
                  <div key={cell.id} style={{ flexBasis: `${(cell.column.columnDef as any).size}%` }} className="mb-2 md:mb-0 px-2">
                    <span className="font-semibold md:hidden">{(cell.column.columnDef.header as string)}: </span>
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
                      <TableHead className="text-center">Qty</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Total Price</TableHead>
                      <TableHead>U/M</TableHead>
                      <TableHead>Batch No.</TableHead>
                      <TableHead>Expiry Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {row.original.salesItems.map((item: any, index: number) => (
                      <TableRow key={`${item.itemId}-${index}`}>
                        <TableCell>{item.itemName}</TableCell>
                        <TableCell className="text-center">{item.quantity}</TableCell>
                        <TableCell>{formatCurrency(item.unitPrice, true)}</TableCell>
                        <TableCell>{formatCurrency(item.totalPrice, true)}</TableCell>
                        <TableCell>{item.unitOfMeasure}</TableCell>
                        <TableCell>{item.batchNo}</TableCell>
                        <TableCell>{formatTimestamp(item.expiryDate)}</TableCell>
                      </TableRow>
                    ))}
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

export default SalesReceipt;

