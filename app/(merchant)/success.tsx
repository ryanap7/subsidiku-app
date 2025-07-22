import { Button, Gap, SafeAreaView, Text } from "@/components";
import { colors, spacing } from "@/themes";
import { GlobalStyles } from "@/themes/common";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

const MerchantSuccessScreen = () => {
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View style={styles.iconWrapper}>
          <Ionicons
            name="checkmark-circle"
            size={64}
            color={colors.success[500]}
          />
        </View>
        <Gap vertical={4} />
        <Text type="semibold" size="2xl" style={GlobalStyles.center}>
          Transaksi Berhasil
        </Text>
        <Gap vertical={2} />
        <Text size="sm" color={colors.neutral[70]} style={GlobalStyles.center}>
          Penebusan subsidi berhasil. Barang dapat langsung dibawa oleh
          penerima.
        </Text>
        <Gap vertical={6} />
        <View>
          <Button
            title="Kembali ke Beranda"
            onPress={() => router.push("/(tabs)")}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MerchantSuccessScreen;

const styles = StyleSheet.create({
  container: {
    padding: spacing[6],
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  iconWrapper: {
    marginBottom: spacing[4],
  },
});
