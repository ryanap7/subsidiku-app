import { ReactNode } from "react";
import { ViewStyle } from "react-native";

export interface ContainerProps {
  children: ReactNode;
  statusBarStyle?: "light-content" | "dark-content";
  style?: ViewStyle;
}
