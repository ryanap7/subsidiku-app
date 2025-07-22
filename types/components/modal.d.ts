import { ReactNode } from "react";
import { ViewStyle } from "react-native";

export interface ModalProps {
  children: ReactNode;
  style?: ViewStyle;
  onClose?: () => void;
}

export interface ModalState {
  visible: boolean;
}
