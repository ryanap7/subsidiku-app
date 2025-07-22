import {
  Button,
  Gap,
  Input,
  KeyboardAvoiding,
  SafeAreaView,
  Select,
  Text,
} from "@/components";
import { getRecipientById } from "@/services/recipientServices";
import { createTransaction } from "@/services/transactionService";
import { useMerchantStore } from "@/stores/merchantStore";
import { useProductStore } from "@/stores/productStore";
import { useRecipientStore } from "@/stores/recipientStore";
import { borderRadius, colors, spacing } from "@/themes";
import { GlobalStyles } from "@/themes/common";
import { parseKTPText } from "@/utils/ktpParser";
import { showToast } from "@/utils/showToast";
import { Ionicons } from "@expo/vector-icons";
import { useCameraPermissions } from "expo-camera";
import { Image } from "expo-image";
import {
  CameraType,
  launchCameraAsync,
  launchImageLibraryAsync,
  PermissionStatus,
  requestCameraPermissionsAsync,
  requestMediaLibraryPermissionsAsync,
} from "expo-image-picker";
import { router } from "expo-router";
import { extractTextFromImage, isSupported } from "expo-text-extractor";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const RedeemWithKTPScreen = () => {
  const { merchant: store } = useMerchantStore();
  const { recipient, setRecipient } = useRecipientStore();
  const { products } = useProductStore();

  const [imageUri, setImageUri] = useState<string>();
  const [cameraPermission, setCameraPermission] =
    useState<PermissionStatus | null>(null);
  const [galleryPermission, setGalleryPermission] =
    useState<PermissionStatus | null>(null);
  const [permission, requestPermission] = useCameraPermissions();

  const [result, setResult] = useState<null | {
    name: string;
    nationalId: string;
    quotaGas: number;
    quotaFertilizer: number;
  }>(null);

  const [form, setForm] = useState({
    type: "",
    amount: "",
    paymentMethod: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const validate = () => {
    const err: typeof errors = {};
    const amountNum = parseInt(form.amount || "0");

    if (!form.type) err.type = "Pilih jenis subsidi";
    if (!form.amount || isNaN(amountNum) || amountNum <= 0)
      err.amount = "Jumlah harus lebih dari 0";

    const maxQuota =
      form.type === "Pupuk"
        ? result?.quotaFertilizer ?? 0
        : result?.quotaGas ?? 0;

    if (amountNum > maxQuota) {
      err.amount = `Kuota tidak mencukupi. Maks: ${maxQuota}`;
    }

    return err;
  };

  const handleSubmit = async () => {
    const check = validate();
    setErrors(check);
    setSubmitted(true);

    if (Object.keys(check).length > 0) return;

    setIsSubmitting(true);

    try {
      if (!result) throw new Error("Data penerima belum tersedia.");

      const selectedProductName = form.type === "Gas" ? "Gas LPG" : "Pupuk";
      const qty = parseInt(form.amount || "0");
      const selectedProduct = recipient.subsidies.find(
        (s: any) =>
          s.product?.name?.toLowerCase() === selectedProductName.toLowerCase()
      );

      const { merchant, subsidies, ...cleanRecipient } = recipient;

      const total = selectedProduct.product.price * qty;

      if (!selectedProduct) throw new Error("Produk subsidi tidak ditemukan.");
      if (merchant.id !== store.id)
        throw new Error(
          "Pembelian hanya dapat dilakukan di store yang mendaftarkan Anda."
        );

      if (form.paymentMethod !== "Tunai") {
        if (recipient.balance < total) {
          throw new Error(
            `Saldo subsidi tidak mencukupi. Sisa saldo: Rp${recipient.balance.toLocaleString()}, total yang dibutuhkan: Rp${total.toLocaleString()}.`
          );
        }
      }

      const payload = {
        merchantId: store.id,
        recipientId: recipient.id,
        productId: selectedProduct.product.id,
        metadataRecipient: cleanRecipient,
        metadataProduct: selectedProduct.product,
        qty,
        basePrice: selectedProduct.product.basePrice,
        price: selectedProduct.product.price,
        totalAmount: total,
        paymentMethod: form.paymentMethod,
      };

      await createTransaction(payload);

      setRecipient(null);
      router.push("/(merchant)/verify");
    } catch (error: any) {
      Alert.alert("Gagal", error?.message ?? "Terjadi kesalahan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const processImage = async (path?: string) => {
    if (!path) return;

    setImageUri(path);

    if (isSupported) {
      try {
        const extractedTexts = await extractTextFromImage(path);

        const parsed = parseKTPText(extractedTexts);

        return parsed.nationalId;
      } catch (error) {
        if (error instanceof Error)
          showToast("error", "Text Extraction Error", error?.message);
      }
    } else {
      showToast(
        "error",
        "Not Supported",
        "Text extraction is not supported on this device"
      );
    }
  };

  const handleImagePick = async () => {
    try {
      if (galleryPermission !== PermissionStatus.GRANTED) {
        const { status } = await requestMediaLibraryPermissionsAsync();
        setGalleryPermission(status);
        if (status !== PermissionStatus.GRANTED) return;
      }

      const result = await launchImageLibraryAsync({
        mediaTypes: ["images"],
      });

      if (!result.canceled) {
        const path = result.assets?.at(0)?.uri;
        const nationalId = await processImage(path);

        if (nationalId) {
          const response = await getRecipientById(nationalId.toString());

          const { data } = response;

          const quotaGas =
            data.subsidies.find(
              (s: any) => s.product?.name?.toLowerCase() === "gas lpg"
            )?.remainingQuota ?? 0;

          const quotaFertilizer =
            data.subsidies.find(
              (s: any) => s.product?.name?.toLowerCase() === "pupuk"
            )?.remainingQuota ?? 0;

          if (response) {
            setResult({
              nationalId: data.nik,
              name: data.name,
              quotaFertilizer,
              quotaGas,
            });
          }
        } else {
          showToast("error", "Gagal", "KTP tidak valid");
        }
      }
    } catch (error) {
      if (error instanceof Error)
        showToast("error", "Image Pick Error", error.message);
    }
  };

  const handleCameraCapture = async () => {
    try {
      if (cameraPermission !== PermissionStatus.GRANTED) {
        const { status } = await requestCameraPermissionsAsync();
        setCameraPermission(status);
        if (status !== PermissionStatus.GRANTED) return;
      }

      const result = await launchCameraAsync({
        mediaTypes: ["images"],
        cameraType: CameraType.back,
      });

      if (!result.canceled) {
        const path = result.assets?.at(0)?.uri;
        const nationalId = "3171234567890123";

        setImageUri(path);

        if (nationalId) {
          const response = await getRecipientById(nationalId);

          const { data } = response;

          const quotaGas =
            data.subsidies.find(
              (s: any) => s.product?.name?.toLowerCase() === "gas lpg"
            )?.remainingQuota ?? 0;

          const quotaFertilizer =
            data.subsidies.find(
              (s: any) => s.product?.name?.toLowerCase() === "pupuk"
            )?.remainingQuota ?? 0;

          if (response) {
            setResult({
              nationalId: data.nik,
              name: data.name,
              quotaFertilizer,
              quotaGas,
            });
          }
        }
      }
    } catch (error) {
      if (error instanceof Error)
        showToast("error", "Camera Error", error.message);
    }
  };

  useEffect(() => {
    if (permission?.status !== "granted") {
      requestPermission();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const PRICES = products.reduce((acc, item) => {
    const key = item.name.toLowerCase().includes("gas") ? "Gas" : "Pupuk";
    acc[key] = item.price;
    return acc;
  }, {} as Record<"Gas" | "Pupuk", number>);

  const selectedPrice = PRICES[form.type as keyof typeof PRICES] ?? 0;
  const total = selectedPrice * parseInt(form.amount || "0");
  const maxQuota =
    form.type === "Pupuk" ? result?.quotaFertilizer : result?.quotaGas;

  return (
    <SafeAreaView>
      <KeyboardAvoiding>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} />
          </TouchableOpacity>
        </View>

        <ScrollView>
          <View style={styles.container}>
            <Text type="semibold" size="xl">
              Scan KTP Penerima
            </Text>
            <Gap vertical={4} />

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.imagePicker}
              onPress={handleCameraCapture}
            >
              {imageUri ? (
                <Image
                  source={{ uri: imageUri }}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: borderRadius["2xl"],
                  }}
                  contentFit="cover"
                />
              ) : (
                <>
                  <Ionicons name="camera-outline" size={46} />
                  <Gap vertical={2} />
                  <Text type="regular" size="md">
                    Unggah Foto KTP
                  </Text>
                </>
              )}
            </TouchableOpacity>

            {result && (
              <>
                <Gap vertical={6} />
                <View style={styles.card}>
                  <Text type="semibold" size="md">
                    Nama: {result?.name}
                  </Text>
                  <Text size="sm" color={colors.neutral[70]}>
                    NIK: {result?.nationalId}
                  </Text>
                </View>

                <Gap vertical={6} />
                <Select
                  placeholder="Jenis Subsidi"
                  value={form.type}
                  onChange={(v) => {
                    handleChange("amount", "");
                    handleChange("type", v.value);
                  }}
                  options={[
                    { label: "Pupuk", value: "Pupuk" },
                    { label: "Gas LPG", value: "Gas" },
                  ]}
                  error={submitted ? errors.type : undefined}
                />

                <Gap vertical={4} />
                <Input
                  placeholder="Jumlah"
                  keyboardType="numeric"
                  value={form.amount}
                  onChangeText={(v) => handleChange("amount", v)}
                  error={submitted ? errors.amount : undefined}
                />

                <Gap vertical={4} />
                <Input
                  value={`Rp ${total.toLocaleString("id-ID")}`}
                  editable={false}
                  disabled
                />

                <Gap vertical={4} />
                <Select
                  placeholder="Jenis Pembayaran"
                  value={form.paymentMethod}
                  onChange={(v) => handleChange("paymentMethod", v.value)}
                  options={[
                    { label: "Tunai", value: "Tunai" },
                    { label: "Saldo", value: "BLT" },
                  ]}
                  error={submitted ? errors.paymentMethod : undefined}
                />

                {form.type && (
                  <>
                    <Gap vertical={2} />
                    <Text size="sm" color={colors.neutral[70]}>
                      Harga per {form.type === "Pupuk" ? "kg" : "tabung"}: Rp{" "}
                      {selectedPrice.toLocaleString("id-ID")}
                    </Text>
                    <Text size="sm" color={colors.neutral[70]}>
                      Sisa kuota: {maxQuota}{" "}
                      {form.type === "Pupuk" ? "kg" : "tabung"}
                    </Text>
                  </>
                )}

                <Gap vertical={8} />
                <Button
                  title="Konfirmasi Penebusan"
                  loading={isSubmitting}
                  onPress={handleSubmit}
                />
                <Gap vertical={2} />
                <Button
                  title="Scan Lagi"
                  variant="secondary"
                  onPress={() => {
                    setResult(null);
                    setImageUri("");
                    setRecipient(null);
                    setForm({ type: "", amount: "", paymentMethod: "" });
                    setErrors({});
                    setSubmitted(false);
                  }}
                />
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoiding>
    </SafeAreaView>
  );
};

export default RedeemWithKTPScreen;

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[4],
  },
  container: {
    paddingHorizontal: spacing[6],
    paddingBottom: spacing[10],
  },
  scannerBox: {
    marginTop: spacing[4],
    height: 300,
    borderRadius: borderRadius.md,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: colors.primary[500],
  },
  card: {
    padding: spacing[4],
    backgroundColor: colors.base.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.neutral[20],
  },
  imagePicker: {
    width: "100%",
    aspectRatio: 3 / 2,
    backgroundColor: colors.base.white,
    borderRadius: borderRadius["2xl"],
    overflow: "hidden",
    ...GlobalStyles.center,
  },
});
