import { mmkvStorage } from "@/libs/mmkvStorage";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type RecipientState = {
  recipients: any[] | null;
  recipient: any | null;
  setRecipients: (recipients: any[]) => void;
  setRecipient: (recipient: any) => void;
};

export const useRecipientStore = create<RecipientState>()(
  persist(
    (set) => ({
      recipients: [],
      recipient: null,
      setRecipients: (recipients) => set({ recipients }),
      setRecipient: (recipient) => set({ recipient }),
    }),
    {
      name: "recipient-storage",
      storage: mmkvStorage,
    }
  )
);
