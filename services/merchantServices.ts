import { useMerchantStore } from "@/stores/merchantStore";
import { AxiosResponse } from "axios";
import api from "./api";

export const getMerchants = async () => {
  const response: AxiosResponse<{
    message: string;
    data: any[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }> = await api.get("/merchants");

  const { data } = response.data;

  const { setMerchants } = useMerchantStore.getState();

  setMerchants(data);

  return response.data;
};

export const getMerchant = async (merchantId: string) => {
  const response: AxiosResponse<any> = await api.get(
    `/merchants/${merchantId}`
  );

  const { data } = response;

  const { setMerchant } = useMerchantStore.getState();

  setMerchant(data);

  return response.data;
};
