import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { WebService } from '@/web-services/WebService'; // adjust import path as needed

export const useFetchSites = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await WebService.postPharma('sites', { request: 'S_QUERY' });

      if (!response?.status || !Array.isArray(response.message)) {
        throw new Error('Invalid site response format.');
      }

      return response.message; // ✅ return array of sites
    },

    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to fetch site list.';
      toast.error(`Error: ${errorMessage}`);
    },
  });
};
