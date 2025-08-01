import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Dashboard from '@/pages/admin/Dashboard/dashboard';
import { Login } from '../pages/auth/Login';
// import  Home from '@/pages/admin/';
// import { InvoiceDetails } from '../../src/pages/admin/stockin-out/Invoice/InvoiceDetails';
// import { stockTransfer } from '../../src/pages/admin/HiddenPages/stock-transfers';
import Transfer from '../pages/admin/Sale/Transfer/Transfer';
import Bill from '../pages/admin/Sale/Bill/Bill';
import RequestOrder from '../pages/admin/Sale/RequestOrder/RequestOrder';
import SalesReceipt from '@/pages/admin/Sale/SalesReceipt/SalesReceipt';
import PurchaseOrder from '@/pages/admin/Sale/PurchaseOrder/PurchaseOrderEdit';
// import DailySalesReport from '@/pages/admin/Reports/DailySalesReport/DailySalesReport';
import WishList from '@/pages/admin/wishList-all/wishList';
import CreateWishList from '@/pages/admin/wishList-all/createWishList';
import stockTransfer from '../pages/admin/Sale/Transfer/Transfer';
import type { IconType } from 'react-icons';
import { BsCash } from 'react-icons/bs';
import { LiaSalesforce } from 'react-icons/lia';
import {
  MdOutlineAttachMoney,
  MdOutlineRequestPage,
  MdPointOfSale,
} from 'react-icons/md';
import { RiProductHuntLine } from 'react-icons/ri';
import { RxDashboard } from 'react-icons/rx';
import { TbReportSearch } from 'react-icons/tb';
import { ArrowRightLeft } from "lucide-react";
import { MdOutlineFavoriteBorder } from "react-icons/md";
import type { HiddenRoutesType, SidebarModulesInterface } from '@/components/types/sideBar';
import DailySalesReport from '@/pages/admin/Reports-1/Sales-revenue-drugs/DailySalesReport';
import LockScreen from '@/pages/admin/Dashboard/LockScreen';
import ProductList from '@/pages/admin/Sale/Product List/ProductList'; 
import { MdLocalPharmacy } from "react-icons/md";
import { MdOutlineInventory } from "react-icons/md";
import { SiWish } from "react-icons/si";
import { IoCreateSharp } from "react-icons/io5";
import Manufacturer from '@/pages/admin/CreateItem/Manufacturer';
import { MdCreateNewFolder } from "react-icons/md";

export const authRoutes = [
  {
    path: 'auth/login',
    element: Login,
  },
  {
    path: 'auth/lock',
    element: LockScreen, // ✅ Add this
  },
];

export const hiddenRoutes: HiddenRoutesType[] = [
  // {
  //   name: 'Home',
  //   path: '/admin/home',
  //   element: Home,
  // },
];

const sidebarModules = () => {
  // Define role-based access flags based on the userRole parameter
  const adsRole = localStorage.getItem('adsRole');
  const IS_CASHIER = adsRole === 'DISPENSER';
  const IS_ADMIN = adsRole === 'ADMIN';
  const IS_IT = adsRole === 'IT';
  const IS_SUPERVISOR = adsRole === 'SUPERVISOR';
  const IS_RESTOCK = adsRole === 'RESTOCKING';
  const IS_MANAGER = adsRole === 'MANAGER';
  const IS_RECONCILIATION = adsRole === 'RECONCILIATION';

  const VIEW_ALL_SALES_PERMISSIONS =
    IS_ADMIN || IS_IT || IS_RESTOCK || IS_MANAGER || IS_SUPERVISOR || IS_RECONCILIATION;

  const arr: SidebarModulesInterface[] = [
    {
      module_name: 'Dashboard',
      icon: RxDashboard,
      path: '/dashboard',
      element: Dashboard,
      modules: [],
    },
    {
      module_name: 'Sales Receipt',
      icon: MdOutlineAttachMoney,
      path: '/admin/sales/sales-Receipt',
      element: SalesReceipt,
      modules: [],
      hidden: IS_RESTOCK,
    },
    {
      module_name: 'Request Order',
      icon: MdPointOfSale,
      modules: [
        { text: 'Request Order', path: '/admin/request-order', icon: MdOutlineRequestPage, element: RequestOrder },
        {
          text: 'Purchase Order',
          path: 'admin/sale/purchase-order',
          icon: RiProductHuntLine,
          element: PurchaseOrder,
          hidden: IS_CASHIER,
        },
        {
          text: 'Bill',
          path: 'admin/sale/bill',
          icon: BsCash,
          element: Bill,
          hidden: IS_CASHIER,
        },

        {
          text: 'Transfer',
          path: 'admin/sale/transfer',
          icon: ArrowRightLeft,
          element: Transfer,
          hidden: IS_CASHIER,
        },
      ],
    },
    {
      module_name: 'Stock Transfer',
      icon: ArrowRightLeft,
      path: '/stock-transfer',
      element: stockTransfer,
      modules: [],
      hidden: IS_CASHIER,
    },
    {
      module_name: 'Product List',
      icon: MdOutlineInventory,
      path: '/product-list',
      element: ProductList,
      modules: [],
    },
    {
      module_name: 'Wish List',
      icon: SiWish,
      modules: [
        {
          text: 'See Wish List',
          path: '/wish-list',
          icon: MdOutlineFavoriteBorder,
          element: WishList,
        },
        {
          text: 'Create Wish List',
          path: '/create-wishlist',
          icon: MdOutlineFavoriteBorder,
          element: CreateWishList,
        },
      ],
    },
    {
      module_name: 'Create Item',
      icon: IoCreateSharp,
      modules: [
        {
          text: 'Create Item',
          path: '/create-item',
          icon: MdCreateNewFolder,
          element: Manufacturer, // ✅ correct
        },
      ],
    },
    {
      module_name: 'Reports',
      icon: TbReportSearch,
      modules: [
        {
          text: 'Daily Sales',
          path: '/reports/daily-sales-report',
          icon: LiaSalesforce,
          element: DailySalesReport, // ✅ correct
        },
      ],
    },
  ];

  return arr;
};

export { sidebarModules, type SidebarModulesInterface };
