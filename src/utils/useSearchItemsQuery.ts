import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { toast } from 'sonner';
import { WebService } from '@/web-services/WebService';

type SearchItemsResponse = {
  items: any;
  status: boolean;
  message: any[]; // Replace with more specific type if you know item structure
};

export const useSearchItemsQuery = (): UseMutationResult<SearchItemsResponse, Error, string> => {
  return useMutation<SearchItemsResponse, Error, string>({
    mutationFn: async (query: string) => {
      const data = {
        itemsRsAction: 'SEARCH_ITEMS',
        search: query,
        filterBy: 'NAME',
        declaration: { _attributes: { version: '1.0' } },
      };

      console.log('🔍 Searching items with data:', data);

      return WebService.postPharma('items', data);
    },
    onSuccess: (data) => {
      console.log('✅ Full API response:', data);
    },
    onError: () => {
      toast.error('Error fetching items');
    },
  });
};
