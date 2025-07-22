import { Platform, StyleSheet } from "react-native";
import { borderRadius, colors } from ".";

export const GlobalStyles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
  },
  rowCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
  rounded: {
    borderRadius: borderRadius.rounded,
  },
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: colors.neutral[90],
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
});
