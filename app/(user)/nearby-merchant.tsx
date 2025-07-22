import { Loader, SafeAreaView } from "@/components";
import { getMerchants } from "@/services/merchantServices";
import { useMerchantStore } from "@/stores/merchantStore";
import { spacing } from "@/themes";
import { GlobalStyles } from "@/themes/common";
import { showToast } from "@/utils/showToast";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { GoogleMaps } from "expo-maps";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

const NearbyMerchant = () => {
  const { merchants } = useMerchantStore();

  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const fetchLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      showToast("error", "Lokasi", "Izin lokasi ditolak");
      return;
    }

    const loc = await Location.getCurrentPositionAsync({});
    setLocation({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    });
  };

  const fetchData = useCallback(async () => {
    try {
      await Promise.all([getMerchants(), fetchLocation()]);
    } catch (error: any) {
      const message = error?.response?.data?.message ?? "Terjadi kesalahan";
      showToast("error", "Gagal", message);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (!merchants || !location) {
    return (
      <View style={[GlobalStyles.flex, GlobalStyles.center]}>
        <Loader />
      </View>
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
        <GoogleMaps.View
          userLocation={{
            coordinates: {
              latitude: location.latitude,
              longitude: location.longitude,
            },
            followUserLocation: true,
          }}
          style={styles.map}
          cameraPosition={{
            coordinates: {
              latitude: location.latitude,
              longitude: location.longitude,
            },
            zoom: 16,
          }}
          markers={merchants.map((merchant: any) => ({
            title: merchant.name,
            coordinates: {
              latitude: parseFloat(merchant.lat),
              longitude: parseFloat(merchant.lng),
            },
          }))}
        />
      </View>
    </SafeAreaView>
  );
};

export default NearbyMerchant;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[4],
  },
  map: {
    flex: 1,
  },
});
