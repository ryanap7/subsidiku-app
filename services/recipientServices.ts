import { useRecipientStore } from "@/stores/recipientStore";
import { AxiosResponse } from "axios";
import api from "./api";

export const getRecipientById = async (nationalId: string) => {
  const response: AxiosResponse<{
    message: string;
    data: any;
  }> = await api.get(`/mobile/recipients/nik/${nationalId}`);

  const { data } = response.data;

  const { setRecipient } = useRecipientStore.getState();

  setRecipient(data);

  return response.data;
};

export const getRecipientByMerchant = async (merchantId: string) => {
  const response: AxiosResponse<{
    message: string;
    data: any[];
  }> = await api.get(`/mobile/recipients/merchant/${merchantId}`);

  const { data } = response.data;

  const { setRecipients } = useRecipientStore.getState();

  setRecipients(data);

  return response.data;
};
