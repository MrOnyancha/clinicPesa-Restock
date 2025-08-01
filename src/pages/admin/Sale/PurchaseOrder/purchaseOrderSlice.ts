import { WebService } from '@/web-services/WebService';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'sonner';

// Define types for vendors
export interface Vendor {
  name: string;
  listID: string;
  email: string;
  phone: string;
  isActive: boolean;
  vendorAddress: string;
  // Add any other vendor properties as needed
}

// Define the response type for vendor queries
export interface VendorResponse {
  status: boolean;
  message: Vendor[];
}

// Define types for request orders
export interface Dispenser {
  accountId: string;
  name: string;
}

export interface RequestOrderItem {
  itemName: string;
  // listID: string;
  quantity: number;
  unitOfMeasure: string;
  rate: number;
  orderItemStatus: string;
  notes: string | null;
}

export interface RequestOrder {
  orderId: string;
  dispenser: Dispenser;
  requestType: string | null;
  orderStatus: string;
  items: RequestOrderItem[];
  facilityName: string;
  tillNo: string;
  timeStamp: number;
  lastUpdated: number;
  scheduledDate: number;
  region: string;
  filterBy: string | null;
  page: any | null;
  filterDate: string | null;
}

export interface RequestOrderResponse {
  status: boolean;
  message: RequestOrder[];
}

// Define parameters for fetching request orders
export interface FetchRequestOrdersParams {
  orderStatus: string;
  filterBy: string;
  facilityName: string;
  tillNo: string;
  accountId: string;
  name: string;
}

// Define the slice state type
interface PurchaseOrderState {
  vendors: Vendor[];
  requestOrders: RequestOrder[];
  isLoading: boolean;
  isLoadingRequestOrders: boolean;
  error: string | null;
  requestOrdersError: string | null;
}

// Initial state
const initialState: PurchaseOrderState = {
  vendors: [],
  requestOrders: [],
  isLoading: false,
  isLoadingRequestOrders: false,
  error: null,
  requestOrdersError: null,
};

// Async thunk for fetching vendors
export const fetchVendorsList = createAsyncThunk('purchaseOrder/fetchVendors', async (_, { rejectWithValue }) => {
  //   const loadingToast = toast.loading('Fetching vendors...');

  try {
    const requestBody = {
      requestType: 'QUERY_VENDOR',
      filterBy: 'V_ALL',
    };

    const response = await WebService.postPharma('vendors', requestBody);
    const vendorResponse = response as unknown as VendorResponse;

    // toast.dismiss(loadingToast);

    if (vendorResponse?.status && Array.isArray(vendorResponse.message)) {
      //   toast.success('Vendors fetched successfully!');
      return vendorResponse.message;
    } else {
      toast.error('Failed to fetch vendors.');
      return rejectWithValue('Invalid response format or empty vendors list');
    }
  } catch (error: any) {
    // toast.dismiss(loadingToast);
    toast.error(`Error fetching vendors: ${error.message || 'Unknown error'}`);
    return rejectWithValue(error.message || 'Failed to fetch vendors');
  }
});

// Async thunk for fetching request orders
export const fetchRequestOrders = createAsyncThunk(
  'purchaseOrder/fetchRequestOrders',
  async (params: FetchRequestOrdersParams, { rejectWithValue }) => {
    // const loadingToast = toast.loading('Fetching request orders...');

    try {
      const { orderStatus = 'PROCESSING', filterBy = 'R_STATUS', facilityName, tillNo, accountId, name } = params;

      const requestBody = {
        requestType: 'GET_ORDERS',
        dispenser: {
          accountId,
          name,
        },
        orderStatus,
        facilityName,
        tillNo,
        filterBy,
      };

      const response = await WebService.postPharma('requestOrder', requestBody);
      const orderResponse = response as unknown as RequestOrderResponse;

      // toast.dismiss(loadingToast);

      if (orderResponse?.status && Array.isArray(orderResponse.message)) {
        toast.success('Request orders fetched successfully!');
        return orderResponse.message;
      } else {
        toast.error('Failed to fetch request orders.');
        return rejectWithValue('Invalid response format or empty request orders list');
      }
    } catch (error: any) {
      // toast.dismiss(loadingToast);
      toast.error(`Error fetching request orders: ${error.message || 'Unknown error'}`);
      return rejectWithValue(error.message || 'Failed to fetch request orders');
    }
  },
);

// Create the purchase order slice
const purchaseOrderSlice = createSlice({
  name: 'purchaseOrder',
  initialState,
  reducers: {
    setVendors(state, action: PayloadAction<Vendor[]>) {
      state.vendors = action.payload;
    },
    setRequestOrders(state, action: PayloadAction<RequestOrder[]>) {
      state.requestOrders = action.payload;
    },
    clearError(state) {
      state.error = null;
      state.requestOrdersError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch vendors cases
      .addCase(fetchVendorsList.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchVendorsList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.vendors = action.payload;
        state.error = null;
      })
      .addCase(fetchVendorsList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Failed to fetch vendors';
      })
      // Fetch request orders cases
      .addCase(fetchRequestOrders.pending, (state) => {
        state.isLoadingRequestOrders = true;
        state.requestOrdersError = null;
      })
      .addCase(fetchRequestOrders.fulfilled, (state, action) => {
        state.isLoadingRequestOrders = false;
        state.requestOrders = action.payload;
        state.requestOrdersError = null;
      })
      .addCase(fetchRequestOrders.rejected, (state, action) => {
        state.isLoadingRequestOrders = false;
        state.requestOrdersError = (action.payload as string) || 'Failed to fetch request orders';
      });
  },
});

export const { setVendors, setRequestOrders, clearError } = purchaseOrderSlice.actions;

export default purchaseOrderSlice.reducer;
