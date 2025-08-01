import { InventoryProduct } from '../SalesReceipt/SRComboBox';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { postQBXMLData } from '@/services/httphandler';
import { WebService } from '@/web-services/WebService';

interface SiteInfo {
  siteName: string;
  siteId: string;
}

interface FetchInventoryProductsParams {
  sites: SiteInfo[];
}

interface InventoryState {
  products: InventoryProduct[];
  loading: boolean;
  error: string | null;
}

const initialState: InventoryState = {
  products: [],
  loading: false,
  error: null,
};

// Async thunk to fetch inventory products
export const fetchInventoryProducts = createAsyncThunk(
  'transfer/fetchInventoryProducts',
  async (params: FetchInventoryProductsParams, { rejectWithValue }) => {
    
    try {
      const requestData = {
        request: 'I_QUERY',
        sites: params.sites,
        filterBy: 'SITE',
      };

      const response = await WebService.postPharma('inventory', requestData);
      
      if (!response || !response.status) {
        return rejectWithValue(response?.message || 'Failed to fetch inventory products');
      }

      return response.message as InventoryProduct[];
    } catch (error: any) {
      return rejectWithValue(error.message || 'An error occurred while fetching inventory products');
    }
  },
);

const transferSlice = createSlice({
  name: 'transfer',
  initialState,
  reducers: {
    clearInventoryProducts: (state) => {
      state.products = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventoryProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInventoryProducts.fulfilled, (state, action: PayloadAction<InventoryProduct[]>) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchInventoryProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearInventoryProducts } = transferSlice.actions;
export default transferSlice.reducer;
