import { spacing } from "@/themes";
import { GapProps } from "@/types";
import React, { FC, memo } from "react";
import { View } from "react-native";

const Gap: FC<GapProps> = ({ vertical, horizontal }) => {
  return (
    <View
      style={{
        height: vertical ? spacing[vertical] : 0,
        width: horizontal ? spacing[horizontal] : 0,
      }}
    />
  );
};

export default memo(Gap);
