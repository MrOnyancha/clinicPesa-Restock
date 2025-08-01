export const DEFAULT_STATUS = 'Request';
import { RequestOrderItem, OrderResponse } from '@/utils/types';

export const RequestOrderStatuses: string[] = [
  'GENERAL',
  'ORDERS',
  'PROCESSING',
  'PARTIAL',
  'COMPLETED',
  'READY',
  'PICKUP',
  'DELIVERED',
  'DELIVERED_WITH_EXCEPTIONS'
];

export type ROSubmittedItem = {
  fullName: string;
  quantity?: number;
  quantityOrdered?: number | string;
  unitOfMeasure?: string;
  unitOfMeasureSetRef?: {
    listID: string;
    fullName: string;
  };
};

// Define the state interface
export interface RequestOrderState {
  isSubmitting: boolean;
  isSaving: boolean;
  resetFields: boolean;
  selectedItem: RequestOrderItem | null;
  selectedItems: any[];
  showClearDialog: boolean;
  openPopoverIndex: number | null;
  orderResponse: OrderResponse | null;
  isEditing: boolean;
}

// Define action types
export type RequestOrderAction =
  | { type: 'SET_IS_SUBMITTING'; payload: boolean }
  | { type: 'SET_IS_SAVING'; payload: boolean }
  | { type: 'SET_RESET_FIELDS'; payload: boolean }
  | { type: 'SET_SELECTED_ITEM'; payload: RequestOrderItem | null }
  | { type: 'SET_SELECTED_ITEMS'; payload: any[] }
  | { type: 'ADD_SELECTED_ITEM'; payload: any }
  | { type: 'CLEAR_SELECTED_ITEMS' }
  | { type: 'SET_SHOW_CLEAR_DIALOG'; payload: boolean }
  | { type: 'SET_OPEN_POPOVER_INDEX'; payload: number | null }
  | { type: 'SET_ORDER_RESPONSE'; payload: OrderResponse | null }
  | { type: 'SET_IS_EDITING'; payload: boolean };

// Initial state
export const initialState: RequestOrderState = {
  isSubmitting: false,
  isSaving: false,
  resetFields: false,
  selectedItem: null,
  selectedItems: [],
  showClearDialog: false,
  openPopoverIndex: null,
  orderResponse: null,
  isEditing: false,
};

// Reducer function
export const reducer = (state: RequestOrderState, action: RequestOrderAction): RequestOrderState => {
  switch (action.type) {
    case 'SET_IS_SUBMITTING':
      return { ...state, isSubmitting: action.payload };
    case 'SET_IS_SAVING':
      return { ...state, isSaving: action.payload };
    case 'SET_RESET_FIELDS':
      return { ...state, resetFields: action.payload };
    case 'SET_SELECTED_ITEM':
      return { ...state, selectedItem: action.payload };
    case 'SET_SELECTED_ITEMS':
      return { ...state, selectedItems: action.payload };
    case 'ADD_SELECTED_ITEM':
      return { ...state, selectedItems: [...state.selectedItems, action.payload] };
    case 'CLEAR_SELECTED_ITEMS':
      return { ...state, selectedItems: [] };
    case 'SET_SHOW_CLEAR_DIALOG':
      return { ...state, showClearDialog: action.payload };
    case 'SET_OPEN_POPOVER_INDEX':
      return { ...state, openPopoverIndex: action.payload };
    case 'SET_ORDER_RESPONSE':
      return { ...state, orderResponse: action.payload };
    case 'SET_IS_EDITING':
      return { ...state, isEditing: action.payload };
    default:
      return state;
  }
};
