import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { toast } from 'sonner';
import { WebService } from '@/web-services/WebService';

interface InventoryQueryParams {
  itemName: string;
  enabled?: boolean;
}

type ItemStockResponse = {
  quantityOnsite: number;
  sites: any[];
  raw: any;
};

export const useItemStockQuery = ({
  itemName,
  enabled = true,
}: InventoryQueryParams): UseQueryResult<ItemStockResponse, Error> => {
  const facilityName = localStorage.getItem('siteName') || 'clinicPesa HQ';
  const adsStation = localStorage.getItem('adsStation') || '';

  return useQuery<ItemStockResponse, Error>({
    queryKey: ['itemStock', itemName],
    queryFn: async () => {
      try {
        const body = {
          request: 'I_SEARCH',
          itemName,
          sites: [
            {
              siteName: facilityName,
              siteId: adsStation,
            },
          ],
        };

        const response = await WebService.postPharma('inventory', body);

        const sites = response?.message?.[0]?.sites || [];
        const quantityOnsite = sites?.[0]?.quantityOnsite || 0;

        return {
          quantityOnsite,
          sites,
          raw: response,
        };
      } catch (error) {
        toast.warning('Failed to fetch item stock');
        throw error;
      }
    },
    enabled: !!itemName && enabled,
    retry: false,
  });
};
