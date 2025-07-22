import Toast from "react-native-toast-message";

export const showToast = (
  type: "success" | "error" | "info",
  title: string,
  message?: string
) => {
  Toast.show({
    type,
    text1: title,
    text2: message,
    position: "top",
    visibilityTime: 2500,
    topOffset: 60,
  });
};
