import { Gap, SafeAreaView, Text } from "@/components";
import { useAuthStore } from "@/stores/authStore";
import { colors, spacing } from "@/themes";
import { GlobalStyles } from "@/themes/common";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import QRCode from "react-native-qrcode-svg";

const maskNIK = (nik: string) => {
  if (nik.length < 10) return nik;
  return nik.slice(0, 6) + "******" + nik.slice(-4);
};

const QRCodeScreen = () => {
  const { user, role }: any = useAuthStore();

  if (role !== "recipient") {
    return (
      <SafeAreaView>
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={0.8} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} />
          </TouchableOpacity>
        </View>
        <View style={[styles.container, GlobalStyles.center]}>
          <Text type="semibold" size="xl" style={{ textAlign: "center" }}>
            QR Code hanya tersedia untuk penerima subsidi.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.8} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <Text type="semibold" size="xl">
          QR Code Subsidi
        </Text>
        <Gap vertical={2} />
        <Text size="sm" color={colors.neutral[70]}>
          Bawa QR code ini ke Merchant untuk menebus subsidi Anda.
        </Text>
        <Gap vertical={10} />
        <View style={styles.qrContainer}>
          <View style={styles.qrBox}>
            <QRCode
              value={user.nik?.toString()}
              size={250}
              backgroundColor="white"
              color="black"
            />
          </View>
        </View>
        <Gap vertical={6} />
        {user.nik && (
          <Text type="medium" size="md" color={colors.neutral[70]}>
            NIK: {maskNIK(user.nik)}
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default QRCodeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing[6],
    alignItems: "center",
    backgroundColor: colors.base.white,
  },
  header: {
    backgroundColor: colors.base.white,
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[4],
  },
  qrContainer: {
    ...GlobalStyles.center,
  },
  qrBox: {
    width: 300,
    height: 300,
    borderRadius: 16,
    backgroundColor: colors.base.white,
    ...GlobalStyles.center,
    ...GlobalStyles.shadow,
  },
  qrText: {
    color: colors.neutral[50],
  },
});
