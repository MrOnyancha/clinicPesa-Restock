import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { WebService } from '@/web-services/WebService';

export interface AddProductsPayload {
  requestType: "ADD_PRODUCTS";
  orderId: string;
  items: {
    itemName: string;
    quantity: number | string; // 🔁 allow string just in case
    unitOfMeasure: string;
    orderItemStatus: string;
  }[];
  dispenser: {
    name: string;
    accountId: string;
  };
}

export const useAddProductsToOrder = () => {
  const queryClient = useQueryClient();

  return useMutation<
    any, // response type (you can replace `any` with actual response type if available)
    any, // error type (use `any` to access `.response`)
    { payload: AddProductsPayload; refetchStatus?: string }
  >({
    mutationFn: async ({ payload }) => {
      const response = await WebService.postPharma('requestOrder', payload);

      if (!response?.status) {
        throw new Error('Server rejected add products request');
      }

      return response;
    },
    onSuccess: (_data, variables) => {
      if (variables.refetchStatus) {
        queryClient.invalidateQueries({
          queryKey: ['ordersByStatus', variables.refetchStatus],
        });
      }
      toast.success('Products added successfully');
    },
    onError: (error: any) => {
      const messages = error?.response?.data?.message;

      if (Array.isArray(messages) && messages.length > 0) {
        messages.forEach((msg: string) => {
          toast.error(msg);
        });
      } else {
        toast.error('Failed to add products. Please try again.');
      }
    },
  });
};

