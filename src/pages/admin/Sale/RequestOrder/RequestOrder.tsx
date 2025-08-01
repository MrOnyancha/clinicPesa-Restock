import React, { useState, useEffect, useMemo, useRef } from 'react';
import { format } from 'date-fns';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { createRoot } from 'react-dom/client';
import RequestOrderItemsPDF from './RequestOrderItemsPDF';
import { toast } from 'sonner';
import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Modal,
    onOpenModal,
    Loader,
} from '@/components';

import type { RootState } from '@/store/store';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import RequestOrderForm from './RequestOrderForm';
import { selectUserProfile, selectUserType } from '@/pages/auth/authSlice';
import { OrderResponse, RequestOrderItem } from '@/utils/types'; // OrderResponse will be replaced by Ordery

// import { toast } from 'sonner';
import { RequestOrderStatuses } from './constants';
import { useFetchOrdersByStatus } from '../../../../utils/useFetchOrders';
import type { Ordery } from '../../../../utils/useFetchOrders';
import {
    useAddProductItems,
    useUpdateOrderStatus,
    useUpdateProductItemStatus,
} from '../../../../utils/useOrderMutations';
import { useOrderStatistics } from './useOrderStatics';
import { useQueryClient } from '@tanstack/react-query';
import { useSubmitCombinedOrders } from '../../../../utils/useSubmitCombinedOrders';
import { useAddItemNote } from '../../../../utils/useAddItemNote';
import NoteModal from './NoteModule';
import { FaComments } from 'react-icons/fa';
import NotesCell from './NoteCell';
import { useNavigate } from 'react-router-dom';

const productStatuses = ['ADDED', 'PENDING', 'READY', 'UNSUPPLIED', 'SUPPLIED'];

const RequestOrder: React.FC = () => {
    const [selectedOrder, setSelectedOrder] = useState<Ordery | null>(null); // Changed to Ordery
    const [filteredOrdersList, setFilteredOrdersList] = useState<Ordery[]>([]); // Changed to Ordery
    const queryClient = useQueryClient();
    const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
    const [editableQuantities, setEditableQuantities] = useState<Record<string, number>>({});
    const [selectedItems, setSelectedItems] = useState<Record<string, Set<string>>>({});
    const [search, setSearch] = useState('');
    const [searchedItems, setSearchedItems] = useState<RequestOrderItem[]>([]);
    const [toBeAddedItem, setToBeAddedItem] = useState<RequestOrderItem | null>(null);
    const navigate = useNavigate();
    const [orderBgColor, setOrderBgColor] = useState<{ [key: string]: string }>({});
    const [openOrderId, setOpenOrderId] = React.useState<string | null>(null);

    const showModalState = useAppSelector((state) => state.modal.isOpen);
    const phoneNumber = localStorage.getItem('account_id');
    const userType = localStorage.getItem('adsRole');
    const dispenserName = localStorage.getItem('FirstName');
    const adsRole = localStorage.getItem('adsRole');
    const hasEditPermission = adsRole === 'ADMIN' || adsRole === 'RESTOCKING' || adsRole === 'DISPENSER';
    const isRestock = adsRole === 'RESTOCKING';
    const dispenser = adsRole === 'DISPENSER';
    const [allOrders, setAllOrders] = useState<Ordery[]>([]);
    const [allOrdersList, setAllOrdersList] = useState<Ordery[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<string>('GENERAL');

    const currentMonth = new Date().getMonth() + 1;
    // const role = localStorage.getItem('adsRole');
    const tillNoStr = localStorage.getItem('adsStation');
    const tillNo = tillNoStr ? parseInt(tillNoStr) : undefined;

    const { data: orderStats, error, isLoading: isLoadingOrderStats, refetch: refetchOrderStatus } = useOrderStatistics({
        tillNo: adsRole === 'DISPENSER' ? tillNo : undefined,
    });

    const { data: statusOrders, refetch: refetchOrders, error: statusOrdersError, isLoading: isLoadingStatusOrders } = useFetchOrdersByStatus(selectedStatus);

    // Now you can pick which one to use or combine them if needed
    const isLoading = isLoadingOrderStats || isLoadingStatusOrders;

    const sortedOrders = React.useMemo(() => {
        if (!statusOrders) return [];
        return [...statusOrders].sort((a, b) => b.timeStamp - a.timeStamp);
    }, [statusOrders]);

    useEffect(() => {
        const checkOrderBgColor = () => {
            const newOrderBgColor: { [key: string]: string } = {};
            const currentTime = new Date().getTime();
            sortedOrders.forEach(order => {
                if (order.orderStatus === 'GENERAL') {
                    const orderCreationTime = new Date(order.timeStamp).getTime();
                    const timeDifference = currentTime - orderCreationTime;
                    // Check if the order has been in GENERAL status for more than 24 hours (86400000 milliseconds)
                    if (timeDifference > 86400000) {
                        newOrderBgColor[order.orderId] = 'bg-red-300'; // Red background
                    } else {
                        newOrderBgColor[order.orderId] = 'bg-white'; // Default background
                    }
                } else {
                    newOrderBgColor[order.orderId] = 'bg-white'; // Default background for other statuses
                }
            });
            setOrderBgColor(newOrderBgColor);
        };
        checkOrderBgColor();
        const intervalId = setInterval(checkOrderBgColor, 60000); // Check every minute
        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    }, [sortedOrders]);



    // Instantiate mutation hooks
    const updateOrderStatusMutation = useUpdateOrderStatus();

    const { mutate: updateProductItemStatus } = useUpdateProductItemStatus();

    const [itemStatuses, setItemStatuses] = useState<Record<string, string>>({});

    const handleItemStatusChange = async (
        newStatus: string,
        orderId: string,
        itemIndex: number,
        item: {
            itemName: string;
            listID: string;
        }
    ) => {
        try {
            await updateProductItemStatus({
                orderId,
                item: {
                    ...item,
                    orderItemStatus: newStatus,
                },
            });

            // Update local UI state for that specific item
            setItemStatuses((prev) => ({
                ...prev,
                [`${orderId}|${itemIndex}`]: newStatus,
            }));

            console.log(`Item '${item.itemName}' updated to status '${newStatus}'`);
        } catch (error) {
            console.error(`Failed to update item '${item.itemName}':`, error);
        }
    };

    const handleFilterChange = (status: string) => {
        setSelectedStatus(status.toUpperCase());
    };


    const dispatch = useAppDispatch(); // Keep for non-order related dispatches like onOpenModal, fetchSites

    const responseProcessedRef = useRef<{ [orderId: string]: boolean }>({});

    const handleOrderResponseChange = (response: Ordery) => { // Changed to Ordery
        if (response?.orderId && responseProcessedRef.current[response.orderId]) {
            return;
        }
        if (response?.orderId) {
            responseProcessedRef.current[response.orderId] = true;
        }

        setTimeout(() => {
            if (response?.orderId) {
                responseProcessedRef.current[response.orderId] = false;
            }
        }, 2000);
        refetchOrderStatus();
    };

    const handleOrderStatusChange = (order: Ordery, newStatus: string) => {

        if (userType === 'RESTOCKING' && order.orderStatus.toUpperCase() === 'GENERAL' && newStatus.toUpperCase() === 'ORDERS') {
            toast.error('Restocking users are not permitted to change order status from GENERAL to ORDERS.');
            return;
        }

        // Call your mutation to update the main order status
        updateOrderStatusMutation.mutate(
            { order, newStatus, userType },
            {
                onSuccess: async () => {
                    setSelectedStatus(newStatus);
                    await queryClient.invalidateQueries({ queryKey: ['orderStatistics'] });
                    toast.success(`Order status changed to ${newStatus}`);
                    console.log(`Order ${order.orderId} status successfully changed to ${newStatus}`);
                },
                onError: (error) => {
                    toast.error(`Failed to change order status: ${error.message}`);
                    console.error('Mutation error:', error);
                }
            }
        );
    };


    const handleEditOrder = (order: Ordery) => {
        const adsRole = localStorage.getItem('adsRole') ?? '';

        const hasEditPermission = ['ADMIN', 'DISPENSER', 'RESTOCKING'].includes(adsRole);

        if (order.orderStatus === 'GENERAL') {
            if (hasEditPermission) {
                setSelectedOrder(order);
                dispatch({ type: 'SET_IS_EDITING', payload: true });
                dispatch(onOpenModal());
                refetchOrders();
            } else {
                toast.error('You do not have permission to edit this order');
            }
        } else {
            toast.error('Only orders with General status can be edited');
        }
    };



    // Get the valid status options for a given role and current status
    const getFilteredStatusOptions = (role: string, currentStatus: string = ''): string[] => {
        const currentStatusUpper = currentStatus.toUpperCase();

        // dispenser can only set these statuses
        if (role === 'DISPENSER') {
            // If current status is GENERAL, only allow changing to ORDERS
            if (currentStatusUpper === 'GENERAL') {
                return ['GENERAL', 'ORDERS'];
            }
            // If current status is ORDERS, only return ORDERS (cannot change back to GENERAL)
            else if (currentStatusUpper === 'ORDERS') {
                return ['ORDERS'];
            }
            // For any other status, only return the current status (no changes allowed)
            else {
                return [currentStatusUpper];
            }
        }

        // Specific restrictions for restocking users
        if (role === 'RESTOCKING') {
            // If current status is GENERAL, don't allow changing to ORDERS
            if (currentStatusUpper === 'GENERAL') {
                return ['GENERAL']; // Only show current status, preventing change to ORDERS
            }
        }

        // Admin and other roles (except DISPENSER) have more flexibility
        if (currentStatusUpper) {
            const currentIndex = RequestOrderStatuses.indexOf(currentStatusUpper);

            // For all statuses, create an array with available options
            const availableOptions = [];

            // If not the first status (not GENERAL), include previous status
            if (currentIndex > 0) {
                availableOptions.push(RequestOrderStatuses[currentIndex - 1]);
            }

            // Always include current status
            availableOptions.push(currentStatusUpper);

            // If not the last status, include next status
            if (currentIndex < RequestOrderStatuses.length - 1) {
                availableOptions.push(RequestOrderStatuses[currentIndex + 1]);
            }

            return availableOptions;
        }

        // Return all statuses if no current status specified
        return RequestOrderStatuses;
    };

    // Handle quantity change for an item in a PROCESSING order
    const handleQuantityChange = (orderId: string, itemName: string, currentQuantity: number) => {
        // Create a key to track this specific item
        const itemKey = `${orderId}_${itemName}`;

        // Initialize the value in state if not already set
        if (editableQuantities[itemKey] === undefined) {
            setEditableQuantities((prev) => ({
                ...prev,
                [itemKey]: currentQuantity,
            }));
        }
    };

    // Handle quantity input change
    const handleQuantityInputChange = (orderId: string, itemName: string, value: string) => {
        const quantity = parseInt(value, 10);
        if (!isNaN(quantity) && quantity >= 0) {
            const itemKey = `${orderId}_${itemName}`;
            setEditableQuantities((prev) => ({
                ...prev,
                [itemKey]: quantity,
            }));
        }
    };

    // Handle quantity update on blur (when focus leaves the input)
    const handleQuantityBlur = (order: OrderResponse, itemName: string) => {
        // Don't update if there's no change or no value
        const key = `${order.orderId}_${itemName}`;
        if (
            editableQuantities[key] === undefined ||
            (order.items && order.items.find((item) => item.itemName === itemName)?.quantity === editableQuantities[key])
        ) {
            return;
        }
    };

    // Handle selecting/deselecting a single item
    const handleItemSelect = (orderId: string, itemName: string, checked: boolean) => {
        setSelectedItems((prev) => {
            const orderItems = prev[orderId] || new Set<string>();
            const updatedItems = new Set(orderItems);

            if (checked) {
                updatedItems.add(itemName);
            } else {
                updatedItems.delete(itemName);
            }

            return {
                ...prev,
                [orderId]: updatedItems,
            };
        });
    };

    // Handle selecting/deselecting all items in an order
    const handleSelectAllItems = (order: OrderResponse, checked: boolean) => {
        if (!order.items || order.items.length === 0) return;

        setSelectedItems((prev) => {
            if (checked) {
                // Select all items
                const allItemNames = new Set(order.items.map((item) => item.itemName));
                return {
                    ...prev,
                    [order.orderId]: allItemNames,
                };
            } else {
                // Deselect all items
                return {
                    ...prev,
                    [order.orderId]: new Set<string>(),
                };
            }
        });
    };


    const areAllItemsSelected = (order: OrderResponse): boolean => {
        if (!order.items || order.items.length === 0) return false;
        const orderSelectedItems = selectedItems[order.orderId] || new Set<string>();
        return order.items.every((item) => orderSelectedItems.has(item.itemName));
    };

    const { mutate: submitCombinedOrders, data: combinedResponse } = useSubmitCombinedOrders();

    const handleSubmitProcessingOrders = () => {
        const processingOrders = sortedOrders?.filter(order => order.orderStatus === 'PROCESSING');

        if (!processingOrders || processingOrders.length === 0) {
            toast.warning('No processing orders available for submission.');
            return;
        }

        const orderIds = processingOrders.map(order => order.orderId);

        // Submit and then navigate on success
        submitCombinedOrders(orderIds, {
            onSuccess: () => {
                toast.success('Orders submitted to purchase successfully!');
                navigate('/admin/sale/purchase-order');
            },
            onError: (error) => {
                toast.error('Failed to submit orders.');
                console.error(error);
            }
        });
    };

    const hasRequestInGeneralOrder = sortedOrders?.some(order =>
        order.orderStatus === 'GENERAL' &&
        order.items?.length > 0 // Check for any items
    );

    const shouldEnableCreateButton = !isLoading && !hasRequestInGeneralOrder;

    const hasProcessingOrders = sortedOrders?.some(order => order.orderStatus === 'PROCESSING');

    const [noteModalOpen, setNoteModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<{ itemName: string; orderId: string } | null>(null);
    const addItemNoteMutation = useAddItemNote();
    const [showNotes, setShowNotes] = useState(false);

    const handleNoteSubmit = (comment: string) => {
        if (!selectedItem) return;

        addItemNoteMutation.mutate({
            requestType: 'ADD_R_NOTES',
            orderId: selectedItem.orderId,
            items: [
                {
                    itemName: selectedItem.itemName,
                    notes: [
                        {
                            comment,
                            commentBy: dispenserName, // You can make this dynamic
                        },
                    ],
                },
            ],
        }, {
            onSuccess: (data) => {
                console.log('✅ Note added successfully:', data);
                setNoteModalOpen(false);
            },
            onError: (error) => {
                console.error('❌ Error adding note:', error);
            }
        });
    };
    console.log('orderStats', orderStats);
    return (
        <React.Fragment>
            <section className="section">
                <div className="px-2 py-4 flex flex-col items-start md:items-center justify-between gap-4 w-full">
                    {/* Section title */}
                    <h4 className="section-heading text-center md:text-left whitespace-nowrap">
                        Request Orders
                    </h4>

                    {/* Status filters */}
                    <div className="flex flex-wrap md:flex-nowrap items-center gap-2 md:gap-4 w-full md:w-auto">
                        <div
                            id="statusCounts"
                            className="flex flex-wrap md:flex-nowrap items-center gap-4 md:gap-4"
                        >
                            {RequestOrderStatuses.map((status) => (
                                <p
                                    key={status}
                                    className={`text-xs cursor-pointer ${selectedStatus.toUpperCase() === status ? 'text-primary font-bold' : ''
                                        } text-center md:text-left rounded-md whitespace-nowrap`}
                                    onClick={() => handleFilterChange(status)}
                                >
                                    {status}:{' '}
                                    <span className="font-semibold pl-2 bg-slate-100 rounded-md text-sm">
                                        {orderStats?.statusCounts?.[status] ?? 0}
                                    </span>
                                </p>
                            ))}
                        </div>
                    </div>

                    {/* Create Request Order Button */}
                    {!isRestock && selectedStatus === 'GENERAL' && (
                        <Button
                            onClick={() => {
                                // if (shouldEnableCreateButton) {
                                //     setSelectedOrder(null);
                                //     dispatch(onOpenModal());
                                // }
                                setSelectedOrder(null);
                                    dispatch(onOpenModal());
                            }}
                            // disabled={!shouldEnableCreateButton}
                            className="whitespace-nowrap"
                            // title={hasRequestInGeneralOrder ? "Cannot create new order while GENERAL  exist" : undefined}
                        >
                            Create Request Order
                        </Button>
                    )}


                    {!dispenser && hasProcessingOrders && (
                        <Button
                            className="whitespace-nowrap px-4 py-2"
                            onClick={handleSubmitProcessingOrders}
                        >
                            Submit Processing Orders
                        </Button>
                    )}

                </div>

                <hr />
                <div className="my-4 mx-2 pb-2 border dark:border-slate-700">
                    {/* Table Header (for small screens only) */}
                    <div className="w-full px-4 flex items-center gap-2 py-3 border-b hidden lg:flex">
                        <div className="w-1/4 text-left">
                            <span className="text-sm sm:text-base font-semibold">R.O Number</span>
                        </div>
                        <div className="w-1/4 text-left">
                            <span className="text-sm sm:text-base font-semibold">Facility Name</span>
                        </div>
                        <div className="w-1/4 text-left">
                            <span className="text-sm sm:text-base font-semibold">Status</span>
                        </div>
                        <div className="w-1/4 text-left">
                            <span className="text-sm sm:text-base font-semibold">Date of Creation</span>
                        </div>
                        {hasEditPermission && (
                            <div className="w-1/4 text-left">
                                <span className="text-sm sm:text-base font-semibold">Created By</span>
                            </div>
                        )}
                    </div>
                    {isLoading ? (
                        <div className="w-full flex justify-center items-center py-8">
                            <div className="flex gap-2 items-center">
                                <Loader color="text-primary" />
                                <p className="text-sm sm:text-base text-slate-500">Loading orders, please wait...</p>
                            </div>
                        </div>
                    ) : sortedOrders && sortedOrders.length > 0 ? (
                        sortedOrders.map((order) => (
                            <Accordion
                                key={order.orderId}
                                type="single"
                                collapsible
                                onValueChange={(val) => {
                                    setOpenOrderId(val); // update which one is open

                                    if (val) {
                                        refetchOrders(); // ✅ fetch updated orders only if something opened
                                    }
                                }}
                            >

                                <AccordionItem value={order.orderId}>
                                    <AccordionTrigger
                                        showIcon={false}
                                        className={`hover:bg-primary hover:text-white border-b last:border-b-0 border-slate-200 group ${orderBgColor[order.orderId] || 'bg-white'}`}
                                    >
                                        <div className="px-4 w-full flex flex-col sm:flex-row items-start gap-4 sm:gap-6 py-3">

                                            <div className="w-full sm:w-1/4 text-left flex items-center justify-between">
                                              
                                                <span className="text-sm sm:text-base font-semibold block lg:hidden">R.O Number</span>
                                                <div className="text-sm sm:text-base">{order.orderNo}</div>
                                            </div>

                                            <div className="w-full sm:w-1/4 text-left flex items-center justify-between">
                                                <span className="text-sm sm:text-base font-semibold block lg:hidden">Facility Name</span>
                                                <div className="text-sm sm:text-base">{order.facilityName}</div>
                                            </div>

                                            <div className="w-full sm:w-1/4 text-left flex items-center justify-between">
                                                <span className="text-sm sm:text-base font-semibold block lg:hidden">Status</span>
                                                <div className="text-sm sm:text-base">
                                                    {dispenser && order.orderStatus !== 'GENERAL' && order.orderStatus !== 'ORDERS' ? (
                                                        <span className="font-semibold px-2 py-1">{order.orderStatus?.toUpperCase()}</span>
                                                    ) : (
                                                        <Select
                                                            value={order.orderStatus?.toUpperCase()}
                                                            onValueChange={(value) => handleOrderStatusChange(order, value)}
                                                        >
                                                            <SelectTrigger className="w-32 h-8 text-sm sm:text-base group-hover:text-text-color">
                                                                <SelectValue>{order.orderStatus?.toUpperCase()}</SelectValue>
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {getFilteredStatusOptions(userType, order.orderStatus).map((status) => (
                                                                    <SelectItem key={status} value={status}>
                                                                        {status}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="w-full sm:w-1/4 text-left flex items-center justify-between">
                                                <span className="text-sm sm:text-base font-semibold block lg:hidden">Date of Creation</span>
                                                <div className="text-sm sm:text-base">{format(order.timeStamp, 'yyyy-MM-dd, hh:mm a')}</div>
                                            </div>

                                            {hasEditPermission && (
                                                <div className="w-full sm:w-1/4 text-left flex items-center justify-between">
                                                    <span className="text-sm sm:text-base font-semibold block lg:hidden">Created By</span>
                                                    <div className="text-sm sm:text-base">{order.dispenser?.name}</div>

                                                    <img
                                                        src="/images/pencil.png"
                                                        alt="edit"
                                                        className="h-6 opacity-100 cursor-pointer ml-2" // Ensuring the pencil icon is visible
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleEditOrder(order);
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        {/* Detailed view (use Table inside Accordion Content) */}
                                        <div className="w-full overflow-x-auto rounded-md border border-gray-200">
                                            <Table className="min-w-[600px] w-full text-sm sm:text-base bg-white">
                                                <TableHeader>
                                                    <TableRow className="bg-gray-100">
                                                        <TableHead className="text-left">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-1">
                                                                   <span className='mr-2'>#</span>  <span>Products</span>
                                                                </div>
                                                            </div>
                                                        </TableHead>
                                                        <TableHead className="text-left">Quantity</TableHead>
                                                        <TableHead className="text-left">U/M</TableHead>
                                                        <TableHead className="text-left">Status</TableHead>
                                                    </TableRow>
                                                </TableHeader>

                                                <TableBody>
                                                    {order.items &&
                                                        order.items.map((product, index) => (
                                                            <TableRow key={index} className="hover:bg-gray-50">
                                                                <TableCell><span className='mr-2'>{index + 1} ) </span>{product?.itemName || '---'}</TableCell>
                                                                <TableCell>{product?.quantity || '---'}</TableCell>
                                                                <TableCell>{product?.unitOfMeasure || '---'}</TableCell>
                                                                <TableCell>
                                                                    {order.orderStatus === 'DELIVERED' ? (
                                                                        <select
                                                                            value={
                                                                                itemStatuses[`${order.orderId}|${index}`] ??
                                                                                product.orderItemStatus ??
                                                                                ''
                                                                            }
                                                                            onChange={(e) => {
                                                                                const newStatus = e.target.value;

                                                                                if (newStatus === 'UNSUPPLIED') {
                                                                                    setSelectedItem({ itemName: product.itemName, orderId: order.orderId });
                                                                                    setNoteModalOpen(true);
                                                                                }

                                                                                handleItemStatusChange(newStatus, order.orderId, index, {
                                                                                    itemName: product.itemName,
                                                                                    listID: product.listID,
                                                                                });
                                                                            }}
                                                                            className="border rounded px-2 py-1"
                                                                        >
                                                                            <option value="">Select status</option>
                                                                            <option value="UNSUPPLIED">UNSUPPLIED</option>
                                                                            <option value="SUPPLIED">SUPPLIED</option>
                                                                        </select>

                                                                    ) : (
                                                                        product?.orderItemStatus || '---'
                                                                    )}
                                                                </TableCell>
                                                                <NotesCell product={product} />
                                                            </TableRow>
                                                        ))}
                                                </TableBody>
                                            </Table>
                                            <NoteModal
                                                open={noteModalOpen}
                                                itemName={selectedItem?.itemName || ''}
                                                onClose={() => setNoteModalOpen(false)}
                                                onSubmit={handleNoteSubmit}
                                            />
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        ))
                    ) : (
                        <div className="w-full flex justify-center items-center py-12 border-b border-slate-200">
                            <div className="flex flex-col items-center">
                                <p className="text-sm sm:text-base font-semibold text-slate-600">No request orders found</p>
                                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                                    {selectedStatus !== 'GENERAL'
                                        ? `No orders with status "${selectedStatus}" found. Try another status filter.`
                                        : 'Try changing your filter or create a new request order'}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </section>
            {showModalState && (
                <Modal title={selectedOrder ? 'Edit Request Order' : 'Create Request Order'}>
                    {selectedOrder ? (
                        <RequestOrderForm onOrderResponseChange={handleOrderResponseChange} selectedOrder={selectedOrder} />
                    ) : (
                        <RequestOrderForm onOrderResponseChange={handleOrderResponseChange} />
                    )}
                </Modal>
            )}
        </React.Fragment>
    );
};

export default RequestOrder;
