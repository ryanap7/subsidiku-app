import { ReactNode } from "react";
import { TouchableOpacityProps, ViewStyle } from "react-native";

export type ButtonVariant = "primary" | "secondary" | "tertiary";

export interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
  icon?: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}
