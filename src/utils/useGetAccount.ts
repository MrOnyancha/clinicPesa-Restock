// src/utils/useGetAccount.ts
import { useMutation } from "@tanstack/react-query";

import axiosInstance from "@/Interceptors/clinicPesaAuth.Interceptor";

const getAccount = async (phone: string, accountId: string) => {
    const test = 'https://care.clinicpesa.com/gateway/action';
  const response = await axiosInstance.post("/api/care/api/account", {
    task: "GET_ACCOUNT",
    customerNo: `FRI:${phone}@clinicpesa.public.user.sp1/SP`,
    accountId: `FRI:${accountId}@clinicpesa.public.user.sp1/SP`,
  });

  const data = response.data;

  if (!data.status) {
    throw new Error("Customer not found, check if correct number was entered");
  }

  return data.message; // Contains accDetails, currency, loanBalance, etc.
};

export const useGetAccount = () =>
  useMutation({
    mutationFn: ({ phone, accountId }: { phone: string; accountId: string }) =>
      getAccount(phone, accountId),
  });
