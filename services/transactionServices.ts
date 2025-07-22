import { useTransactionStore } from "@/stores/transactionStore";
import { AxiosResponse } from "axios";
import api from "./api";

export const getTransactions = async () => {
  const response: AxiosResponse<{
    message: string;
    data: any[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> = await api.get("/mobile/transactions");

  const { data } = response.data;

  const { setTrasactions } = useTransactionStore.getState();

  setTrasactions(data);

  return response.data;
};
