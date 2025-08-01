import { WebService } from '@/web-services/WebService';

export const fetchVendors = async () => {
  const response = await WebService.postPharma('vendors', {
    requestType: 'QUERY_VENDOR',
    filterBy: 'V_ALL',
  });

  // Adjust this based on your actual response structure
 return response.message || [];
};
