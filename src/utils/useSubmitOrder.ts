// useSubmitOrder.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { WebService } from '@/web-services/WebService';

export const useSubmitOrder = ({
  onOrderResponseChange,
  resetForm,
  setSelectedItems,
  setSelectedItem,
  triggerResetFields,
}: {
  onOrderResponseChange?: (order: any) => void;
  resetForm: () => void;
  setSelectedItems: (items: any[]) => void;
  setSelectedItem: (item: any | null) => void;
  triggerResetFields: () => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestBody: any) => {
      return await WebService.postPharma('requestOrder', requestBody);
    },
    onSuccess: (response, variables) => {
      toast.dismiss();
      if (response?.status) {
        const orderData = response.message as unknown as any[];

        toast.success(variables.isEditing ? 'Order updated successfully!' : 'Order created successfully!');

        if (onOrderResponseChange && orderData?.length > 0) {
          onOrderResponseChange(orderData[0]);
        }

        resetForm();
        setSelectedItems([]);
        setSelectedItem(null);
        triggerResetFields();

        queryClient.invalidateQueries(); // You can make this more specific later
      }
    },
    onError: () => {
      toast.dismiss();
      toast.error('Failed to submit order.');
    },
  });
};
