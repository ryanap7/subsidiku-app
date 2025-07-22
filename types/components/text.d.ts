import { ReactNode } from "react";
import { TextProps as RNTextProps, TextStyle } from "react-native";
import { FontSizeKey, TypographyKey } from "../theme";

export interface TextProps extends RNTextProps {
  children: ReactNode;
  type?: TypographyKey;
  size?: FontSizeKey;
  color?: string;
  style?: TextStyle | TextStyle[];
}
