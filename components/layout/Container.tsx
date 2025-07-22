import { GlobalStyles } from "@/themes/common";
import { ContainerProps } from "@/types";
import React, { FC, memo } from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Container: FC<ContainerProps> = ({
  children,
  statusBarStyle = "dark-content",
  style,
}) => {
  return (
    <SafeAreaView style={[styles.safeArea, style]} edges={["left", "right"]}>
      <StatusBar translucent barStyle={statusBarStyle} />
      <View style={styles.contentWrapper}>{children}</View>
    </SafeAreaView>
  );
};

export default memo(Container);

const styles = StyleSheet.create({
  safeArea: {
    ...GlobalStyles.flex,
  },
  contentWrapper: {
    flexGrow: 1,
  },
});
