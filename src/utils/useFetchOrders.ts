import { WebService } from '@/web-services/WebService';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

type OrderItem = {
  itemName: string;
  listID: string;
  quantity: number;
  unitOfMeasure: string;
  rate: number;
  orderItemStatus: string;
  notes: string | null;
};

type Dispenser = {
  accountId: string;
  name: string;
};

interface Note {
  comment: string;
  commentBy: string;
  commentTime: number;
}

export type Ordery = {
  orderId: string;
  orderNo: string;
  dispenser: Dispenser;
  requestType: string | null;
  orderStatus: string;
  items: OrderItem[];
  facilityName: string;
  tillNo: string;
  timeStamp: number;
  lastUpdated: number;
  scheduledDate: number;
  region: string;
  filterBy: string | null;
  page: number | null;
  filterDate: string | null;
  notes: Note[];
  name: string;
};

type OrderResponse = {
  status: boolean;
  message: Ordery[];
};

export const useFetchOrdersByStatus = (status: string, enabled = true) => {
  const account_id = localStorage.getItem("account_id");
  const firstName = localStorage.getItem("firstName");
  const adsRole = localStorage.getItem("adsrole");
  const adsStation = localStorage.getItem("adsStation");
  const siteName = localStorage.getItem("siteName");

  const isDispenser = adsRole === "DISPENSER";
  const facilityName = isDispenser ? siteName : "clinicPesa HQ";
  const filterBy = isDispenser ? "R_FACILITY_STATUS" : "R_STATUS";

  const fetchOrdersByStatus = async (): Promise<Ordery[]> => {
    const requestBody = {
      requestType: "GET_ORDERS",
      dispenser: {
        name: firstName,
        accountId: account_id,
      },
      facilityName,
      tillNo: adsStation,
      orderStatus: status,
      filterBy,
    };

    const res = await WebService.postPharma("requestOrder", requestBody);

    if (res?.status && Array.isArray(res.message)) {
      return res.message;
    } else {
      toast.error("Failed to fetch orders by status");
      throw new Error("Invalid response from server");
    }
  };

  const query = useQuery({
    queryKey: ["ordersByStatus", adsRole, facilityName, status],
    queryFn: fetchOrdersByStatus,
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!account_id && !!adsStation && !!facilityName && enabled,
  });

  return {
    ...query,
    refetchOrders: query.refetch, // ✅ Expose with clear name
  };
};

