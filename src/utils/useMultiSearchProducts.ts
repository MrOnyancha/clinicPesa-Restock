import { useQuery } from '@tanstack/react-query';
import { Product } from '@/utils/types';
import { WebService } from '@/web-services/WebService';

interface SearchResponse {
  items: Product[];
  total: number;
}

interface UseMultiSearchProductsParams {
  searchTerms: string[];
  sites: { siteName: string; siteId: string }[];
}

export const useMultiSearchProducts = ({ searchTerms, sites }: UseMultiSearchProductsParams) => {
  return useQuery<SearchResponse, Error>({
    queryKey: ['multiSearchProducts', searchTerms],
    queryFn: async () => {
      const response = await WebService.postPharma('inventory', {
        request: 'I_SEARCH',
        search: searchTerms,
        sites,
      });
      return response.data;
    },
    enabled: searchTerms.length > 0, // Only run query if searchTerms is not empty
  });
};
