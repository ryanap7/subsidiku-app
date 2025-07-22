import { mmkvStorage } from "@/libs/mmkvStorage";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type ProductState = {
  products: any[];
  setProducts: (products: any[]) => void;
};

export const useProductStore = create<ProductState>()(
  persist(
    (set) => ({
      products: [],
      setProducts: (products) => set({ products }),
    }),
    {
      name: "product-storage",
      storage: mmkvStorage,
    }
  )
);
