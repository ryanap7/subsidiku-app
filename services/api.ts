import { useAuthStore } from "@/stores/authStore";
import { handleApiError } from "@/utils/errorHandler";
import axios from "axios";

const api = axios.create({
  baseURL: "https://subsidiku-be.digitalindotekno.com/api",
  timeout: 10000,
});

api.interceptors.request.use(
  async (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    handleApiError(error);
    return Promise.reject(error);
  }
);

export default api;
