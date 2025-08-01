
import { WebService } from '@/web-services/WebService';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'sonner';

// Define types for purchase orders based on actual API response

interface unitsOfMeasure {
  sublevel: number;
  fullName: string;
  quantity: number;
}
export interface PurchaseOrderItem {
  txnLineID: string;
  itemRef: {
    listID: string;
    fullName: string;
  };
  desc: string;
  quantity: string;
  unitOfMeasure: string;
  overrideUOMSetRef?: {
    listID: string;
    fullName: string;
  };
  rate: string;
  classRef?: {
    listID: string;
    fullName: string;
  };
  amount: string;
  receivedQuantity: string;
  isBilled: boolean;
  isManuallyClosed: boolean;
  unitsOfMeasure?: unitsOfMeasure[];
}

export interface PurchaseOrder {
  dispenser: {
    accountId: string;
    name: string;
  };
  txnID: string;
  timeCreated: number;
  timeModified: number;
  editSequence: string;
  txnNumber: string;
  vendorRef: {
    listID: string;
    fullName: string;
  };
  templateRef?: {
    listID: string;
    fullName: string;
  };
  txnDate: number;
  refNumber: string;
  vendorAddress?: {
    addr1: string;
  };
  vendorAddressBlock?: {
    addr1: string;
  };
  shipAddress?: {
    addr1: string;
    addr2: string;
    state: string;
    note: string;
  };
  shipAddressBlock?: {
    addr1: string;
    addr2: string;
    addr3: string;
  };
  dueDate: number;
  expectedDate: number;
  totalAmount: string;
  isManuallyClosed: boolean;
  isFullyReceived: boolean;
  isToBePrinted: boolean;
  isToBeEmailed: boolean;
  purchaseOrderLineRet: PurchaseOrderItem[];
}

// Define the response type for purchase order queries
export interface PurchaseOrderResponse {
  status: boolean;
  message: PurchaseOrder[];
}

// Define the Site interface
export interface Site {
  listId: string;
  tillNo: string;
  timeCreated: number;
  timeModified: number;
  editSequence: string;
  name: string;
  isActive: boolean;
  isDefaultSite: boolean;
}

// Define the response type for site queries
export interface SiteResponse {
  status: boolean;
  message: Site[];
}

// Define Bill Item interface
export interface BillItem {
  txnLineID: string;
  itemRef: {
    listID: string;
    fullName: string;
  };
  lotNumber: string;
  expiryDate: number;
  desc: string;
  quantity: string;
  unitOfMeasure: string;
  overrideUOMSetRef?: {
    listID: string;
    fullName: string;
  };
  cost: string;
  amount: number;
  classRef?: {
    listID: string;
    fullName: string;
  };
}

// Define Bill interface
export interface Bill {
  purchaseOrderId: string;
  invoiceNo: string;
  dispenser: {
    accountId: string;
    name: string;
  } | null;
  txnID: string;
  timeCreated: number;
  timeModified: number;
  editSequence: string;
  txnNumber: string;
  vendorRef: {
    listID: string;
    fullName: string;
  };
  vendorAddress: {
    addr1: string;
    city: string;
    postalCode: string;
    country: string;
    note: string;
  };
  apAccountRef?: {
    listID: string;
    fullName: string;
  };
  txnDate: number;
  dueDate: number;
  amountDue: string;
  isPaid: string;
  linkedTxn?: {
    txnID: string;
    txnType: string;
    txnDate: number;
    refNumber: string;
    linkType: string;
    amount: number;
  };
  itemLineRet: BillItem[];
  openAmount: string;
}

// Define Bill response interface
export interface BillResponse {
  status: boolean;
  message: Bill[];
  total?: number; // Add optional total property to match API response
}

// Define the slice state type
interface BillState {
  totalBills: number;
  currentPage: number;
  purchaseOrders: PurchaseOrder[];
  selectedPurchaseOrder: PurchaseOrder | null;
  sites: Site[];
  selectedSite: Site | null;
  bills: Bill[];
  isLoading: boolean;
  isSitesLoading: boolean;
  isBillsLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: BillState = {
  totalBills: 0,
  currentPage: 1,
  purchaseOrders: [],
  selectedPurchaseOrder: null,
  sites: [],
  selectedSite: null,
  bills: [],
  isLoading: false,
  isSitesLoading: false,
  isBillsLoading: false,
  error: null,
};

// Async thunk for fetching purchase orders
export const fetchPurchaseOrders = createAsyncThunk(
  'bill/fetchPurchaseOrders',
  async (_, { rejectWithValue }) => {
    try {
      const requestBody = {
        requestType: 'GET_P_ORDERS',
        filterBy: 'P_ALL',
      };

      // Make the API request
      const response = await WebService.postPharma('purchaseOrder', requestBody);

      console.log('🔍 Raw fetchPurchaseOrders response:', response);

      const purchaseOrderResponse = response as unknown as PurchaseOrderResponse;

      if (purchaseOrderResponse?.status && Array.isArray(purchaseOrderResponse.message)) {
        // Sort by timeCreated descending (latest first)
        const sortedOrders = [...purchaseOrderResponse.message].sort(
          (a, b) => Number(b.timeCreated) - Number(a.timeCreated)
        );

        toast.success('Purchase orders fetched successfully!');
        return sortedOrders;
      } else {
        toast.error('Failed to fetch purchase orders.');
        return rejectWithValue('Failed to fetch purchase orders.');
      }
    } catch (error) {
      toast.error('Error fetching purchase orders: ' + (error as Error).message);
      return rejectWithValue((error as Error).message);
    }
  }
);


// // Async thunk for fetching sites
// export const fetchSites = createAsyncThunk('bill/fetchSites', async (_, { rejectWithValue }) => {
//   // const loadingToast = toast.loading('Fetching sites...');

//   try {
//     // const requestBody = {
//     //   request: 'S_QUERY',
//     // };

//     // Make the API request
//     // const response = await postQBXMLData('sites', requestBody);
//     // const siteResponse = response as unknown as SiteResponse;

//     // toast.dismiss(loadingToast);

//     if (siteResponse?.status && Array.isArray(siteResponse.message)) {
//       // toast.success('Sites fetched successfully!');
//       return siteResponse.message;
//     } else {
//       toast.error('Failed to fetch sites.');
//       return rejectWithValue('Failed to fetch sites.');
//     }
//   } catch (error) {
//     // toast.dismiss(loadingToast);
//     toast.error('Error fetching sites: ' + (error as Error).message);
//     return rejectWithValue((error as Error).message);
//   }

export const fetchBills = createAsyncThunk(
  'bill/fetchBills',
  async (
    params: { vendorName?: string; filterBy?: string; page?: number; max?: number } = {},
    { rejectWithValue }
  ) => {
    try {
      const requestBody = {
        request: 'GET_BILLS',
        billAddRq: {
          billAdd: {
            vendorRef: {
              fullName: params.vendorName || '',
            },
          },
        },
        filterBy: params.filterBy,
        page: {
          page: params.page || 1,  // <-- use params.page here
          max: params.max || 50,   // <-- use params.max here
        }
      };


      const response = await WebService.postPharma('bills', requestBody);
      const billResponse = response as unknown as BillResponse;

      if (billResponse?.status && Array.isArray(billResponse.message)) {
        const sortedBills = [...billResponse.message].sort(
          (a, b) => b.timeCreated - a.timeCreated
        );

        toast.success('Bills fetched successfully!');
        return {
          data: sortedBills,
          page: params.page || 1,
          total: billResponse.total || sortedBills.length, // optional: include total from API
        };
      } else {
        toast.error('Failed to fetch bills.');
        return rejectWithValue('Failed to fetch bills.');
      }
    } catch (error) {
      toast.error('Error fetching bills: ' + (error as Error).message);
      return rejectWithValue((error as Error).message);
    }
  }
);


// Create the slice
const billSlice = createSlice({
  name: 'bill',
  initialState,
  reducers: {
    setPurchaseOrders(state, action: PayloadAction<PurchaseOrder[]>) {
      state.purchaseOrders = action.payload;
    },
    setSelectedPurchaseOrder(state, action: PayloadAction<PurchaseOrder | null>) {
      state.selectedPurchaseOrder = action.payload;
    },
    setSites(state, action: PayloadAction<Site[]>) {
      state.sites = action.payload;
    },
    setBills(state, action: PayloadAction<Bill[]>) {
      state.bills = action.payload;
    },
    setSelectedSite(state, action: PayloadAction<Site | null>) {
      state.selectedSite = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPurchaseOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPurchaseOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.purchaseOrders = action.payload;
      })
      .addCase(fetchPurchaseOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // .addCase(fetchSites.pending, (state) => {
      //   state.isSitesLoading = true;
      //   state.error = null;
      // })
      // .addCase(fetchSites.fulfilled, (state, action) => {
      //   state.isSitesLoading = false;
      //   state.sites = action.payload;
      // })
      // .addCase(fetchSites.rejected, (state, action) => {
      //   state.isSitesLoading = false;
      //   state.error = action.payload as string;
      // })
      .addCase(fetchBills.pending, (state) => {
        state.isBillsLoading = true;
        state.error = null;
      })
      .addCase(fetchBills.fulfilled, (state, action) => {
        state.isBillsLoading = false;
        state.bills = action.payload.data;
      })
      .addCase(fetchBills.rejected, (state, action) => {
        state.isBillsLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setPurchaseOrders, setSelectedPurchaseOrder, setSites, setBills, setSelectedSite, clearError } =
  billSlice.actions;

export default billSlice.reducer;
