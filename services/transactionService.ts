import { AxiosResponse } from "axios";
import api from "./api";

export const createTransaction = async (payload: any) => {
  const response: AxiosResponse<{
    message: string;
    data: any;
  }> = await api.post("/transactions", payload);

  return response.data;
};
