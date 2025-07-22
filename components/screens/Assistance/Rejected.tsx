import { Gap, Text } from "@/components";
import { colors, spacing } from "@/themes";
import { GlobalStyles } from "@/themes/common";
import LottieView from "lottie-react-native";
import React from "react";
import { StyleSheet, View } from "react-native";

const Rejected = () => {
  return (
    <View
      style={[
        GlobalStyles.flex,
        GlobalStyles.center,
        { backgroundColor: colors.base.white },
      ]}
    >
      <LottieView
        source={require("@/assets/animations/rejected.json")}
        autoPlay
        loop
        style={styles.illustration}
      />
      <Gap vertical={5} />
      <Text
        type="semibold"
        size="base"
        style={[GlobalStyles.center, { paddingHorizontal: spacing[6] }]}
      >
        Maaf, Anda belum memenuhi syarat untuk menerima subsidi saat ini.
      </Text>
    </View>
  );
};

export default Rejected;

const styles = StyleSheet.create({
  illustration: {
    width: 200,
    height: 200,
  },
});
