import { statisticsOrdersUrl } from '@/services/httphandler/api';
import { WebService } from '@/web-services/WebService';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

type OrderStatisticsResponse = {
  year: number;
  totalRequestOrders: number;
  requestOrdersGrowth: number;
  statusCounts: Record<string, number>;
  requestsByMonth: Record<string, number>;
  requestsByWeek: Record<string, number>;
  requestsByDay: Record<string, number>;
};
interface Params {
  tillNo?: number;
}


type UseOrderStatisticsOptions = {
  tillNo?: number;
  refetchInterval?: number;
};

const fetchOrderStatistics = async ({ tillNo }: Params): Promise<OrderStatisticsResponse> => {
  if (!tillNo) {
    tillNo = 0; // Default to 0 if tillNo is not provided
  }
  console.log('Fetching order statistics for tillNo:', tillNo);
  const params = {"requestType": "GET", params: {keys: ["siteId"], values: [tillNo] }};

  const response = await WebService.postPharma('orders_statistics', params );
  console.log('Order Statistics Response:', response);
  return response;
};


export const useOrderStatistics = (options?: UseOrderStatisticsOptions) => {
  return useQuery<OrderStatisticsResponse>({
    queryKey: ['orderStatistics', options?.tillNo ?? 'all'],
    queryFn: () => fetchOrderStatistics({ tillNo: options?.tillNo }),
    refetchInterval: options?.refetchInterval,
  });
};
