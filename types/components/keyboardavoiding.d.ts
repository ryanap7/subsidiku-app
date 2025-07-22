import { ReactNode } from "react";
import { StyleProp, ViewStyle } from "react-native";

export interface KeyboardAvoidingProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}
