import { Button, Gap, SafeAreaView, Text } from "@/components";
import { useMerchantStore } from "@/stores/merchantStore";
import { borderRadius, colors, spacing } from "@/themes";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import LatestRedeemHistory from "./LatestRedeemHistory";

const Merchant = () => {
  const { merchant } = useMerchantStore();

  const fertilizerProduct = merchant?.products?.find(
    (p: any) => p?.product?.name?.toLowerCase() === "pupuk"
  );

  const gasProduct = merchant?.products?.find(
    (p: any) => p?.product?.name?.toLowerCase() === "gas lpg"
  );

  const fertilizerStock = fertilizerProduct?.stock ?? 0;
  const gasStock = gasProduct?.stock ?? 0;

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text type="semibold" size="2xl">
          Panel Merchant
        </Text>
        <Gap vertical={4} />

        {/* Stock  */}
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
              Stok Pupuk
            </Text>
            <Text type="semibold" size="2xl">
              {fertilizerStock} Kg
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
              Stok LPG
            </Text>
            <Text type="semibold" size="2xl">
              {gasStock}
            </Text>
          </View>
        </View>

        <Gap vertical={6} />

        {/* Tombol Aksi */}
        <Text size="sm" color={colors.neutral[70]}>
          Gunakan fitur berikut untuk membantu pengguna menebus atau mengajukan
          subsidi.
        </Text>
        <Gap vertical={3} />
        <Button
          variant="secondary"
          title="Transaksi Subsidi"
          onPress={() => {
            router.push("/(merchant)/transactions");
          }}
        />
        <Gap vertical={3} />
        <Button
          variant="secondary"
          title="Bantu Ajukan Subsidi"
          onPress={() => {
            router.push("/(merchant)/user-request");
          }}
        />
        <Gap vertical={6} />

        {/* History  */}
        <LatestRedeemHistory />
      </View>
    </SafeAreaView>
  );
};

export default Merchant;

const styles = StyleSheet.create({
  container: {
    padding: spacing[5],
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
