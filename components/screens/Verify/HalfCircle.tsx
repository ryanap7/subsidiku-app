import React from "react";
import { StyleSheet, View } from "react-native";
import { RADIUS } from "./Constants";

interface Props {
  color: string;
}

const HalfCircle = ({ color }: Props) => {
  return (
    <View
      style={[
        styles.halfCircle,
        {
          backgroundColor: color,
          borderTopLeftRadius: RADIUS,
          borderTopRightRadius: RADIUS,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  halfCircle: {
    width: RADIUS * 2,
    height: RADIUS,
    overflow: "hidden",
  },
});

export default HalfCircle;
