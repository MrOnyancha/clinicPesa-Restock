import { WebService } from "@/web-services/WebService";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

interface DispenserPayload {
  request: string;
  accountNo: string;
  requestId: string;
  pharmacist: {
    ads: boolean;
    active: boolean;
    station: string[];
    role: string;
  };
}

interface ErrorResponse {
  message?: string;
  error?: string;
  status?: string | number;
}

export const useCreateDispenser = () => {
  return useMutation({
    mutationFn: async (payload: DispenserPayload) => {
      try {
        const { data } =  await WebService.postPharma("pharma", payload);
        return data;
      } catch (error) {
        const err = error as AxiosError<ErrorResponse>;
        // You can throw a custom error here that you can use in the component
        const message =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Something went wrong while creating the dispenser";
        throw new Error(message);
      }
    },
    onError: (error: Error) => {
      console.error("Dispenser creation failed:", error.message);
    },
  });
};
