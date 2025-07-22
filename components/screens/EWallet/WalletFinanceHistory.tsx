import { Gap, Text } from "@/components";
import { useAuthStore } from "@/stores/authStore";
import { useMerchantStore } from "@/stores/merchantStore";
import { useTransactionStore } from "@/stores/transactionStore";
import { borderRadius, colors, spacing } from "@/themes";
import { GlobalStyles } from "@/themes/common";
import { Image } from "expo-image";
import React, { useCallback } from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const WalletFinanceHistory = () => {
  const { role } = useAuthStore();
  const { transactions } = useTransactionStore();
  const { merchant } = useMerchantStore();

  const data =
    role === "merchant" ? merchant?.transactions ?? [] : transactions;

  const renderTaskItem = ({ item }: any) => <TaskItem item={item} />;

  const renderEmptyState = useCallback(
    () => (
      <View style={[GlobalStyles.center, { paddingTop: "45%" }]}>
        <Text>Tidak ada transaksi</Text>
      </View>
    ),
    []
  );

  const TaskItem = ({ item }: any) => {
    const productName = item?.product?.name || item?.paymentMethod;
    const merchantName = item?.merchant?.name || "Toko";

    const label =
      role === "merchant"
        ? `${item.metadataRecipient?.name}`
        : `${merchantName}`;

    const tanggal = new Date(item?.date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const waktu = new Date(item?.date).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    return (
      <View style={styles.list}>
        <View style={[GlobalStyles.rowCenter, { flex: 1 }]}>
          <Image
            source={{
              uri: `https://api.dicebear.com/7.x/micah/svg?seed=${label}`,
            }}
            style={styles.profile}
          />
          <Gap horizontal={2} />
          <View style={{ flex: 1 }}>
            <Text
              type="medium"
              size="lg"
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {label}
            </Text>
            <Gap vertical={2} />
            <View style={[GlobalStyles.rowCenter, { gap: 4 }]}>
              <Text type="medium" size="sm" color="#9395A4">
                {tanggal}
              </Text>
              <View style={styles.dot} />
              <Text type="medium" size="sm" color="#9395A4">
                {waktu}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ alignItems: "flex-end" }}>
          <Text type="semibold" size="md">
            {item?.totalAmount
              ? new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                }).format(item.totalAmount)
              : "-"}
          </Text>
          <Text
            type="medium"
            size="sm"
            color="#9395A4"
            numberOfLines={2}
            style={{ maxWidth: 120, textAlign: "right" }}
          >
            {productName}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View>
      <View
        style={[GlobalStyles.rowCenter, { justifyContent: "space-between" }]}
      >
        <Text type="semibold" size="xl">
          Transaksi terakhir
        </Text>
        <TouchableOpacity activeOpacity={0.8}>
          <Text type="semibold" size="sm" color={colors.primary[800]}>
            Lihat semua
          </Text>
        </TouchableOpacity>
      </View>
      <Gap vertical={4} />
      <FlatList
        data={data}
        renderItem={renderTaskItem}
        scrollEnabled={false}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <Gap vertical={2} />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={10}
        removeClippedSubviews={Platform.OS === "android"}
      />
    </View>
  );
};

export default React.memo(WalletFinanceHistory);

const styles = StyleSheet.create({
  list: {
    justifyContent: "space-between",
    paddingVertical: spacing[3],
    ...GlobalStyles.rowCenter,
  },
  profile: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.rounded,
  },
  dot: {
    width: spacing[1],
    height: spacing[1],
    borderRadius: borderRadius.sm,
    backgroundColor: colors.neutral[90],
  },
});
