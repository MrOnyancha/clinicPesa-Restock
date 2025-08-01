import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Product } from '@/utils/types';
import { WebService } from '@/web-services/WebService';

type productInitialState = {
  products: Product[];
  isLoading: boolean;
};

const initialState: productInitialState = {
  products: [],
  isLoading: false,
};

export const productList = createAsyncThunk(
  'products/fetchList',
  async (params: { filterBy?: string; page?: number; max?: number } = {}) => {
    const { filterBy = 'ALL', page = 0, max = 100 } = params;

    const requestBody = {
      itemsRsAction: 'ITEMS_QUERY',
      filterBy: filterBy,
      page: {
        page: page,
        max: max,
      },
      declaration: {
        _attributes: {
          version: '1.0',
        },
      },
    };

    const response = await WebService.postPharma('items', requestBody);
    if (response?.status && Array.isArray(response.message)) {
      return response.message || [];
    }

    return [];
  },
);
export const productListSearch = createAsyncThunk('products/fetchListSearch', async (params: { search: string }) => {
  const { search } = params;

  const requestBody = {
    itemsRsAction: 'SEARCH_ITEMS',
    search: search,
    filterBy: 'NAME',
    declaration: {
      _attributes: {
        version: '1.0',
      },
    },
  };

  const response = await WebService.postPharma('items', requestBody);
  if (response?.status && Array.isArray(response.message)) {
    return response.message || [];
  }

  return [];
});

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(productList.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(productList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload;
      })
      .addCase(productList.rejected, (state) => {
        state.isLoading = false;
      })

      // Handle productListSearch
      .addCase(productListSearch.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(productListSearch.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload;
      })
      .addCase(productListSearch.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default productsSlice;
