import { PaymentInfo } from '@/utils/types';
import { SelectedInventoryProduct } from './SalesReceipt';
import { InventoryProduct } from './SRComboBox';
import { Site } from '../Bill/billSlice';

export const singlePaymentMethods: string[] = [
  'Cash',
  'clinicPesa',
  'MoMo Pay',
  'Airtel Money',
  'Verve Money',
  'PesaPal',
  'Credit card',
];

export const multiPaymentMethodsOptions: Array<{ label: string; value: string }> = [
  { label: 'Cash', value: 'Cash' },
  { label: 'clinicPesa', value: 'clinicPesa' },
  { label: 'MoMo Pay', value: 'MoMo Pay' },
  { label: 'Airtel Pay', value: 'Airtel Pay' },
  { label: 'Valve Pay', value: 'Valve Pay' },
  { label: 'PesaPal', value: 'PesaPal' },
  { label: 'Credit Card', value: 'Credit Card' },
];

export const customerTypes: string[] = ['Referred Customer', 'Existing Customer', 'Walk-in Customer'];

// Filter options for users with VIEW_ALL_SALES_PERMISSIONS (admin, supervisor, etc.)
export const filterSalesBy: string[] = [
  'All Sites',
  'All Sites & Date',
  'Date',
  'Site',
  'Site & Date',
  'Cashier',
  'Cashier & Date',
  'Payment Method',
  'Payment Method & Date',
  'Customer Type',
  'Customer Type & Date',
];

// Limited filter options for cashiers
export const cashierFilterOptions: string[] = [
  'Date',
  'Payment Method',
  'Payment Method & Date',
  'Customer Type',
  'Customer Type & Date',
];

// Define state interface
export interface SalesReceiptState {
  customerType: string;
  payments: PaymentInfo[];
  selectedPaymentMethods: string[];
  selectedPaymentMethod: string;
  currentAmountPaid: number;
  paymentAmount: number;
  currentUnitPrice: number;
  currentQuantity: number;
  isSubmitting: boolean;
  selectedCashier: string;
  customerTypeFilter: string;
  filterBy: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  errors: {
    date?: string;
    site?: string;
    cashier?: string;
    payment?: string;
    customerTypeFilter?: string;
  };
  selectedItems: SelectedInventoryProduct[];
  currentItem: InventoryProduct | null;
  formError: string;
  selectedSite: Site | null;
  shiftActive: boolean;
}

// Define action types
export type SalesReceiptAction =
  | { type: 'SET_CUSTOMER_TYPE'; payload: string }
  | { type: 'ADD_PAYMENTS'; payload: PaymentInfo[] }
  | { type: 'FILTER_PAYMENTS'; payload: string[] }
  | { type: 'CLEAR_PAYMENTS' }
  | { type: 'SET_SELECTED_PAYMENT_METHODS'; payload: string[] }
  | { type: 'CLEAR_SELECTED_PAYMENT_METHODS' }
  | { type: 'SET_SELECTED_PAYMENT_METHOD'; payload: string }
  | { type: 'SET_CURRENT_AMOUNT_PAID'; payload: number }
  | { type: 'SET_PAYMENT_AMOUNT'; payload: number }
  | { type: 'SET_CURRENT_UNIT_PRICE'; payload: number }
  | { type: 'SET_CURRENT_QUANTITY'; payload: number }
  | { type: 'SET_IS_SUBMITTING'; payload: boolean }
  | { type: 'SET_SELECTED_CASHIER'; payload: string }
  | { type: 'SET_CUSTOMER_TYPE_FILTER'; payload: string }
  | { type: 'SET_FILTER_BY'; payload: string }
  | { type: 'SET_START_DATE'; payload: Date | undefined }
  | { type: 'SET_END_DATE'; payload: Date | undefined }
  | { type: 'SET_ERRORS'; payload: { [key: string]: string | undefined } }
  | { type: 'CLEAR_ERRORS' }
  | { type: 'SET_SELECTED_ITEMS'; payload: SelectedInventoryProduct[] }
  | { type: 'ADD_SELECTED_ITEM'; payload: SelectedInventoryProduct }
  | { type: 'REMOVE_SELECTED_ITEM'; payload: number }
  | { type: 'CLEAR_SELECTED_ITEMS' }
  | { type: 'SET_CURRENT_ITEM'; payload: InventoryProduct | null }
  | { type: 'SET_FORM_ERROR'; payload: string }
  | { type: 'CLEAR_FORM_ERROR' }
  | { type: 'SET_SELECTED_SITE'; payload: Site | null }
  | { type: 'SET_SHIFT_ACTIVE'; payload: boolean };
// Other action types will be added here as we migrate more state

// Define the reducer function
export function reducer(state: SalesReceiptState, action: SalesReceiptAction): SalesReceiptState {
  switch (action.type) {
    case 'SET_CUSTOMER_TYPE':
      return { ...state, customerType: action.payload };
    case 'ADD_PAYMENTS':
      return { ...state, payments: [...state.payments, ...action.payload] };
    case 'FILTER_PAYMENTS':
      return {
        ...state,
        payments: state.payments.filter((payment) => action.payload.includes(payment.modeOfPayment)),
      };
    case 'CLEAR_PAYMENTS':
      return { ...state, payments: [] };
    case 'SET_SELECTED_PAYMENT_METHODS':
      return { ...state, selectedPaymentMethods: action.payload };
    case 'CLEAR_SELECTED_PAYMENT_METHODS':
      return { ...state, selectedPaymentMethods: [] };
    case 'SET_SELECTED_PAYMENT_METHOD':
      return { ...state, selectedPaymentMethod: action.payload };
    case 'SET_CURRENT_AMOUNT_PAID':
      return { ...state, currentAmountPaid: action.payload };
    case 'SET_PAYMENT_AMOUNT':
      return { ...state, paymentAmount: action.payload };
    case 'SET_CURRENT_UNIT_PRICE':
      return { ...state, currentUnitPrice: action.payload };
    case 'SET_CURRENT_QUANTITY':
      return { ...state, currentQuantity: action.payload };
    case 'SET_IS_SUBMITTING':
      return { ...state, isSubmitting: action.payload };
    case 'SET_SELECTED_CASHIER':
      return { ...state, selectedCashier: action.payload };
    case 'SET_CUSTOMER_TYPE_FILTER':
      return { ...state, customerTypeFilter: action.payload };
    case 'SET_FILTER_BY':
      return { ...state, filterBy: action.payload };
    case 'SET_START_DATE':
      return { ...state, startDate: action.payload };
    case 'SET_END_DATE':
      return { ...state, endDate: action.payload };
    case 'SET_ERRORS':
      return { ...state, errors: { ...state.errors, ...action.payload } };
    case 'CLEAR_ERRORS':
      return { ...state, errors: {} };
    case 'SET_SELECTED_ITEMS':
      return { ...state, selectedItems: action.payload };
    case 'ADD_SELECTED_ITEM':
      return { ...state, selectedItems: [...state.selectedItems, action.payload] };
    case 'REMOVE_SELECTED_ITEM':
      return {
        ...state,
        selectedItems: state.selectedItems.filter((_, index) => index !== action.payload),
      };
    case 'CLEAR_SELECTED_ITEMS':
      return { ...state, selectedItems: [] };
    case 'SET_CURRENT_ITEM':
      return { ...state, currentItem: action.payload };
    case 'SET_FORM_ERROR':
      return { ...state, formError: action.payload };
    case 'CLEAR_FORM_ERROR':
      return { ...state, formError: '' };
    case 'SET_SELECTED_SITE':
      return { ...state, selectedSite: action.payload };
    case 'SET_SHIFT_ACTIVE':
      return { ...state, shiftActive: action.payload };
    default:
      return state;
  }
}
