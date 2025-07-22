import { mmkvStorage } from "@/libs/mmkvStorage";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type MerchantState = {
  merchants: any[];
  merchant: any;
  setMerchants: (merchants: any[]) => void;
  setMerchant: (merchant: any) => void;
};

export const useMerchantStore = create<MerchantState>()(
  persist(
    (set) => ({
      merchants: [],
      merchant: {},
      setMerchants: (merchants) => set({ merchants }),
      setMerchant: (merchant) => set({ merchant }),
    }),
    {
      name: "merchant-storage",
      storage: mmkvStorage,
    }
  )
);
