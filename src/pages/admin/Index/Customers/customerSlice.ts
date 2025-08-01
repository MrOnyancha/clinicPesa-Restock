// import { getDatas } from '@/services/httphandler';
import { Customer, CustomerResponse } from '@/utils/types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

type customerType = {
  customers: Customer[];
  isLoading: boolean;
};

const initialState: customerType = {
  customers: [],
  isLoading: false,
};

// export const customersList = createAsyncThunk(
//   'customers/fetchList',
//   async (object: Record<string, unknown> | undefined) => {
//     const response = await getDatas<CustomerResponse>('customers', object);
//     if (Array.isArray(response) && response.length > 0) {
//       const QBXML = response[0]?.QBXML;

//       return QBXML?.QBXMLMsgsRs?.CustomerQueryRs?.CustomerRet || [];
//     }

//     return [];
//   },
// );

// const customersSlice = createSlice({
//   name: 'customers',
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(customersList.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(customersList.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.customers = action.payload;
//       })
//       .addCase(customersList.rejected, (state) => {
//         state.isLoading = false;
//       });
//   },
// });

// export default customersSlice;
