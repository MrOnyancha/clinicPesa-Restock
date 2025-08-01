import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { postCashierData } from '@/services/httphandler';

// Interfaces for the daily sales data
interface PaymentOption {
  paymentOp: string;
  amount: number;
  count: number;
}

interface CustomerType {
  customer: string;
  count: number;
}

interface Dispenser {
  accountId: string;
  name: string;
}

interface Pharmacy {
  tillNo: string;
  name: string;
}

interface DailySale {
  saleId: string;
  paymentOptions: PaymentOption[];
  customerType: CustomerType[];
  totalAmount: number;
  cosmetics: number;
  totalDiscounts: number;
  status: string;
  dispenser: Dispenser;
  timeStamp: number;
  pharmacy: Pharmacy;
  servedCustomers: number;
  unservedCustomers: number;
}

interface DailySalesResponse {
  status: boolean;
  message: DailySale[];
}

interface DailySalesState {
  dailySales: DailySale[];
  loading: boolean;
  error: string | null;
  filterParams: {
    tillNo: string;
    name: string;
    accountId: string;
  } | null;
}

const initialState: DailySalesState = {
  dailySales: [],
  loading: false,
  error: null,
  filterParams: null,
};

export type FilterDailySalesOptions = {
  tillNo: string;
  name: string;
  accountId: string;
  filterBy: 'DISPENSER' | 'STATION' | 'DATE';
};

export const fetchDailySales = createAsyncThunk<DailySalesResponse, FilterDailySalesOptions, { rejectValue: string }>(
  'dailySales/fetchDailySales',
  async (params, { rejectWithValue }) => {
    try {
      const response = await postCashierData('ads', {
        request: 'GET_SHIFT_SALES',
        shift: {
          pharmacy: {
            tillNo: params.tillNo,
            name: params.name,
          },
          dispenser: {
            accountId: params.accountId,
          },
        },
        filterBy: params.filterBy,
      });

      if (!response?.status) {
        throw new Error('Failed to fetch daily sales data');
      }

      return response as DailySalesResponse;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  },
);

const dailySalesSlice = createSlice({
  name: 'dailySales',
  initialState,
  reducers: {
    updateFilterParams: (
      state,
      action: PayloadAction<{
        tillNo: string;
        name: string;
        accountId: string;
      }>,
    ) => {
      state.filterParams = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDailySales.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDailySales.fulfilled, (state, action) => {
        state.loading = false;
        state.dailySales = action.payload.message || [];
      })
      .addCase(fetchDailySales.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { updateFilterParams } = dailySalesSlice.actions;
export default dailySalesSlice.reducer;
