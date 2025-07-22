import { useProductStore } from "@/stores/productStore";
import { AxiosResponse } from "axios";
import api from "./api";

export const getProducts = async () => {
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
  }> = await api.get("/products");

  const { data } = response.data;

  const { setProducts } = useProductStore.getState();

  setProducts(data);

  return response.data;
};
