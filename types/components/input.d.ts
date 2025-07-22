import { ReactNode } from "react";
import { TextInputProps } from "react-native";

export interface InputProps extends TextInputProps {
  error?: string;
  icon?: ReactNode;
  disabled?: boolean;
  label?: string;
  testID?: string;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  keyboardType?:
    | "default"
    | "email-address"
    | "numeric"
    | "phone-pad"
    | "number-pad";
  returnKeyType?: "done" | "go" | "next" | "search" | "send";
  onSubmitEditing?: () => void;
  onChangeText?: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}
