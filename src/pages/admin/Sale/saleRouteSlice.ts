import { getDatas } from '@/services/httphandler';
import { Class, ClassResponse, Vendor, VendorResponse } from '@/utils/types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface itemState {
  vendors: {
    items: Vendor[];
    isLoading: boolean;
  };
  classes: {
    items: Class[];
    isLoading: boolean;
  };
}

const initialState: itemState = {
  vendors: {
    items: [],
    isLoading: false,
  },
  classes: {
    items: [],
    isLoading: false,
  },
};

export const vendorsList = createAsyncThunk(
  'vendors/fetchList',
  async (object: Record<string, unknown> | undefined) => {
    const response = await getDatas<VendorResponse>('vendors', object);

    if (Array.isArray(response) && response.length > 0) {
      const QBXML = response[0]?.QBXML;

      return QBXML?.QBXMLMsgsRs?.VendorQueryRs?.VendorRet || [];
    }

    return [];
  },
);
export const classesList = createAsyncThunk(
  'classes/fetchList',
  async (object: Record<string, unknown> | undefined) => {
    const response = await getDatas<ClassResponse>('class-response', object);

    if (Array.isArray(response) && response.length > 0) {
      const QBXML = response[0]?.QBXML;

      return QBXML?.QBXMLMsgsRs?.ClassQueryRs?.ClassRet || [];
    }

    return [];
  },
);

const salesSlice = createSlice({
  name: 'sales',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(vendorsList.pending, (state) => {
        state.vendors.isLoading = true;
      })
      .addCase(vendorsList.fulfilled, (state, action) => {
        state.vendors.isLoading = false;
        state.vendors.items = action.payload;
      })
      .addCase(vendorsList.rejected, (state) => {
        state.vendors.isLoading = false;
      })
      .addCase(classesList.pending, (state) => {
        state.classes.isLoading = true;
      })
      .addCase(classesList.fulfilled, (state, action) => {
        state.classes.isLoading = false;
        state.classes.items = action.payload;
      })
      .addCase(classesList.rejected, (state) => {
        state.classes.isLoading = false;
      });
  },
});

export default salesSlice;
