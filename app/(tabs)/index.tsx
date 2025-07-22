import { Gap } from "@/components";
import WalletCard from "@/components/screens/EWallet/WalletCard";
import WalletFinanceHistory from "@/components/screens/EWallet/WalletFinanceHistory";
import WalletHeader from "@/components/screens/EWallet/WalletHeader";
import { getProfile } from "@/services/authServices";
import { getMerchant } from "@/services/merchantServices";
import { getProducts } from "@/services/productServices";
import { getTransactions } from "@/services/transactionServices";
import { useAuthStore } from "@/stores/authStore";
import { colors, spacing } from "@/themes";
import { GlobalStyles } from "@/themes/common";
import { showToast } from "@/utils/showToast";
import { useFocusEffect } from "expo-router";
import React, { useCallback } from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const statusBarHeight = StatusBar.currentHeight;

const HomeScreen = () => {
  const { user, role } = useAuthStore();

  const fetchData = async () => {
    try {
      if (role === "merchant") {
        if (user?.id) {
          await Promise.all([getMerchant(user.id), getProducts()]);
        }
      } else if (role === "recipient") {
        await Promise.all([getProfile(), getTransactions(), getProducts()]);
      }
    } catch (error: any) {
      const message = error?.response?.data?.message ?? "Terjadi kesalahan";
      showToast("error", "Gagal", message);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (!role) return;
      fetchData();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [role])
  );

  return (
    <View style={styles.page}>
      <StatusBar translucent barStyle="dark-content" />
      <WalletHeader />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <WalletCard />
        <Gap vertical={8} />
        <WalletFinanceHistory />
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  page: {
    paddingTop: statusBarHeight || 50,
    backgroundColor: colors.base.white,
    ...GlobalStyles.flex,
  },
  container: {
    backgroundColor: colors.base.white,
  },
  contentContainer: {
    padding: spacing[6],
  },
});
