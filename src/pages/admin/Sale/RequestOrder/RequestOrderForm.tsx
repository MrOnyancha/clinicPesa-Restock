import React, { useEffect, useRef, useReducer, useState } from 'react';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import {
  Button,
  Table,
  TableCaption,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  Form,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Popover,
  PopoverContent,
  PopoverTrigger,
  onOpenInnerModal,
  InnerModal,
  Input,
  onCloseModal,
  onCloseInnerModal,
} from '@/components';
import { RequestOrderItem, OrderResponse } from '@/utils/types';
import ROComboBox from '@/pages/admin/Sale/RequestOrder/ROComboBox';
import { initialState, reducer, ROSubmittedItem } from './constants';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import BulkSelect from './BulkSelect';
import { requestOrdersList, updateItemQuantity, fetchAllOrders, deleteProduct, addProducts } from './requestOrderSlice';
import { selectUserProfile, selectUserType } from '@/pages/auth/authSlice';
import { RootState } from '@/store/store';
// import { fetchSites } from '../Bill/billSlice';
import { Ordery } from '../../../../utils/useFetchOrders';
import { useQueryClient } from '@tanstack/react-query';
import { useFetchSites } from '@/utils/useFetchSites';
import { useFetchOrdersByStatus } from '../../../../utils/useFetchOrders';
import { useAddProductsToOrder } from '@/utils/useAddProductsToOrder';
import { WebService } from '@/web-services/WebService';
interface RequestOrderFormProps {
  onOrderResponseChange?: (response: Ordery) => void;
  selectedOrder?: OrderResponse;
}

export const RequestOrderForm = ({ onOrderResponseChange, selectedOrder }: RequestOrderFormProps) => {
  // const { data: orders, refetch: refetchOrders, isLoading, isError } = useFetchOrdersByStatus('GENERAL');
  const [state, dispatch] = useReducer(reducer, initialState);
  const [newlySavedItems, setNewlySavedItems] = useState<RequestOrderItem[]>([]);

  const {
    isSubmitting,
    resetFields,
    selectedItem,
    selectedItems,
    showClearDialog,
    openPopoverIndex,
    orderResponse,
    isEditing,
  } = state;
  const [selectedUnit, setSelectedUnit] = useState<string>("");
  const [unitSelections, setUnitSelections] = useState<Record<string, string>>({});

  const queryClient = useQueryClient();
  const showProductsModal = useAppSelector((state) => state.innerModal.isOpen);
  const modalDispatch = useAppDispatch();
  const userProfile = useAppSelector(selectUserProfile);
  // const sites = useAppSelector((state: RootState) => state.bill.sites);
  const phoneNumber = localStorage.getItem('account_id') || '';
  // const userType = useAppSelector((state: RootState) => selectUserType(state));
  const tillNo = localStorage.getItem('adsStation') || '';
  let siteName = localStorage.getItem('siteName') || ''; // Changed to let for potential reassignment
  const userType = localStorage.getItem('adsRole') || '';
  const dispenser = userType === 'DISPENSER';
  const dispenserName = localStorage.getItem('firstName') || '';
  const { data: orders, refetch: refetchOrders, isLoading, isError } = useFetchOrdersByStatus('GENERAL');
  const { mutateAsync: fetchSites } = useFetchSites();

  const formSchema = z.object({
    items: z.array(z.any()).min(1, 'At least one item must be selected'),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      items: [],
    },
  });

  useEffect(() => {
    // modalDispatch(fetchSites());
  }, [modalDispatch]);

  // When selectedOrder is provided (editing mode), convert the order items to the format expected by the form
  useEffect(() => {
    if (selectedOrder && selectedOrder.items && selectedOrder.items.length > 0) {
      dispatch({ type: 'SET_IS_EDITING', payload: true });

      // Transform order items to the format expected by the form
      const formattedItems = selectedOrder.items.map((item) => ({
        name: item.itemName,
        fullName: item.itemName,
        salesDesc: item.notes || '',
        quantityOrdered: item.quantity,
        sites: [{ quantityOnsite: 0 }],
        unitOfMeasure: item.unitOfMeasure,
        unitOfMeasureSetRef: {
          listID: item.listID,
          fullName: item.unitOfMeasure,
        },
        user: {
          branch: selectedOrder.facilityName,
          siteId: selectedOrder.tillNo,
          region: selectedOrder.region,
          userName: selectedOrder.dispenser?.name || '',
          phoneNumber: selectedOrder.dispenser?.accountId || '',
        },
      }));

      dispatch({ type: 'SET_SELECTED_ITEMS', payload: formattedItems });
      dispatch({ type: 'SET_ORDER_RESPONSE', payload: selectedOrder });
    } else {
      // Reset the form state when no selectedOrder is provided (creating a new order)
      dispatch({ type: 'SET_IS_EDITING', payload: false });
      dispatch({ type: 'SET_SELECTED_ITEMS', payload: [] });
    }
  }, [selectedOrder]);

  // Handle bulk selected items from BulkSelect component
  const handleBulkItemsSelected = (bulkItems: any[]) => {

    if (bulkItems && bulkItems.length > 0) {
      const formattedItems = bulkItems.map((item) => ({
        name: item.fullName,
        fullName: item.fullName,
        salesDesc: item.salesDesc || '',
        quantityOrdered: 1,
        sites: [{ quantityOnsite: 0 }],
        unitOfMeasureSetRef: item.unitOfMeasureSetRef || {
          listID: '',
          fullName: '',
        },
        user: {
          branch: '',
          siteId: '',
          region: '',
          userName: '',
          phoneNumber: '',
        },
      }));

      // Merge with existing items, avoiding duplicates based on fullName
      const existingItemsMap = new Map(selectedItems.map((item) => [item.fullName, item]));
      const newItemsMap = new Map(formattedItems.map((item) => [item.fullName, item]));

      // Combine both maps, with new items overriding existing ones if they have the same fullName
      const combinedItems = Array.from(new Map([...existingItemsMap, ...newItemsMap]).values());

      dispatch({ type: 'SET_SELECTED_ITEMS', payload: combinedItems });

      modalDispatch(onCloseInnerModal());
    }
  };

const handleItemSelect = (item: RequestOrderItem | null) => {
  console.log('🔍 Selected Item:', item);
  if (item.selectedUnit) {
  setUnitSelections((prev) => ({
    ...prev,
    [item.fullName]: item.selectedUnit,
  }));
}

  dispatch({ type: 'SET_SELECTED_ITEM', payload: item });
};


  // Handle quantity change for items in the table
  const handleQuantityChange = (fullName: string, value: string) => {
    const updatedItems = selectedItems.map((item) =>
      item.fullName === fullName ? { ...item, quantityOrdered: value === '' ? '' : Number(value) } : item,
    );
    dispatch({ type: 'SET_SELECTED_ITEMS', payload: updatedItems });
  };

  // Handle quantity updates when input loses focus (only when editing)
  const handleQuantityBlur = (item: RequestOrderItem) => {
    if (!isEditing || !selectedOrder) return;

    let quantity = Number(item.quantityOrdered);
    if (isNaN(quantity) || quantity < 1) quantity = 1;
    if (quantity > 10) {
      toast.error('Order quantity cannot exceed 10');
      quantity = 10;
      // Update UI but do NOT call API
      const updatedItems = selectedItems.map((i) =>
        i.fullName === item.fullName ? { ...i, quantityOrdered: quantity } : i,
      );
      dispatch({ type: 'SET_SELECTED_ITEMS', payload: updatedItems });
      return;
    }

    // Update to clamped value and call API
    const updatedItems = selectedItems.map((i) =>
      i.fullName === item.fullName ? { ...i, quantityOrdered: quantity } : i,
    );
    dispatch({ type: 'SET_SELECTED_ITEMS', payload: updatedItems });

    modalDispatch(
      updateItemQuantity({
        orderId: selectedOrder.orderId,
        item: {
          itemName: item.fullName,
          quantity: quantity,
        },
        dispenser: {
          name: dispenserName,
          accountId: phoneNumber,
        },
      }),
    ).then(() => {
      // Update local state with the new quantity
      const updatedItems = selectedItems.map((i) =>
        i.fullName === item.fullName ? { ...i, quantityOrdered: item.quantityOrdered } : i,
      );
      dispatch({ type: 'SET_SELECTED_ITEMS', payload: updatedItems });
      // Optionally, trigger parent refresh
      if (onOrderResponseChange) {
        const orderyOrder: Ordery = {
          orderId: selectedOrder.orderId,
          orderNo: selectedOrder.orderNo,
          dispenser: selectedOrder.dispenser,
          requestType: selectedOrder.requestType,
          orderStatus: selectedOrder.orderStatus,
          items: selectedOrder.items,
          facilityName: selectedOrder.facilityName,
          tillNo: selectedOrder.tillNo,
          timeStamp: selectedOrder.timeStamp,
          lastUpdated: selectedOrder.lastUpdated,
          scheduledDate: selectedOrder.scheduledDate,
          region: selectedOrder.region,
          filterBy: selectedOrder.filterBy,
          page: Number(selectedOrder.page) || 0,
          notes: [], // Initialize notes as an empty array
          name: selectedOrder.dispenser?.name || '', // Use dispenser name for the 'name' property
          filterDate: '', // Added missing filterDate property
        };
        onOrderResponseChange(orderyOrder);
      }
    });
  };

  const validateItem = (item: RequestOrderItem | null) => {
    // Check if no item is selected
    if (!item) {
      toast.error('Please select an item.');
      return false;
    }

    // Check if order quantity is valid
    if (item.quantityOrdered <= 0) {
      toast.error('Please enter a valid order number.');
      return false;
    }
    return true;
  };

  const facilityName = localStorage.getItem('facilityName') || '';

  const handleSaveItem = async (): Promise<boolean> => {
    try {
      if (!selectedItem) {
        toast.error('Please select an item');
        return false;
      }

      if (!validateItem(selectedItem)) {
        return false;
      }

      dispatch({ type: 'SET_IS_SAVING', payload: true });

      const itemExists = selectedItems.some(
        (item) => item.fullName === selectedItem?.fullName
      );

      if (itemExists) {
        toast.error('This item is already in the list.');
        dispatch({ type: 'SET_SELECTED_ITEM', payload: null });
        dispatch({ type: 'SET_RESET_FIELDS', payload: true });
        setTimeout(() => dispatch({ type: 'SET_RESET_FIELDS', payload: false }), 500);
        return false;
      }

      const newItem = {
        ...selectedItem,
        fullName: selectedItem.fullName,
        quantity: selectedItem.quantityOrdered || 1,
        unitOfMeasure: unitSelections[selectedItem.fullName] || selectedItem.selectedUnit || '',
      };

      dispatch({ type: 'ADD_SELECTED_ITEM', payload: newItem });
      setNewlySavedItems((prev) => [...prev, newItem]);

      dispatch({ type: 'SET_SELECTED_ITEM', payload: null });
      dispatch({ type: 'SET_RESET_FIELDS', payload: true });
      setTimeout(() => dispatch({ type: 'SET_RESET_FIELDS', payload: false }), 500);
      form.setValue('items', selectedItems);

      return true;
    } catch (error) {
      console.error('Error saving item:', error);
      toast.error('Error saving item');
      return false;
    } finally {
      dispatch({ type: 'SET_IS_SAVING', payload: false });
    }
  };



  const handleDeleteItem = (fullName: string) => {
    const itemToDelete = selectedItems.find((item) => item.fullName === fullName);
    if (!itemToDelete) return;

    const updatedSelectedItems = selectedItems.filter((item) => item.fullName !== fullName);
    const updatedNewlySavedItems = newlySavedItems.filter((item) => item.fullName !== fullName);

    dispatch({ type: 'SET_SELECTED_ITEMS', payload: updatedSelectedItems });
    // Optional: dispatch({ type: 'SET_NEWLY_SAVED_ITEMS', payload: updatedNewlySavedItems });

    if (isEditing && selectedOrder) {
      modalDispatch(
        deleteProduct({
          orderId: selectedOrder.orderId,
          item: {
            itemName: fullName,
            quantity: Number(itemToDelete.quantityOrdered),
            unitOfMeasure: itemToDelete.unitOfMeasureSetRef?.fullName || '',
          },
          dispenser: {
            name: dispenserName,
            accountId: phoneNumber,
          },
        })
      ).then(async () => {
        if (onOrderResponseChange) {
          const { page, ...rest } = selectedOrder;
          const orderyOrder: Ordery = {
            ...rest,
            page: Number(selectedOrder.page) || 0,
            notes: [],
            name: selectedOrder.dispenser?.name || '',
            filterDate: '',
          };
          onOrderResponseChange(orderyOrder);

          await refetchOrders(); // ✅ Refreshes the order list
        }

        toast.success('Product deleted successfully');
      });
    }
  };

  const handleClearConfirmationOpen = () => {
    dispatch({ type: 'SET_SHOW_CLEAR_DIALOG', payload: true });
  };

  const handleClearConfirmationClose = () => {
    dispatch({ type: 'SET_SHOW_CLEAR_DIALOG', payload: false });
  };

  const handleClearForm = () => {
    if (selectedItems.length === 0 && !selectedItem) {
      toast.info('There are no items selected to clear.');
      dispatch({ type: 'SET_SHOW_CLEAR_DIALOG', payload: false });
      return;
    }
    localStorage.removeItem('unsaved_request_items');
    dispatch({ type: 'CLEAR_SELECTED_ITEMS' });
    dispatch({ type: 'SET_SELECTED_ITEM', payload: null });
    dispatch({ type: 'SET_RESET_FIELDS', payload: true });
    setTimeout(() => dispatch({ type: 'SET_RESET_FIELDS', payload: false }), 500);
    dispatch({ type: 'SET_SHOW_CLEAR_DIALOG', payload: false });
    form.reset();
  };

  // Add a ref to track if orderResponse has been sent to parent
  const orderResponseRef = useRef(false);

  useEffect(() => {
    if (orderResponse && !orderResponseRef.current) {
      // Set the ref to true to prevent this effect from running again
      // for the same orderResponse
      orderResponseRef.current = true;
      onOrderResponseChange?.(orderResponse);
    } else if (!orderResponse) {
      // Reset the ref when orderResponse is null
      orderResponseRef.current = false;
    }
  }, [orderResponse, onOrderResponseChange]);

  const handleSubmitOrder = async () => {
    try {
      // Removed redeclaration of siteName

      const adsRole = localStorage.getItem('adsRole');
      const rawAdsStation = localStorage.getItem('adsStation');
      const adsStation = rawAdsStation ? JSON.parse(rawAdsStation) : null;

      form.setValue('items', selectedItems);
      const isValid = await form.trigger();

      if (!isValid) {
        const errors = form.formState.errors;
        toast.error(errors.items ? errors.items.message as string : 'Please check the form for errors');
        return;
      }

      dispatch({ type: 'SET_IS_SUBMITTING', payload: true });

      try {
        let itemsToSubmit = [...selectedItems];

        if (selectedItem) {
          if (!validateItem(selectedItem)) return;
          itemsToSubmit.push(selectedItem);
        }

        itemsToSubmit = itemsToSubmit.filter(
          (item, index, self) => index === self.findIndex(t => t.fullName === item.fullName)
        );

        if (itemsToSubmit.length === 0) {
          toast.error('Please add items before submitting.');
          return;
        }

        const loadingToast = toast.loading(isEditing ? 'Updating Request order...' : 'Creating Request order...');

        const requestBody = {
          requestType: isEditing ? 'UPDATE_ONE' : 'CREATE_ORDER',
          orderId: isEditing && selectedOrder ? selectedOrder.orderId : undefined,
          items: itemsToSubmit.map(item => {
            let quantity = typeof item.quantityOrdered === 'number' || typeof item.quantityOrdered === 'string'
              ? Number(item.quantityOrdered) || 1
              : item.quantity || 1;

            let unitOfMeasure = item.unitOfMeasure || '';
            if (unitOfMeasure.startsWith('Count by ')) {
              unitOfMeasure = unitOfMeasure.replace('Count by ', '');
            }

            return {
              listID: item.listID || '',
              itemName: item.fullName,
              quantity,
              unitOfMeasure,
              unitsOfMeasure: item.unitsOfMeasure || [],
            };
          }),
          dispenser: {
            name: dispenserName,
            accountId: phoneNumber,
          },
          facilityName: facilityName,
          tillNo,
          region: 'CENTRAL',
        };
        console.log('Submitting order with body:', requestBody);
        const response = await WebService.postPharma('requestOrder', requestBody);

        toast.dismiss(loadingToast);

        if (response?.status === true) {
          await queryClient.invalidateQueries({
            queryKey: ['ordersByStatus', dispenserName, siteName, 'GENERAL'],
          });
          const orderData = (response.message[0] ?? {}) as OrderResponse;
          dispatch({ type: 'SET_ORDER_RESPONSE', payload: orderData });

          if (onOrderResponseChange) {
            const orderyOrder: Ordery = {
              ...orderData,
              page: selectedOrder?.page ? Number(selectedOrder.page) : 0,
              notes: [], // Initialize notes as an empty array
              name: orderData.dispenser?.name || '', // Use dispenser name for the 'name' property
              filterDate: '', // Added missing filterDate property
            };
            onOrderResponseChange(orderyOrder);
          }

          toast.success(isEditing ? 'Order updated successfully!' : 'Order created successfully!');
          // await queryClient.invalidateQueries({ queryKey: ['orderStatistics'] });
          // await refetchOrders();
          form.reset();
          dispatch({ type: 'CLEAR_SELECTED_ITEMS' });
          dispatch({ type: 'SET_SELECTED_ITEM', payload: null });

          dispatch({ type: 'SET_RESET_FIELDS', payload: true });
          setTimeout(() => dispatch({ type: 'SET_RESET_FIELDS', payload: false }), 500);
          modalDispatch(onCloseModal());
        } else {
          toast.error(response.message || 'Error submitting order - 1');
        }

        modalDispatch(onCloseInnerModal());
        dispatch({ type: 'SET_IS_SUBMITTING', payload: false });
        await refetchOrders();
      } catch (error) {
        console.error('Error submitting order:', error);
        toast.error('Error submitting order - 2');
      } finally {
        dispatch({ type: 'SET_IS_SUBMITTING', payload: false });
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      toast.error('Error submitting order - 6');
    }
  };

  const addProducts = useAddProductsToOrder();
  const [isSaving, setIsSaving] = useState(false);
  // const handleAddProducts = () => {
  //   const orderId = selectedOrder?.orderId;

  //   if (!orderId || newlySavedItems.length === 0) {
  //     toast.error('Missing order ID or items');
  //     return;
  //   }

  //   const payload = {
  //     requestType: "ADD_PRODUCTS" as const,
  //     orderId,
  //     items: newlySavedItems.map(item => ({
  //       listID: item.listID || '',
  //       itemName: item.fullName || item.name || '',
  //       quantity: item.quantityOrdered || 0,
  //       unitOfMeasure: item.unitOfMeasureSetRef?.fullName || '',
  //       unitsOfMeasure: item.unitsOfMeasure || [],
  //       orderItemStatus: 'ADDED',
  //     })),
  //     dispenser: {
  //       name: dispenserName || '',
  //       accountId: phoneNumber || '',
  //     },
  //   };

  //   setIsSaving(true);

  //   addProducts.mutate(
  //     { payload, refetchStatus: 'GENERAL' },
  //     {
  //       onSuccess: async () => {
  //         setIsSaving(false);
  //         // modalDispatch(onCloseModal());

  //         // ✅ Refresh the orders
  //         await refetchOrders();
  //         toast.success('Products added successfully');
  //       },
  //       onError: () => {
  //         setIsSaving(false);
  //         toast.error('Failed to add products');
  //       },
  //     }
  //   );
  // };

  const handleSaveAndAdd = async () => {
    try {
      if (!selectedItem) {
        toast.error('Please select an item');
        return;
      }

      if (!validateItem(selectedItem)) return;

      const itemExists = selectedItems.some(item => item.fullName === selectedItem.fullName);
      if (itemExists) {
        toast.error('This item is already in the list.');
        dispatch({ type: 'SET_SELECTED_ITEM', payload: null });
        dispatch({ type: 'SET_RESET_FIELDS', payload: true });
        setTimeout(() => dispatch({ type: 'SET_RESET_FIELDS', payload: false }), 500);
        return;
      }

      const itemToAdd = {
        ...selectedItem,
        fullName: selectedItem.fullName,
        quantity: selectedItem.quantityOrdered || 1,
        unitOfMeasure: unitSelections[selectedItem.fullName] || '',
      };

      // Save to local list
      dispatch({ type: 'ADD_SELECTED_ITEM', payload: itemToAdd });

      // Prepare and send the API request directly
      const payload = {
        requestType: "ADD_PRODUCTS" as const,
        orderId: selectedOrder?.orderId,
        items: [
          {
            listID: itemToAdd.listID || '',
            itemName: itemToAdd.fullName || itemToAdd.name || '',
            quantity: itemToAdd.quantityOrdered || 0,
            unitOfMeasure: itemToAdd.unitOfMeasure || '',
            unitsOfMeasure: itemToAdd.unitsOfMeasure || [],
            orderItemStatus: 'ADDED',
          },
        ],
        dispenser: {
          name: dispenserName || '',
          accountId: phoneNumber || '',
        },
      };

      setIsSaving(true);

      await new Promise((resolve, reject) => {
        addProducts.mutate(
          { payload, refetchStatus: 'GENERAL' },
          {
            onSuccess: async () => {
              await refetchOrders();
              toast.success('Item added to order');
              resolve(true);
            },
            onError: () => {
              toast.error('Failed to add item to order');
              reject();
            },
            onSettled: () => setIsSaving(false),
          }
        );
      });

      // Reset form
      dispatch({ type: 'SET_SELECTED_ITEM', payload: null });
      dispatch({ type: 'SET_RESET_FIELDS', payload: true });
      setTimeout(() => dispatch({ type: 'SET_RESET_FIELDS', payload: false }), 500);
    } catch (err) {
      console.error('Save & Add error', err);
      toast.error('Unexpected error while saving');
    }
  };

  return (
    <React.Fragment>
      <Form {...form}>
        <form className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-end items-center">
            <Button type="button" className="m-2" onClick={() => modalDispatch(onOpenInnerModal())}>
              Add Bulk Items
            </Button>
          </div>
          <div className="my-4 mx-2 border dark:border-slate-700 md:block w-full overflow-x-auto">
            <Table className="w-full">
              <TableCaption>A list of your request order.</TableCaption>
              <TableHeader className="hidden lg:table-header-group">
                <TableRow>
                  <TableHead className="text-left">Item</TableHead>
                  <TableHead className="text-center px-0 text-nowrap">Items left - shelf</TableHead>
                  <TableHead className="text-left">Ordered</TableHead>
                  <TableHead className="text-left">U/M</TableHead>
                  <TableHead className="text-left"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedItems.length > 0 ? (
                  selectedItems.map((item) => (
                    <TableRow
                      className="group relative flex flex-col lg:table-row border-b lg:border-b-0"
                      key={item.fullName}
                    >
                      <TableCell className="flex flex-col items-center lg:table-cell p-2 w-full">
                        <span className="font-semibold lg:hidden mr-2">Item:</span>
                        {item.fullName}
                      </TableCell>
                      <TableCell className="flex item-center lg:table-cell p-2 w-full">
                        <span className="font-semibold lg:hidden mr-2">Items left - shelf:</span>
                        {item.sites.length > 0 ? (item.sites[0].quantityOnsite ?? 0) : 0}
                      </TableCell>
                      <TableCell className="flex items-center lg:table-cell p-2 w-full">
                        <span className="font-semibold lg:hidden mr-2">Ordered:</span>
                        <input
                          type="number"
                          min={1}
                          value={item.quantityOrdered === 0 ? '' : item.quantityOrdered}
                          onChange={(e) => {
                            const value = e.target.value;
                            const numericValue = Number(value);
                            if (value === '' || numericValue > 0) {
                              handleQuantityChange(item.fullName, value);
                            }
                          }}
                          onBlur={() => {
                            if (item.quantityOrdered === '' || Number(item.quantityOrdered) === 0) {
                              handleQuantityChange(item.fullName, "1");
                            }
                            handleQuantityBlur(item);
                          }}
                          className="w-[90px] p-1 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 lg:w-16"
                        />
                      </TableCell>
                      <TableCell className="flex items-center lg:table-cell p-2 w-full">
                        <span className="font-semibold lg:hidden mr-2">U/M:</span>
                        <span>{unitSelections[item.fullName] || item.selectedUnit || item.unitOfMeasureSetRef?.fullName || '---'}</span>


                        {/* {item.unitsOfMeasure?.length > 0 ? (
                          <select
                            className="border rounded p-1 text-sm"
                            value={unitSelections[item.fullName] || ''}
                            onChange={(e) => {
                              const newUnit = e.target.value;

                              console.log(`User selected unit of measure for "${item.fullName}":`, newUnit);

                              setUnitSelections((prev) => ({
                                ...prev,
                                [item.fullName]: newUnit,
                              }));

                              const updatedItems = selectedItems.map((i) =>
                                i.fullName === item.fullName
                                  ? {
                                    ...i,
                                    unitOfMeasureSetRef: {
                                      ...i.unitOfMeasureSetRef,
                                      fullName: newUnit,
                                    },
                                  }
                                  : i
                              );

                              dispatch({ type: 'SET_SELECTED_ITEMS', payload: updatedItems });
                            }}

                          >

                            {item.unitsOfMeasure.map((unit: any) => (
                              <option key={unit.fullName} value={unit.fullName}>
                                {unit.fullName}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span>{item.unitOfMeasureSetRef?.fullName || '---'}</span>
                        )} */}

                      </TableCell>
                      <TableCell className="flex justify-end lg:table-cell p-2 lg:group-hover:opacity-100 lg:opacity-0 transition-opacity w-full">
                        <Popover
                          open={openPopoverIndex === item.fullName}
                          onOpenChange={(open) =>
                            dispatch({ type: 'SET_OPEN_POPOVER_INDEX', payload: open ? item.fullName : null })
                          }
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              type="button"
                              className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80">
                            <div className="grid gap-4">
                              <div className="space-y-2">
                                <h4 className="font-medium leading-none">Delete Item</h4>
                                <p className="text-sm text-muted-foreground">
                                  Are you sure you want to delete this item?
                                </p>
                              </div>
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="px-3"
                                  onClick={() => dispatch({ type: 'SET_OPEN_POPOVER_INDEX', payload: null })}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => {
                                    handleDeleteItem(item.fullName);
                                    dispatch({ type: 'SET_OPEN_POPOVER_INDEX', payload: null });
                                  }}
                                  className="px-3"
                                >
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center p-4">
                      No items added yet.
                    </TableCell>
                  </TableRow>
                )}
                {isEditing && selectedOrder ? (
                  <>
                    {/* Combobox visible only during editing */}
                    <ROComboBox onItemSelect={handleItemSelect} resetFields={resetFields} />

                    <div className="flex flex-col md:flex-row gap-2 items-stretch md:items-center justify-end w-full p-3">
                      {/* <Button
                        variant="default"
                        type="button"
                        onClick={handleAddProducts}
                        disabled={isSaving}
                      >
                        Update Request Order
                      </Button> */}

                      {/* Optional: Other editing buttons if needed */}
                      <Button
                        variant="default"
                        type="button"
                        onClick={handleSaveAndAdd}
                        disabled={isSaving}
                      >
                        Save & New
                      </Button>


                      <Button variant="danger" type="button" onClick={handleClearConfirmationOpen} disabled={isSubmitting}>
                        Clear
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* ComboBox visible only if NOT editing */}
                    <ROComboBox onItemSelect={handleItemSelect} resetFields={resetFields} />

                    <div className="flex flex-col md:flex-row gap-2 items-stretch md:items-center justify-end w-full p-3">
                      <Button variant="outline" type="button" onClick={handleSubmitOrder} disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Submit Request Order'}
                      </Button>
                      <Button variant="default" type="button" onClick={handleSaveItem} disabled={isSaving}>
                        Save & New
                      </Button>
                      <Button variant="danger" type="button" onClick={handleClearConfirmationOpen} disabled={isSubmitting}>
                        Clear
                      </Button>
                    </div>
                  </>
                )}

              </TableBody>
              <TableFooter>
                <TableRow></TableRow>
              </TableFooter>
            </Table>
          </div>
        </form>


      </Form>

      <Dialog
        open={showClearDialog}
        onOpenChange={(open) => dispatch({ type: 'SET_SHOW_CLEAR_DIALOG', payload: open })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clear Form</DialogTitle>
            <DialogDescription>
              Are you sure you want to clear all fields? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={handleClearConfirmationClose}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleClearForm}>
              Clear All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Inner Modal for Bulk Add Items */}
      {showProductsModal && (
        <InnerModal title="Add Bulk Items">
          <BulkSelect onItemsSelected={handleBulkItemsSelected} />
        </InnerModal>
      )}
    </React.Fragment>
  );
};

export default RequestOrderForm;
