import { Gap, Text } from "@/components";
import { useAuthStore } from "@/stores/authStore";
import { useMerchantStore } from "@/stores/merchantStore";
import { borderRadius, colors, spacing } from "@/themes";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

const WalletCard = () => {
  const { user, role }: any = useAuthStore();
  const { merchant } = useMerchantStore();

  const redirectToCashAdvance = useCallback(() => {}, []);
  const redirectToTransfer = useCallback(() => {}, []);
  const redirectToWithdrawal = useCallback(() => {}, []);

  const balance =
    role === "merchant"
      ? merchant?.balance
      : role === "recipient"
      ? user?.balance
      : null;

  const formattedBalance = balance
    ? new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(balance)
    : "-";

  return (
    <LinearGradient
      colors={["#7F5AF0", "#2CB1FF"]}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={styles.card}
    >
      <View style={styles.balanceSection}>
        <Text size="sm" color={colors.neutral[20]}>
          Saldo
        </Text>
        <Gap vertical={2} />
        <Text type="semibold" size="4xl" color={colors.base.white}>
          {formattedBalance}
        </Text>
      </View>
      <Gap vertical={6} />
      <View style={styles.actionRow}>
        {[
          {
            icon: "arrow-down-circle-outline",
            label: "Topup",
            onPress: redirectToCashAdvance,
          },
          {
            icon: "arrow-up-circle-outline",
            label: "Transfer",
            onPress: redirectToWithdrawal,
          },
          {
            icon: "newspaper-outline",
            label: "Riwayat",
            onPress: redirectToTransfer,
          },
        ].map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.actionItem}
            onPress={item.onPress}
            activeOpacity={0.8}
          >
            <View style={styles.iconContainer}>
              <Ionicons
                name={item.icon as any}
                size={24}
                color={colors.base.white}
              />
            </View>
            <Gap vertical={4} />
            <Text size="xs" type="medium" color={colors.base.white}>
              {item.label.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </LinearGradient>
  );
};

export default React.memo(WalletCard);

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius["2xl"],
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[6],
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  balanceSection: {
    alignItems: "center",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  actionItem: {
    alignItems: "center",
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
});
