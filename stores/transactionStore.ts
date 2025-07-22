import { mmkvStorage } from "@/libs/mmkvStorage";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type TransactionState = {
  transactions: any[];
  setTrasactions: (transactions: any[]) => void;
};

export const useTransactionStore = create<TransactionState>()(
  persist(
    (set) => ({
      transactions: [],
      setTrasactions: (transactions) => set({ transactions }),
    }),
    {
      name: "transaction-storage",
      storage: mmkvStorage,
    }
  )
);
