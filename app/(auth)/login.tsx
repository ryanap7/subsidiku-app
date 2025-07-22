import ILRobot from "@/assets/images/ILRobot.svg";
import {
  Button,
  Gap,
  Input,
  KeyboardAvoiding,
  SafeAreaView,
  Select,
  Text,
} from "@/components";
import { loginMerchant, loginRecipient } from "@/services/authServices";
import { colors, spacing } from "@/themes";
import { GlobalStyles } from "@/themes/common";
import { LoginForm } from "@/types/stores/auth";
import { showToast } from "@/utils/showToast";
import { router } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

const LoginScreen = () => {
  const [loginAs, setLoginAs] = useState<"recipient" | "merchant">("recipient");
  const [form, setForm] = useState<LoginForm>({
    nik: "",
    password: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const validate = useCallback((values: typeof form) => {
    const newErrors: typeof errors = {};

    if (!values.nik || values.nik.length < 8 || !/^\d+$/.test(values.nik)) {
      newErrors.nik = "NIK harus minimal 8 digit angka";
    }

    if (!values.password || values.password.length < 6) {
      newErrors.password = "Password minimal 6 karakter";
    }

    return newErrors;
  }, []);

  const handleLogin = async () => {
    const validation = validate(form);
    setErrors(validation);
    setIsSubmitted(true);

    if (Object.keys(validation).length > 0) return;

    try {
      setIsSubmitting(true);
      const res: any =
        loginAs === "recipient"
          ? await loginRecipient(form)
          : await loginMerchant(form);

      const user = loginAs === "recipient" ? res?.recipient : res?.merchant;

      showToast("success", "Berhasil Login", `Selamat datang, ${user.name}`);
      router.replace("/(tabs)");
    } catch (error: any) {
      showToast(
        "error",
        "Login Gagal",
        error?.response?.data?.message ?? "Terjadi kesalahan"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValid = useMemo(() => {
    return Object.keys(validate(form)).length === 0;
  }, [form, validate]);

  return (
    <SafeAreaView>
      <ScrollView>
        <KeyboardAvoiding>
          <View style={styles.container}>
            <View style={[styles.illustrationWrapper, GlobalStyles.center]}>
              <ILRobot />
            </View>

            <Gap vertical={6} />
            <Text type="semibold" size="2xl" style={GlobalStyles.center}>
              Masuk
            </Text>
            <Gap vertical={8} />

            <Select
              placeholder="Jenis Kelamin"
              value={loginAs}
              onChange={(v) => setLoginAs(v.value as "recipient" | "merchant")}
              options={[
                { label: "Penerima", value: "recipient" },
                { label: "Merchant", value: "merchant" },
              ]}
            />
            <Gap vertical={4} />
            <Input
              placeholder="Masukkan NIK"
              value={form.nik}
              onChangeText={(val) => handleChange("nik", val)}
              keyboardType="numeric"
              error={isSubmitted ? errors.nik : undefined}
            />
            <Gap vertical={4} />
            <Input
              placeholder="Masukkan kata sandi"
              value={form.password}
              onChangeText={(val) => handleChange("password", val)}
              secureTextEntry
              error={isSubmitted ? errors.password : undefined}
            />
            <Gap vertical={8} />
            <Button
              title="Masuk"
              loading={isSubmitting}
              onPress={handleLogin}
              disabled={!isValid}
            />
          </View>
          <Gap vertical={10} />
          <Gap vertical={10} />
          <View style={[GlobalStyles.rowCenter, GlobalStyles.center]}>
            <Text>Belum punya akun? </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push("/(auth)/register")}
            >
              <Text type="medium" color={colors.primary[500]}>
                Daftar
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoiding>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing[6],
    paddingTop: spacing[6],
  },
  illustrationWrapper: {
    paddingTop: spacing[3],
  },
});
