import { Button, Gap, SafeAreaView, Text } from "@/components";
import { useAuthStore } from "@/stores/authStore";
import { borderRadius, colors, spacing } from "@/themes";
import { Subsidy } from "@/types/stores/auth";
import { router } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import LatestHistory from "./LatestHistory";

const User = () => {
  const { user }: any = useAuthStore();

  const subsidies = user?.subsidies ?? [];

  const gasQuota = subsidies.find(
    (item: Subsidy) => item.product.name.toLowerCase() === "gas lpg"
  );

  const fertilizerQuota = subsidies.find(
    (item: Subsidy) => item.product.name.toLowerCase() === "pupuk"
  );

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.container}>
        <Text type="semibold" size="2xl">
          Subsidi
        </Text>
        <Gap vertical={4} />

        {/* Counting */}
        <View style={styles.row}>
          <View
            style={[
              styles.countWrapper,
              {
                borderColor: colors.primary[500],
                backgroundColor: colors.primary[50],
              },
            ]}
          >
            <Text type="medium" size="md">
              Pupuk
            </Text>
            <Text type="semibold" size="2xl">
              {fertilizerQuota?.remainingQuota ?? 0} Kg
            </Text>
          </View>
          <View
            style={[
              styles.countWrapper,
              {
                borderColor: colors.neutral[50],
                backgroundColor: colors.neutral[0],
              },
            ]}
          >
            <Text type="medium" size="md">
              LPG
            </Text>
            <Text type="semibold" size="2xl">
              {gasQuota?.remainingQuota ?? 0}
            </Text>
          </View>
        </View>
        <Gap vertical={6} />

        {/* Nearby Merchant  */}
        <View style={styles.card}>
          <Text type="semibold" size="lg" style={{ marginBottom: spacing[2] }}>
            Daftar Merchant Terdekat
          </Text>
          <Text size="sm" color={colors.neutral[70]}>
            Temukan merchant terdaftar di sekitar lokasi Anda untuk menggunakan
            subsidi.
          </Text>
          <Gap vertical={4} />
          <Button
            variant="secondary"
            title="Lihat Merchant"
            onPress={() => router.push("/(user)/nearby-merchant")}
          />
        </View>
        <Gap vertical={6} />

        {/* History  */}
        <LatestHistory />
        <Gap vertical={6} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default User;

const styles = StyleSheet.create({
  container: {
    padding: spacing[5],
    paddingBottom: 80,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing[4],
  },
  countWrapper: {
    flex: 1,
    alignItems: "center",
    paddingVertical: spacing[5],
    borderWidth: 1,
    borderRadius: borderRadius.lg,
  },
  card: {
    padding: spacing[4],
    backgroundColor: colors.base.white,
    borderRadius: borderRadius.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
