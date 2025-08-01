import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { modalSlice } from '@/components/Modal/modalSlice';
import { innerModalSlice } from '@/components/Modal/innerModalSlice';
import salesSlice from '@/pages/admin/Sale/SalesReceipt/salesReceiptSlice';
// import customersSlice from '@/pages/admin/Index/Customers/customerSlice';
import productsSlice from '@/pages/admin/Index/Products/productsSlice';
import requestOrderSlice from '@/pages/admin/Sale/RequestOrder/requestOrderSlice';
import adsSlice from '@/pages/admin/Sale/RequestOrder/getADSslice';
import authReducer from '@/pages/auth/authSlice';
import purchaseOrderReducer from '@/pages/admin/Sale/PurchaseOrder/purchaseOrderSlice';
import billReducer from '@/pages/admin/Sale/Bill/billSlice';

import transferSlice from '@/pages/admin/Sale/Transfer/transferSlice';

import dailySalesSlice from '@/pages/admin/Reports-1/Sales-revenue-drugs/dailySalesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    modal: modalSlice.reducer,
    innerModal: innerModalSlice.reducer,
    sales: salesSlice,
    // customers: customersSlice.reducer,
    products: productsSlice.reducer,
    requestOrders: requestOrderSlice.reducer,
    ads: adsSlice.reducer,
    purchaseOrder: purchaseOrderReducer,
    bill: billReducer,
    transfer: transferSlice,
    dailySales: dailySalesSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
