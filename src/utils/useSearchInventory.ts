import { WebService } from "@/web-services/WebService";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export type SearchInventoryPayload = {
  request: "I_SEARCH";
  itemName: string;
  sites: { siteName: string; siteId: string }[];
};

export const useSearchInventory = () => {
  return useMutation({
    mutationFn: async (payload: SearchInventoryPayload) => {
      const response = await WebService.postPharma("inventory", payload);
      return response.data;
    },
  });
};
