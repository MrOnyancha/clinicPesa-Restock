import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { postQBXMLData } from '@/services/httphandler';
import { Ordery } from './useFetchOrders';
import { RequestOrderStatuses } from '../pages/admin/Sale/RequestOrder/constants';
import { WebService } from '@/web-services/WebService';

// Helper function to check if the status transition is valid
const isValidStatusTransition = (currentStatus: string, newStatus: string, orderStatuses: string[]): boolean => {
  const currentStatusUpper = currentStatus.toUpperCase();
  const newStatusUpper = newStatus.toUpperCase();
  if (currentStatusUpper === newStatusUpper) return true;
  const currentIndex = orderStatuses.indexOf(currentStatusUpper);
  const newIndex = orderStatuses.indexOf(newStatusUpper);
  return newIndex === currentIndex + 1 || newIndex === currentIndex - 1;
};

// --- useUpdateOrderStatus ---
type UpdateOrderStatusParams = {
  order: Ordery;
  newStatus: string;
  userType: string | null;
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  const dispenserName = localStorage.getItem('firstName');
  const accountId = localStorage.getItem('account_id');

  return useMutation({
    mutationFn: async (params: UpdateOrderStatusParams) => {
      const { order, newStatus, userType } = params;

      if (userType === 'DISPENSER') {
        const currentOrderStatus = order.orderStatus?.toUpperCase() || '';
        const updatedStatus = newStatus.toUpperCase();
        if (currentOrderStatus !== 'GENERAL' && currentOrderStatus !== 'ORDERS') {
          toast.error('As a dispenser, you can only view this status');
          throw new Error('Permission denied for dispenser');
        }
        if (currentOrderStatus === 'ORDERS' && updatedStatus === 'GENERAL') {
          toast.error('As a dispenser, you cannot change orders from ORDERS back to GENERAL');
          throw new Error('Permission denied: Cannot move orders back to GENERAL');
        }
        if (updatedStatus !== 'GENERAL' && updatedStatus !== 'ORDERS') {
          toast.error('As a dispenser, you can only change to GENERAL or ORDERS status');
          throw new Error('Invalid status change for dispenser');
        }
      }

      if (!isValidStatusTransition(order.orderStatus || '', newStatus, RequestOrderStatuses)) {
        toast.error(
          `Cannot skip stages. Status can only move one step forward or backward in sequence: ${RequestOrderStatuses.join(
            ' → ',
          )}`,
        );
        throw new Error('Invalid status transition');
      }

      const payload = {
        requestType: 'UPDATE_R_STATUS',
        orderId: order.orderId,
        dispenser: {
          name: dispenserName,
          accountId: accountId,
        },
        orderStatus: newStatus.toUpperCase(),
      };
      return WebService.postPharma('requestOrder', payload);
    },
    onSuccess: (response) => {
      if (response?.status) {
        toast.success('Order status updated successfully!');
        queryClient.invalidateQueries({ queryKey: ['orders'] });
        queryClient.invalidateQueries({ queryKey: ['ordersByStatus'] });
      } else {
        toast.error(response?.message || 'Failed to update order status.');
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'An unexpected error occurred while updating order status.', { id: 'update-order-status-error' });
    },
  });
};

// --- useUpdateItemQuantity ---
type UpdateItemQuantityParams = {
  orderId: string;
  item: {
    itemName: string;
    quantity: number;
  };
};

export const useUpdateItemQuantity = () => {
  const queryClient = useQueryClient();
  const dispenserName = localStorage.getItem('firstName');
  const accountId = localStorage.getItem('account_id');

  return useMutation({
    mutationFn: async (params: UpdateItemQuantityParams) => {
      const { orderId, item } = params;
      const { itemName, quantity } = item;

      const payload = {
        requestType: 'UPDATE_QUANITY', // Typo from original: 'UPDATE_QUANITY'
        orderId,
        dispenser: {
          accountId: accountId,
          name: dispenserName,
        },
        items: [
          {
            itemName,
            quantity,
          },
        ],
      };
      return WebService.postPharma('requestOrder', payload);
    },
    onSuccess: (response) => {
      if (response?.status) {
        toast.success('Item quantity updated successfully!');
        queryClient.invalidateQueries({ queryKey: ['orders'] });
        queryClient.invalidateQueries({ queryKey: ['ordersByStatus'] });
      } else {
        toast.error(response?.message || 'Failed to update item quantity.');
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'An unexpected error occurred while updating item quantity.', { id: 'update-item-quantity-error' });
    },
  });
};

// --- useUpdateProductItemStatus ---
type UpdateProductItemStatusParams = {
  orderId: string;
  item: {
    itemName: string;
    listID: string;
    orderItemStatus: string;
  };
};

export const useUpdateProductItemStatus = () => {
  const queryClient = useQueryClient();
  const dispenserName = localStorage.getItem('firstName');
  const accountId = localStorage.getItem('account_id');

  return useMutation({
    mutationFn: async (params: UpdateProductItemStatusParams) => {
      const { orderId, item } = params;
      const { itemName, listID, orderItemStatus } = item;

      const payload = {
        requestType: 'UPDATE_ONE',
        orderId,
        dispenser: {
          name: dispenserName,
          accountId: accountId,
        },
        items: [
          {
            itemName,
            listID,
            orderItemStatus,
          },
        ],
      };
      return WebService.postPharma('requestOrder', payload);
    },
    onSuccess: (response) => {
      if (response?.status) {
        toast.success('Product item status updated successfully!');
        queryClient.invalidateQueries({ queryKey: ['orders'] });
        queryClient.invalidateQueries({ queryKey: ['ordersByStatus'] });
      } else {
        toast.error(response?.message || 'Failed to update product item status.');
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'An unexpected error occurred while updating product item status.', { id: 'update-product-item-status-error' });
    },
  });
};

// --- useDeleteProductItem ---
type DeleteProductItemParams = {
  orderId: string;
  item: {
    itemName: string;
    quantity: number;
    unitOfMeasure?: string;
  };
};

export const useDeleteProductItem = () => {
  const queryClient = useQueryClient();
  const dispenserName = localStorage.getItem('firstName');
  const accountId = localStorage.getItem('account_id');

  return useMutation({
    mutationFn: async (params: DeleteProductItemParams) => {
      const { orderId, item } = params;
      const { itemName, quantity, unitOfMeasure } = item;

      let cleanUnitOfMeasure = unitOfMeasure || '';
      if (cleanUnitOfMeasure.startsWith('Count by ')) {
        cleanUnitOfMeasure = cleanUnitOfMeasure.replace('Count by ', '');
      }

      const payload = {
        requestType: 'DELETE_PRODUCT',
        orderId,
        items: [
          {
            itemName,
            quantity,
            unitOfMeasure: cleanUnitOfMeasure,
          },
        ],
        dispenser: {
          name: dispenserName,
          accountId: accountId,
        },
      };
      return WebService.postPharma('requestOrder', payload);
    },
    onSuccess: (response) => {
      if (response?.status) {
        toast.success('Product item deleted successfully!');
        queryClient.invalidateQueries({ queryKey: ['orders'] });
        queryClient.invalidateQueries({ queryKey: ['ordersByStatus'] });
      } else {
        toast.error(response?.message || 'Failed to delete product item.');
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'An unexpected error occurred while deleting product item.', { id: 'delete-product-item-error' });
    },
  });
};

// --- useAddProductItems ---
type AddProductItemsParams = {
  orderId: string;
  items: Array<{
    itemName: string;
    quantity: number;
    unitOfMeasure: string;
  }>;
};

export const useAddProductItems = () => {
  const queryClient = useQueryClient();
  const dispenserName = localStorage.getItem('firstName');
  const accountId = localStorage.getItem('account_id');

  return useMutation({
    mutationFn: async (params: AddProductItemsParams) => {
      const { orderId, items } = params;

      const cleanedItems = items.map((item) => {
        let unitOfMeasure = item.unitOfMeasure || '';
        if (unitOfMeasure.startsWith('Count by ')) {
          unitOfMeasure = unitOfMeasure.replace('Count by ', '');
        }
        return {
          itemName: item.itemName,
          quantity: item.quantity,
          unitOfMeasure: unitOfMeasure,
        };
      });

      const payload = {
        requestType: 'ADD_PRODUCTS',
        orderId,
        items: cleanedItems,
        dispenser: {
          name: dispenserName,
          accountId: accountId,
        },
      };
      return WebService.postPharma('requestOrder', payload);
    },
    onSuccess: (response) => {
      if (response?.status) {
        toast.success('Product items added successfully!');
        queryClient.invalidateQueries({ queryKey: ['orders'] });
        queryClient.invalidateQueries({ queryKey: ['ordersByStatus'] });
      } else {
        toast.error(response?.message || 'Failed to add product items.');
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'An unexpected error occurred while adding product items.', { id: 'add-product-items-error' });
    },
  });
};
