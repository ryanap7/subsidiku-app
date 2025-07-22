import { Gap, SafeAreaView, Text } from "@/components";
import { getRecipientByMerchant } from "@/services/recipientServices";
import { useMerchantStore } from "@/stores/merchantStore";
import { useRecipientStore } from "@/stores/recipientStore";
import { borderRadius, colors, spacing } from "@/themes";
import { GlobalStyles } from "@/themes/common";
import { showToast } from "@/utils/showToast";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useCallback, useEffect } from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const RecipientScreen = () => {
  const { merchant } = useMerchantStore();
  const { recipients } = useRecipientStore();

  const fetchData = async () => {
    try {
      await getRecipientByMerchant(merchant.id);
    } catch (error: any) {
      const message = error?.response?.data?.message ?? "Terjadi kesalahan";
      showToast("error", "Gagal", message);
    }
  };

  const renderItem = ({ item }: any) => <TaskItem item={item} />;

  const renderEmptyState = useCallback(
    () => (
      <View style={[GlobalStyles.center, { paddingTop: "45%" }]}>
        <Text>Tidak ada transaksi</Text>
      </View>
    ),
    []
  );

  const TaskItem = ({ item }: any) => {
    return (
      <View style={styles.list}>
        <View style={[GlobalStyles.rowCenter, { flex: 1 }]}>
          <Image
            source={{
              uri: `https://api.dicebear.com/7.x/micah/svg?seed=${item.name}`,
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
              {item.name}
            </Text>
            <Text size="sm" ellipsizeMode="tail">
              {item.nik}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView>
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.8} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>
        <Gap horizontal={4} />
        <Text type="semibold">Daftar Penerima Subsidi</Text>
      </View>
      <FlatList
        data={recipients}
        renderItem={renderItem}
        scrollEnabled={false}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <Gap vertical={2} />}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={10}
        removeClippedSubviews={Platform.OS === "android"}
      />
    </SafeAreaView>
  );
};

export default RecipientScreen;

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.base.white,
    padding: spacing[5],
    borderBottomWidth: 0.3,
    ...GlobalStyles.rowCenter,
  },
  container: {
    backgroundColor: colors.base.white,
    padding: spacing[5],
  },
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
});
