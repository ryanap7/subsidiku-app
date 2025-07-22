import { useAuthStore } from "@/stores/authStore";
import {
  MerchantUser,
  RecipientProfile,
  RecipientUser,
} from "@/types/stores/auth";
import { AxiosResponse } from "axios";
import api from "./api";

type LoginPayload = {
  nik: string;
  password: string;
};

type RegisterPayload = {
  merchantCode?: string | null;
  nik: string;
  name: string;
  phone: string;
  address: string;
  district: string;
  income: number;
  familiyMembers: number;
  landArea: number;
  homeOwnership: string;
  kjsNumber: string;
  haveBankAccount: boolean;
  password: string;
  subsidies: string[];
  suspensionNotes: string | null;
};

export const loginRecipient = async (payload: LoginPayload) => {
  const response: AxiosResponse<{
    access_token: string;
    recipient: RecipientUser;
  }> = await api.post("/auth/recipient/login", payload);

  const { access_token, recipient } = response.data;

  const { setToken, setUser, setRole } = useAuthStore.getState();

  setToken(access_token);
  setUser(recipient);
  setRole("recipient");

  return response.data;
};

export const loginMerchant = async (payload: LoginPayload) => {
  const response: AxiosResponse<{
    access_token: string;
    merchant: MerchantUser;
  }> = await api.post("/auth/merchant/login", payload);

  const { access_token, merchant } = response.data;

  const { setToken, setUser, setRole } = useAuthStore.getState();

  setToken(access_token);
  setUser(merchant);
  setRole("merchant");

  return response.data;
};

export const getProfile = async () => {
  const response: AxiosResponse<{
    message: string;
    data: {
      profile: RecipientProfile;
      stats: {
        totalTransactions: number;
      };
    };
  }> = await api.get("/mobile/profile");

  const { profile } = response.data.data;

  const { setUser } = useAuthStore.getState();

  setUser(profile);

  return response.data;
};

export const register = async (payload: RegisterPayload) => {
  const response: AxiosResponse<{
    message: string;
    recipient: RecipientUser;
  }> = await api.post("/auth/recipient/register", payload);

  return response.data;
};
