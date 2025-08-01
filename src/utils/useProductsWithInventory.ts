import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { Product } from '@/utils/types';
import { WebService } from '@/web-services/WebService';

export const useProductsWithInventory = (page: number, size: number, itemNames: string[]) => {
  return useQuery<Product[], Error>({
    queryKey: ['productsWithInventory', page, size, itemNames],  // Include itemNames in the queryKey
    queryFn: async () => {
      try {
        const payload = {
          request: 'I_QUERY',
          sites: [
        {
            "siteName": "ADS Pharmacy FortPortal",
            "siteId": "444456"
        }
    ],
         filterBy: "SITE",
         
        };

        console.log("Payload for Product Search:", payload);
        
        const response = await WebService.postPharma('inventory', payload);
        const products: Product[] = (response.message || []).map((item: any) => ({
          ...item,
          fullName: item.name,
        }));

        const itemNames = products
          .map((item) => item.fullName)
          .filter((name) => !!name); // Filter out empty names


        // Log the itemNames array to see the names we're sending
        console.log("Item Names Sent for Inventory Search:", itemNames);

        const adsStation = localStorage.getItem('adsStation');
        const facilityName = localStorage.getItem('facilityName');

        const inventoryPayload = {
          request: 'I_SEARCH',
          search: itemNames,  // Pass the array of product names for bulk search
          sites: [{ siteName: facilityName, siteId: adsStation }],
        };

        const inventoryResponse = await WebService.postPharma('inventory', inventoryPayload);

        const enrichedProducts = products.map((product) => {
          const match = inventoryResponse.message?.find(
            (inv: any) =>
              inv.fullName?.trim().toLowerCase() === product.fullName.trim().toLowerCase()
          );

          const sites = match?.sites || [];
          const itemsLeft = sites.reduce(
            (sum: number, site: any) => sum + (Number(site.quantityOnHand) || 0),
            0
          );

          return {
            ...product,
            sites,
            itemsLeft,
          };
        });

        console.log("Enriched Products with Inventory:", enrichedProducts);

        return enrichedProducts;
      } catch (error) {
        toast.warning('Failed to fetch item stock');
        throw error;
      }
    },
    staleTime: 5000, // simulate keepPreviousData
  });
};
