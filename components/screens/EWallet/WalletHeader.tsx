import { Gap, Text } from "@/components";
import { useAuthStore } from "@/stores/authStore";
import { borderRadius, colors, spacing } from "@/themes";
import { GlobalStyles } from "@/themes/common";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

const WalletHeader = () => {
  const { user, role } = useAuthStore();

  return (
    <View style={styles.header}>
      <View style={GlobalStyles.rowCenter}>
        <TouchableOpacity activeOpacity={0.8}>
          <Image
            source={{
              uri: `https://api.dicebear.com/7.x/micah/svg?seed=${user?.name}`,
            }}
            style={styles.profile}
          />
        </TouchableOpacity>
        <Gap horizontal={3} />
        <View>
          <Text type="medium">{user?.name}</Text>
          <Text size="sm" color={colors.neutral[70]}>
            {role === "recipient" ? "Penerima Subsidi" : "Merchant"}
          </Text>
        </View>
      </View>
      <View style={styles.iconWrapper}>
        <Ionicons name="notifications" size={20} color={colors.neutral[90]} />
      </View>
    </View>
  );
};

export default React.memo(WalletHeader);

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.base.white,
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[4],
    borderBottomWidth: 0.3,
    borderColor: colors.neutral[20],
    justifyContent: "space-between",
    ...GlobalStyles.rowCenter,
  },
  profile: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.rounded,
  },
  iconWrapper: {
    backgroundColor: colors.base.background,
    width: 40,
    height: 40,
    borderRadius: borderRadius.rounded,
    ...GlobalStyles.center,
  },
});
