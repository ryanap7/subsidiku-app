import { BottomSheet, Button, Gap, Input, Select, Text } from "@/components";
import { getRecipientById } from "@/services/recipientServices";
import { createTransaction } from "@/services/transactionService";
import { useMerchantStore } from "@/stores/merchantStore";
import { useProductStore } from "@/stores/productStore";
import { useRecipientStore } from "@/stores/recipientStore";
import { borderRadius, colors, spacing } from "@/themes";
import { GlobalStyles } from "@/themes/common";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useCallback, useRef, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TapKTPScreen = () => {
  const ref = useRef<BottomSheet | null>(null);

  const { products } = useProductStore();
  const { merchant: store } = useMerchantStore();
  const { recipient, setRecipient } = useRecipientStore();

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

  const handleSearch = useCallback(async () => {
    setResult(null);
    setForm((prev) => ({
      ...prev,
      amount: "",
      paymentMethod: "",
      type: "",
    }));
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const response = await getRecipientById("3214100312890002");

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
    } catch (error) {
      console.log(error);
    }
  }, []);

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
    <>
      <SafeAreaView>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} />
          </TouchableOpacity>
        </View>

        <ScrollView>
          <View style={styles.container}>
            <Text type="semibold" size="xl">
              Tap KTP
            </Text>
            <Gap vertical={4} />

            <Button
              title="Mulai Tap KTP"
              onPress={() => {
                ref.current?.show();
                setTimeout(() => {
                  handleSearch();
                  ref.current?.hide();
                }, 5000);
              }}
            />

            {result ? (
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
              </>
            ) : null}
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* BottomSheet */}
      <BottomSheet ref={ref} type="content">
        <View style={GlobalStyles.center}>
          <Text type="semibold" size="2xl">
            Ready to Scan
          </Text>
          <Gap vertical={2} />
          <Text size="md">Tempelkan KTP ke area NFC Ponsel</Text>
          <Gap vertical={4} />
          <LottieView
            source={require("@/assets/animations/scan.json")}
            autoPlay
            loop
            style={styles.illustration}
          />
        </View>
      </BottomSheet>
    </>
  );
};

export default TapKTPScreen;

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[4],
  },
  container: {
    paddingHorizontal: spacing[6],
    paddingBottom: spacing[10],
  },
  illustration: {
    width: 200,
    height: 200,
  },
  card: {
    padding: spacing[4],
    backgroundColor: colors.base.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.neutral[20],
  },
});
