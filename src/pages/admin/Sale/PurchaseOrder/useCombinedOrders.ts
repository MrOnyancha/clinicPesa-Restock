import { WebService } from "@/web-services/WebService";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

type CombinedOrdersResponse = {
  status: boolean;
  combinedOrders: Array<{
    combinedOrderId: string;
    orderIdsCombined: string[];
    combinedItems: any[];
    createdAt: number;
    totalOrdersCombined: number;
  }>;
};

export const useUpdatePurchaseOrder = () =>
  useMutation<CombinedOrdersResponse, Error>({
    mutationFn: async () => {
      const payload = {
        requestType: 'GET_COMBINED_ORDERS',
      };

      console.log("📦 Sending payload:", payload);

      const response = await WebService.postPharma('requestOrder', payload);

      console.log("📥 Raw response from postPharma:", response);

      // If WebService.postPharma returns full Axios response, use `.data`
      // Otherwise if it already returns `response.data`, return as is
      if (response?.status && response.combinedOrders) {
        console.log("✅ Parsed Combined Orders:", response.combinedOrders);
        return response;
      } else {
        console.error("❌ Unexpected response format:", response);
        throw new Error("Invalid response from combined orders API");
      }
    },
    onError: (error) => {
      console.error("❌ Mutation Error:", error);
    },
    onSuccess: (data) => {
      console.log("✅ Mutation Success - Combined Orders Response:", data);
    },
  });
