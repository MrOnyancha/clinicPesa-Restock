import { useMutation } from '@tanstack/react-query';
import { postQBXMLData } from '@/services/httphandler'; // adjust path
import { toast } from 'sonner';
import { WebService } from '@/web-services/WebService';

export const useSubmitCombinedOrders = () => {
  return useMutation({
    mutationFn: async (orderIds: string[]) => {
      const payload = {
        requestType: 'COMBINE',
        ids: orderIds,
      };

      const res = await WebService.postPharma('requestOrder', payload);

      if (res?.status && res.result) {
        return res.result; // ✅ FIXED: return `res.result`, not `res.message`
      } else {
        throw new Error('Failed to combine orders');
      }
    },
    onSuccess: (data) => {
      toast.success('Orders combined successfully');
    },
    onError: () => {
      toast.error('Failed to submit combined orders');
    },
  });
};
