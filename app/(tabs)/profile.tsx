import { Button, Gap, SafeAreaView, Text } from "@/components";
import { useAuthStore } from "@/stores/authStore";
import { useMerchantStore } from "@/stores/merchantStore";
import { borderRadius, colors, spacing } from "@/themes";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const ProfileScreen = () => {
  const { user, role }: any = useAuthStore();
  const { merchant } = useMerchantStore();

  const handleLogout = () => {
    Alert.alert("Keluar", "Yakin ingin keluar dari akun Anda?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Keluar",
        style: "destructive",
        onPress: () => {
          useAuthStore.getState().logout();
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  const handleQRCode = () => {
    router.push("/qr");
  };

  const handleRecipients = () => {
    router.push("/recipients");
  };

  if (!user || !role) {
    return (
      <SafeAreaView>
        <View style={styles.container}>
          <Text type="semibold" size="lg">
            Sedang memuat data pengguna...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Ionicons
              name="person-circle"
              size={72}
              color={colors.primary[500]}
            />
          </View>
          <Gap vertical={2} />
          <Text type="semibold" size="xl">
            {user?.name || "-"}
          </Text>
          <Text size="sm" color={colors.neutral[70]}>
            {user?.nik || "-"}
          </Text>
        </View>

        <Gap vertical={8} />

        {/* Informasi User */}
        <View style={styles.card}>
          <Info
            label="Alamat"
            value={
              user?.address || user?.district
                ? `${user?.address ?? merchant.address}, ${
                    user?.district ?? merchant.merchant
                  }`
                : "-"
            }
          />

          {role === "recipient" && (
            <>
              <Info
                label="Penghasilan"
                value={
                  user?.income
                    ? new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                      }).format(user.income)
                    : "-"
                }
              />
              <Info
                label="Kepemilikan Rumah"
                value={user?.homeOwnership || "-"}
              />
              <Info
                label="Luas Lahan"
                value={
                  user?.landArea !== undefined ? `${user.landArea} m²` : "-"
                }
              />
            </>
          )}

          {role === "merchant" && (
            <>
              <Info label="Kode Toko" value={merchant?.code || "-"} />
              <Info label="Pemilik" value={merchant?.ownerName || "-"} />
              <Info label="No. Telepon" value={merchant?.phone || "-"} />
              <Info
                label="Jumlah Penerima"
                value={`${merchant?._count?.recipients ?? 0} orang`}
              />
              <Info
                label="Jumlah Transaksi"
                value={`${merchant?._count?.transactions ?? 0} kali`}
              />
            </>
          )}
        </View>

        <Gap vertical={8} />

        {/* Menu QR Code */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.menuCard}
          onPress={handleQRCode}
        >
          <Ionicons
            name="qr-code-outline"
            size={24}
            color={colors.primary[500]}
          />
          <Gap horizontal={3} />
          <Text type="medium" size="md">
            QR Code Saya
          </Text>
        </TouchableOpacity>

        <Gap vertical={4} />

        {/* Daftar Penerima khusus merchant */}
        {role === "merchant" && (
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.menuCard}
            onPress={handleRecipients}
          >
            <Ionicons name="people" size={24} color={colors.primary[500]} />
            <Gap horizontal={3} />
            <Text type="medium" size="md">
              Daftar Penerima Subsidi
            </Text>
          </TouchableOpacity>
        )}

        <Gap vertical={8} />
        <Button title="Keluar" variant="secondary" onPress={handleLogout} />
        <Gap vertical={10} />
        <Gap vertical={10} />
      </ScrollView>
    </SafeAreaView>
  );
};

const Info = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.infoRow}>
    <Text size="sm" color={colors.neutral[70]}>
      {label}
    </Text>
    <Gap vertical={1} />
    <Text type="medium" size="md">
      {value}
    </Text>
    <Gap vertical={3} />
  </View>
);

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing[6],
    backgroundColor: colors.base.background,
  },
  profileHeader: {
    alignItems: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary[100],
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    marginTop: spacing[4],
    backgroundColor: colors.base.white,
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  infoRow: {
    marginBottom: spacing[1],
  },
  menuCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.base.white,
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
});
