import { OrderResponse, RequestOrderResponse, RequestOrderItem } from '@/utils/types';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'sonner';
import { RequestOrderStatuses } from './constants';
import { WebService } from '@/web-services/WebService';

type RequestOrderState = {
  requestOrders: OrderResponse[];
  allOrders: OrderResponse[];
  combinedItems: RequestOrderItem[];
  isLoading: boolean;
  error: string | null;
};

const initialState: RequestOrderState = {
  requestOrders: [],
  allOrders: [],
  combinedItems: [],
  isLoading: false,
  error: null,
};

type FetchOrdersParams = {
  filterBy: string;
  orderStatus: string;
  dispenser: {
    name: string;
    accountId: string;
  };
  facilityName: string;
  tillNo: string;
};

type FetchAllOrdersParams = {
  dispenser: {
    name: string;
    accountId: string;
  };
  facilityName: string;
  tillNo: string;
  filterBy: string;
  orderStatus: string;
};

type UpdateQuantityParams = {
  orderId: string;
  item: {
    itemName: string;
    quantity: number;
  };
  dispenser: {
    name: string;
    accountId: string;
  };
};

type UpdateOrderStatusParams = {
  order: OrderResponse;
  newStatus: string;
  userType: string;
  currentStatus: string;
  dispenser: {
    name: string;
    accountId: string;
  };
};

type UpdateProductStatusParams = {
  orderId: string;
  item: {
    itemName: string;
    listID: string;
    orderItemStatus: string;
  };
  dispenser: {
    name: string;
    accountId: string;
  };
};

type DeleteProductParams = {
  orderId: string;
  item: {
    itemName: string;
    quantity: number;
    unitOfMeasure?: string;
  };
  dispenser: {
    name: string;
    accountId: string;
  };
};

type AddProductsParams = {
  orderId: string;
  items: Array<{
    itemName: string;
    quantity: number;
    unitOfMeasure: string;
  }>;
  dispenser: {
    name: string;
    accountId: string;
  };
};



export const requestOrdersList = createAsyncThunk(
  'requestOrders/fetchList',
  async (params: FetchOrdersParams, { rejectWithValue }) => {
    // const loadingToast = toast.loading('Fetching orders...');
    const { filterBy, orderStatus, dispenser, tillNo } = params;
    const { name, accountId } = dispenser;
    const facilityName = localStorage.getItem('facilityName');

    try {
      const requestBody = {
        requestType: 'GET_ORDERS',
        dispenser: {
          accountId: accountId,
          name: name,
        },
        orderStatus: orderStatus,
        facilityName: facilityName,
        tillNo: tillNo,
        filterBy: filterBy || 'R_ALL',
      };

      console.log('Request Body-1:', requestBody);

      const response = await WebService.postPharma('requestOrder', requestBody);
      const ordersResponse = response as unknown as RequestOrderResponse;

      // toast.dismiss(loadingToast);

      if (ordersResponse?.status && Array.isArray(ordersResponse.message)) {
        // toast.success('Orders fetched successfully!');
        return ordersResponse.message;
      } else {
        toast.error('Failed to fetch orders.');
        return rejectWithValue('Invalid response format or empty orders list');
      }
    } catch (error) {
      // toast.dismiss(loadingToast);
      toast.error('Failed to fetch orders.');
      return rejectWithValue('Failed to fetch orders');
    }
  },
);

export const fetchAllOrders = createAsyncThunk(
  'requestOrders/fetchAll',
  async (params: FetchAllOrdersParams, { rejectWithValue }) => {
    const { dispenser, tillNo, orderStatus } = params;
    const { name, accountId } = dispenser;

    // Get user role from localStorage
    const userRole = localStorage.getItem('userRole');
    
    // Determine filterBy based on role
    const filterBy = userRole === 'DISPENSER' ? 'R_FACILITY' : 'R_ALL';
    const facilityName = localStorage.getItem('facilityName') || '';

    try {
      const requestBody = {
        requestType: 'GET_ORDERS',
        dispenser: {
          accountId: accountId,
          name: name,
        },
        orderStatus: orderStatus,
        facilityName: facilityName,
        tillNo: tillNo,
        filterBy: filterBy, // dynamically set
      };

      console.log('Request Body:', requestBody);

      const response = await WebService.postPharma('requestOrder', requestBody);
      const ordersResponse = response as unknown as RequestOrderResponse;

      if (ordersResponse?.status && Array.isArray(ordersResponse.message)) {
        return ordersResponse.message;
      } else {
        return rejectWithValue('Invalid response format or empty orders list');
      }
    } catch (error) {
      return rejectWithValue('Failed to fetch all orders');
    }
  },
);


// export interface FetchAllOrdersParams {
//   dispenser: {
//     name: string;
//     accountId: string;
//   };
//   facilityName?: string;
//   tillNo?: string;
//   orderStatus?: string;
// }

// export const fetchAllOrders = async (params: FetchAllOrdersParams) => {
//   const { dispenser, facilityName, tillNo, orderStatus } = params;
//   const { name, accountId } = dispenser;

//   const userRole = localStorage.getItem('adsRole');
//   const filterBy = userRole === 'DISPENSER' ? 'R_FACILITY' : 'R_ALL';

//   const requestBody = {
//     requestType: 'GET_ORDERS',
//     dispenser: {
//       accountId: accountId,
//       name: name,
//     },
//     orderStatus: orderStatus,
//     facilityName: facilityName,
//     tillNo: tillNo,
//     filterBy: filterBy,
//   };

//   const response = await postRawData('requestOrder', requestBody);
//   console.log('Request Body:', requestBody);
//   const ordersResponse = response as unknown as RequestOrderResponse;

//   if (ordersResponse?.status && Array.isArray(ordersResponse.message)) {
//     return ordersResponse.message;
//   } else {
//     throw new Error('Invalid response format or empty orders list');
//   }
// };

export const updateItemQuantity = createAsyncThunk(
  'requestOrders/updateQuantity',
  async (params: UpdateQuantityParams, { rejectWithValue }) => {
    const loadingToast = toast.loading('Updating quantity...');
    const { orderId, item, dispenser } = params;
    const { name, accountId } = dispenser;
    const { itemName, quantity } = item;

    try {
      const requestBody = {
        requestType: 'UPDATE_QUANITY',
        orderId,
        dispenser: {
          accountId: accountId,
          name: name,
        },
        items: [
          {
            itemName,
            quantity,
          },
        ],
      };

      const response = await WebService.postPharma('requestOrder', requestBody);

      toast.dismiss(loadingToast);

      if (response.status) {
        toast.success('Quantity updated successfully!');
        return response;
      } else {
        toast.error(`Failed to update quantity: ${response.message}`);
        return rejectWithValue('Failed to update quantity');
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(`Failed to update quantity: ${error.message}`);
      return rejectWithValue('Failed to update quantity');
    }
  },
);

// Helper function to check if the status transition is valid
const isValidStatusTransition = (currentStatus: string, newStatus: string, orderStatuses: string[]): boolean => {
  // Convert both statuses to uppercase for comparison
  const currentStatusUpper = currentStatus.toUpperCase();
  const newStatusUpper = newStatus.toUpperCase();

  // If trying to set the same status, it's valid
  if (currentStatusUpper === newStatusUpper) {
    return true;
  }

  // Get the index of both statuses in the OrderStatuses array
  const currentIndex = orderStatuses.indexOf(currentStatusUpper);
  const newIndex = orderStatuses.indexOf(newStatusUpper);

  // Check if the new status is one step forward or one step backward
  return newIndex === currentIndex + 1 || newIndex === currentIndex - 1;
};

export const updateOrderStatus = createAsyncThunk(
  'requestOrders/updateStatus',
  async (params: UpdateOrderStatusParams, { rejectWithValue }) => {
    const loadingToast = toast.loading('Updating status...');
    const { order, newStatus, userType, dispenser } = params;
    const { name, accountId } = dispenser;
    try {
      // Handle dispatcher permission restrictions
      if (userType === 'DISPENSER') {
        const currentOrderStatus = order.orderStatus?.toUpperCase() || '';
        const updatedStatus = newStatus.toUpperCase();

        if (currentOrderStatus !== 'GENERAL' && currentOrderStatus !== 'ORDERS') {
          toast.error('As a dispenser, you can only view this status');
          toast.dismiss(loadingToast);
          return rejectWithValue('Permission denied for dispenser');
        }

        // Prevent dispensers from changing ORDERS back to GENERAL
        if (currentOrderStatus === 'ORDERS' && updatedStatus === 'GENERAL') {
          toast.error('As a dispenser, you cannot change orders from ORDERS back to GENERAL');
          toast.dismiss(loadingToast);
          return rejectWithValue('Permission denied: Cannot move orders back to GENERAL');
        }

        if (updatedStatus !== 'GENERAL' && updatedStatus !== 'ORDERS') {
          toast.error('As a dispenser, you can only change to GENERAL or ORDERS status');
          toast.dismiss(loadingToast);
          return rejectWithValue('Invalid status change for dispenser');
        }
      }

      // Check if the status transition is valid
      if (!isValidStatusTransition(order.orderStatus || '', newStatus, RequestOrderStatuses)) {
        toast.error(
          `Cannot skip stages. Status can only move one step forward or backward in sequence: ${RequestOrderStatuses.join(' → ')}`,
        );
        toast.dismiss(loadingToast);
        return rejectWithValue('Invalid status transition');
      }

      const updateStatusPayload = {
        requestType: 'UPDATE_R_STATUS',
        orderId: order.orderId,
        dispenser: {
          name,
          accountId,
        },
        orderStatus: newStatus.toUpperCase(),
      };

      const response = await WebService.postPharma('requestOrder', updateStatusPayload);

      toast.dismiss(loadingToast);

      if (response) {
        toast.success('Status updated successfully');
        // Don't refresh here - we handle this in the component
        return response;
      } else {
        toast.error('Failed to update status');
        return rejectWithValue('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.dismiss(loadingToast);
      toast.error('Failed to update status');
      return rejectWithValue('Failed to update status');
    }
  },
);

export const updateProductStatus = createAsyncThunk(
  'requestOrders/updateProductStatus',
  async (params: UpdateProductStatusParams, { rejectWithValue }) => {
    const loadingToast = toast.loading('Updating product status...');
    const { orderId, item, dispenser } = params;
    const { itemName, listID, orderItemStatus } = item;
    const { name, accountId } = dispenser;

    try {
      const requestBody = {
        requestType: 'UPDATE_ONE',
        orderId: orderId,
        dispenser: {
          name: name,
          accountId: accountId,
        },
        items: [
          {
            itemName: itemName,
            listID: listID,
            orderItemStatus: orderItemStatus,
          },
        ],
      };

      const response = await WebService.postPharma('requestOrder', requestBody);

      toast.dismiss(loadingToast);

      if (response && response.status) {
        toast.success('Product status updated successfully!');
        // Don't refresh here - we'll handle this in the component
        return response;
      } else {
        toast.error(`${response?.message || 'Failed to update product status.'}`);
        return rejectWithValue('Failed to update product status');
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Failed to update product status.');
      return rejectWithValue('Failed to update product status');
    }
  },
);

export const deleteProduct = createAsyncThunk(
  'requestOrders/deleteProduct',
  async (params: DeleteProductParams, { rejectWithValue }) => {
    const loadingToast = toast.loading('Deleting product...');
    const { orderId, item, dispenser } = params;
    const { itemName, quantity, unitOfMeasure } = item;
    const { name, accountId } = dispenser;

    try {
      // Remove 'Count by ' prefix from unitOfMeasure if it exists
      let cleanUnitOfMeasure = unitOfMeasure || '';
      if (cleanUnitOfMeasure.startsWith('Count by ')) {
        cleanUnitOfMeasure = cleanUnitOfMeasure.replace('Count by ', '');
      }

      const requestBody = {
        requestType: 'DELETE_PRODUCT',
        orderId: orderId,
        items: [
          {
            itemName: itemName,
            quantity: quantity,
            unitOfMeasure: cleanUnitOfMeasure,
          },
        ],
        dispenser: {
          name: name,
          accountId: accountId,
        },
      };

      const response = await WebService.postPharma('requestOrder', requestBody);

      toast.dismiss(loadingToast);

      if (response && response.status) {
        toast.success('Product deleted successfully!');
        return response;
      } else {
        toast.error(`Failed to delete product: ${response?.message || 'Unknown error'}`);
        return rejectWithValue('Failed to delete product');
      }
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error(`Failed to delete product: ${error.message || 'Unknown error'}`);
      return rejectWithValue('Failed to delete product');
    }
  },
);

export const addProducts = createAsyncThunk(
  'requestOrders/addProducts',
  async (params: AddProductsParams, { rejectWithValue }) => {
    const loadingToast = toast.loading('Adding products...');
    const { orderId, items, dispenser } = params;
    const { name, accountId } = dispenser;

    try {
      const requestBody = {
        requestType: 'ADD_PRODUCTS',
        orderId: orderId,
        items: items.map((item) => {
          // Remove 'Count by ' prefix from unitOfMeasure if it exists
          let unitOfMeasure = item.unitOfMeasure || '';
          if (unitOfMeasure.startsWith('Count by ')) {
            unitOfMeasure = unitOfMeasure.replace('Count by ', '');
          }

          return {
            itemName: item.itemName,
            quantity: item.quantity,
            unitOfMeasure: unitOfMeasure,
            orderItemStatus: "ADDED"
          };
        }),
        dispenser: {
          name: name,
          accountId: accountId,
        },
      };

      const response = await WebService.postPharma('requestOrder', requestBody);

      toast.dismiss(loadingToast);

      if (response && response.status) {
        toast.success('Products added successfully!');
        return response;
      } else {
        toast.error(`Failed to add products: ${response?.message || 'Unknown error'}`);
        return rejectWithValue('Failed to add products');
      }
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error(`Failed to add products: ${error.message || 'Unknown error'}`);
      return rejectWithValue('Failed to add products');
    }
  },
);

const requestOrderSlice = createSlice({
  name: 'requestOrder',
  initialState,
  reducers: {
    setRequestOrders: (state, action: PayloadAction<OrderResponse[]>) => {
      state.requestOrders = action.payload;
    },
    setAllOrders: (state, action: PayloadAction<OrderResponse[]>) => {
      state.allOrders = action.payload;
    },
    setCombinedItems: (state, action: PayloadAction<RequestOrderItem[]>) => {
      state.combinedItems = action.payload;
    },
    clearOrdersError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle requestOrdersList
      .addCase(requestOrdersList.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(requestOrdersList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.requestOrders = action.payload;
        // If fetching all orders, also update allOrders
        if (action.meta.arg.filterBy === 'R_ALL' || !action.meta.arg.filterBy) {
          state.allOrders = action.payload;
        }
      })
      .addCase(requestOrdersList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Handle fetchAllOrders
      .addCase(fetchAllOrders.pending, (state) => {
        // Don't set isLoading for background fetches
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.allOrders = action.payload;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Handle updateItemQuantity
      .addCase(updateItemQuantity.pending, (state) => {
        state.error = null;
        // Don't set isLoading to true to avoid unnecessary UI flickering during quantity updates
      })
      .addCase(updateItemQuantity.fulfilled, (state, action) => {
        // We don't need to update state here as the list will be refreshed by the component
        state.error = null;
      })
      .addCase(updateItemQuantity.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Handle updateOrderStatus
      .addCase(updateOrderStatus.pending, (state) => {
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.error = null;
        // The thunk will refresh the order list as needed
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Handle updateProductStatus
      .addCase(updateProductStatus.pending, (state) => {
        state.error = null;
      })
      .addCase(updateProductStatus.fulfilled, (state, action) => {
        state.error = null;
        // The thunk will refresh the order list as needed
      })
      .addCase(updateProductStatus.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Handle deleteProduct
      .addCase(deleteProduct.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.error = null;
        // The thunk will refresh the order list as needed
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Handle addProducts
      .addCase(addProducts.pending, (state) => {
        state.error = null;
      })
      .addCase(addProducts.fulfilled, (state, action) => {
        state.error = null;
        // The thunk will refresh the order list as needed
      })
      .addCase(addProducts.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { setRequestOrders, setAllOrders, clearOrdersError } = requestOrderSlice.actions;

export default requestOrderSlice;
