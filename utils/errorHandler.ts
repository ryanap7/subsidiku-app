import { useAuthStore } from "@/stores/authStore";
import { isAxiosError } from "axios";
import { Alert } from "react-native";

export const handleApiError = (error: unknown) => {
  let message = "Something went wrong";

  if (isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data;

    if (status === 401) {
      useAuthStore.getState().logout();
    } else if (status === 400) {
      message = data?.message || "Bad request";
    } else if (status === 500) {
      message = "Internal Server Error";
    } else if (data?.message) {
      message = data.message;
    }
  }

  Alert.alert("Error", message);
};
