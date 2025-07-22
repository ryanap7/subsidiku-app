import { mmkvStorage } from "@/libs/mmkvStorage";
import {
  MerchantUser,
  RecipientProfile,
  RecipientUser,
} from "@/types/stores/auth";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
  token: string | null;
  user: RecipientUser | MerchantUser | RecipientProfile | null;
  role: "merchant" | "recipient" | null;
  setRole: (role: "merchant" | "recipient") => void;
  setToken: (token: string) => void;
  setUser: (user: RecipientUser | MerchantUser | RecipientProfile) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      role: null,
      setRole: (role) => set({ role }),
      setToken: (token) => set({ token }),
      setUser: (user) => set({ user }),
      logout: () => set({ token: null, role: null, user: null }),
    }),
    {
      name: "auth-storage",
      storage: mmkvStorage,
    }
  )
);
