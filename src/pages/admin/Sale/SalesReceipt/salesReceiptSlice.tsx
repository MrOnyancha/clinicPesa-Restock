import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { postCashierData } from '@/services/httphandler';
import { WebService } from '@/web-services/WebService';

// Interfaces for the sales data
interface Payment {
  amountPaid: number;
  modeOfPayment: string;
  transactionId: string;
}

interface SalesItem {
  itemId: string;
  itemName: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  discount: number;
  unitOfMeasure: string;
  batchNo: string;
  expiryDate: number;
}

interface Cashier {
  accountId: string;
  name: string;
}

interface CashierDetails {
  phone: string;
  accountDetails: {
    firstName: string;
    lastName: string;
    location: string;
    email: string;
    gender: string;
    dob: number;
    nin: string;
    country: string;
    nextOfKeen: string;
    timeStamp: number;
  };
  adsDetails: {
    ads: boolean;
    active: boolean;
    station: string[];
    role: string;
  };
  isActive: boolean;
  isAds: boolean;
  isAgent: boolean;
  isFieldOfficer: boolean;
  isCustomerCare: boolean;
  isMaMas: boolean;
  isSurvey: boolean;
  isTombStone: boolean;
  otp: boolean;
  sP: boolean;
}

interface Sale {
  request: null | string;
  saleId: string;
  customerId: null | string;
  customerName: string;
  totalAmount: number;
  salesItems: SalesItem[];
  payment: Payment[];
  saleDate: number;
  cashier: Cashier;
  siteName: string;
  siteId: string;
  stationId?: string;
  filterBy: null | string;
  page: null | number;
  filterDate: null | number;
  status: string;
}

interface SalesResponse {
  status: boolean;
  message: Sale[];
}

interface SalesState {
  sales: Sale[];
  cashiers: CashierDetails[];
  loading: boolean;
  error: string | null;
  filterParams: {
    filterBy: string;
    startDate?: number;
    endDate?: number;
    siteName?: string;
    siteId?: string;
    cashierAccountId?: string;
    cashierName?: string;
    modeOfPayment?: string;
  } | null;
}

export interface FilterParams {
  filterBy: string;
  filterDate?: {
    startTime?: number;
    endTime?: number;
  };
  siteName?: string;
  siteId?: string;
  customerName?: string;
  cashier?: {
    accountId?: string;
  };
  payment?: [
    {
      modeOfPayment?: string;
    },
  ];
}

const initialState: SalesState = {
  sales: [],
  cashiers: [],
  loading: false,
  error: null,
  filterParams: null,
};

export const fetchSales = createAsyncThunk<SalesResponse, FilterParams, { rejectValue: string }>(
  'sales/fetchSales',
  async (params, { rejectWithValue }) => {
    try {
      const response = await WebService.postPharma('sales', {
        request: 'S_QUERY',
        ...params,
        page: {
          page: 0,
          max: 1000, // fetching everything to paginate locally
        }
      });

      if (!response?.status) {
        throw new Error('Failed to fetch sales data');
      }

      return response as SalesResponse;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  },
);

export const fetchCashiers = createAsyncThunk<CashierDetails[], void, { rejectValue: string }>(
  'sales/fetchCashiers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await postCashierData('ads', {
        request: 'GET_ADS',
         page: {
          page: 0,
          max: 1000, // fetching everything to paginate locally
        }
      });

      if (!response?.status) {
        throw new Error('Failed to fetch cashiers data');
      }

      return response.data.message as CashierDetails[];
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  },
);

const salesSlice = createSlice({
  name: 'sales',
  initialState,
  reducers: {
    updateFilterParams: (state, action: PayloadAction<FilterParams>) => {
      state.filterParams = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSales.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSales.fulfilled, (state, action) => {
        console.log('Fetched sales:', action.payload.message);
        state.loading = false;
        state.sales = action.payload.message || [];
      })
      .addCase(fetchSales.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCashiers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCashiers.fulfilled, (state, action) => {
        state.loading = false;
        state.cashiers = action.payload;
      })
      .addCase(fetchCashiers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { updateFilterParams } = salesSlice.actions;
export default salesSlice.reducer;
