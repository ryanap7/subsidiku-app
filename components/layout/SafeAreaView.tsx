import { colors } from "@/themes";
import { GlobalStyles } from "@/themes/common";
import { SafeAreaViewProps } from "@/types";
import React, { FC } from "react";
import { StatusBar, StyleSheet, View } from "react-native";

const statusBarHeight = StatusBar.currentHeight;

const SafeAreaView: FC<SafeAreaViewProps> = ({ children }) => {
  return <View style={styles.container}>{children}</View>;
};

export default SafeAreaView;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.base.background,
    paddingTop: statusBarHeight ?? 50,
    ...GlobalStyles.flex,
  },
});
