import { ReactNode } from "react";
import { ViewStyle } from "react-native";

export interface BottomSheetProps {
  type?: "content" | "full";
  children: ReactNode;
  style?: ViewStyle;
  onClose?: () => void;
}

export type BottomSheetState = {
  visible: boolean;
};
