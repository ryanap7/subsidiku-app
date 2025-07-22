import { colors, fontSize, typography } from "@/themes";
import { TextProps } from "@/types";
import React, { FC, memo } from "react";
import { Text as RNText } from "react-native";

const getLineHeight = (size: number, ratio = 1.4) =>
  parseFloat((size * ratio).toFixed(2));

const Text: FC<TextProps> = ({
  children,
  type = "regular",
  size = "base",
  color = colors.neutral[90],
  style,
  ...rest
}) => {
  const selectedFontSize = fontSize[size];
  const lineHeight = getLineHeight(selectedFontSize);

  return (
    <RNText
      {...rest}
      style={[
        {
          fontSize: selectedFontSize,
          lineHeight,
          fontFamily: typography[type],
          color,
        },
        ...(Array.isArray(style) ? style : [style]),
      ]}
    >
      {children}
    </RNText>
  );
};

export default memo(Text);
