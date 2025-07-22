import { MMKV } from "react-native-mmkv";
import { createJSONStorage } from "zustand/middleware";

export const mmkv = new MMKV();

export const mmkvStorage = createJSONStorage(() => ({
  getItem: (key) => {
    const value = mmkv.getString(key);
    return value ?? null;
  },
  setItem: (key, value) => {
    mmkv.set(key, value);
  },
  removeItem: (key) => {
    mmkv.delete(key);
  },
}));
