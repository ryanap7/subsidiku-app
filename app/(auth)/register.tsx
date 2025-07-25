import ILRobot from "@/assets/images/ILRobot.svg";
import {
  Button,
  DatePicker,
  Gap,
  Input,
  KeyboardAvoiding,
  SafeAreaView,
  Select,
  Text,
} from "@/components";
import { DefaultForm } from "@/constants/auth";
import { register } from "@/services/authServices";
import { getProducts } from "@/services/productServices";
import { useProductStore } from "@/stores/productStore";
import { borderRadius, colors, spacing } from "@/themes";
import { GlobalStyles } from "@/themes/common";
import { parseKTPText } from "@/utils/ktpParser";
import { showToast } from "@/utils/showToast";
import { Ionicons } from "@expo/vector-icons";
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
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const RegisterScreen = () => {
  const { products } = useProductStore();
  const [form, setForm] = useState(DefaultForm);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [imageUri, setImageUri] = useState<string>();
  const [cameraPermission, setCameraPermission] =
    useState<PermissionStatus | null>(null);
  const [galleryPermission, setGalleryPermission] =
    useState<PermissionStatus | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const validate = useCallback((values: typeof form) => {
    const newErrors: typeof errors = {};
    if (!values.nationalId || values.nationalId.length < 8)
      newErrors.nationalId = "NIK minimal 8 karakter";
    if (!values.fullName) newErrors.fullName = "Nama wajib diisi";
    if (!values.birthPlace) newErrors.birthPlace = "Tempat lahir wajib diisi";
    if (!values.birthDate) newErrors.birthDate = "Tanggal lahir wajib diisi";
    if (!values.gender) newErrors.gender = "Jenis kelamin wajib dipilih";
    if (!values.phone || values.phone.length < 10)
      newErrors.phone = "Nomor HP tidak valid";
    if (!values.address) newErrors.address = "Alamat wajib diisi";
    if (!values.rtRw) newErrors.rtRw = "RT / RW wajib diisi";
    if (!values.village) newErrors.village = "Kelurahan / Desa wajib diisi";
    if (!values.district) newErrors.district = "Kecamatan wajib diisi";
    if (!values.religion) newErrors.religion = "Agama wajib dipilih";
    if (!values.maritalStatus)
      newErrors.maritalStatus = "Status perkawinan wajib dipilih";
    if (!values.occupation) newErrors.occupation = "Pekerjaan wajib diisi";
    if (!values.nationality)
      newErrors.nationality = "Kewarganegaraan wajib diisi";
    if (!values.income) newErrors.income = "Penghasilan wajib diisi";
    if (!values.landArea) newErrors.landArea = "Luas tanah tidak boleh negatif";
    if (!values.familiyMembers)
      newErrors.familiyMembers = "Jumlah anggota keluarga wajib diisi";
    if (!values.homeOwnership)
      newErrors.homeOwnership = "Wajib pilih kepemilikan rumah";
    if (!values.kjsNumber) newErrors.kjsNumber = "Nomor KJS wajib diisi";
    if (!values.password || values.password.length < 6)
      newErrors.password = "Password minimal 6 karakter";
    if (!values.confirmPassword)
      newErrors.confirmPassword = "Konfirmasi password wajib diisi";
    else if (values.confirmPassword !== values.password)
      newErrors.confirmPassword = "Konfirmasi password tidak sama";

    return newErrors;
  }, []);

  const processImage = async (path?: string) => {
    if (!path) return;

    setImageUri(path);

    if (isSupported) {
      try {
        const extractedTexts = await extractTextFromImage(path);

        const parsed = parseKTPText(extractedTexts);

        const genderMap: Record<string, string> = {
          "LAKI-LAKI": "L",
          "Laki-laki": "L",
          LAKI: "L",
          MALE: "L",
          PEREMPUAN: "P",
          Perempuan: "P",
          FEMALE: "P",
        };

        const maritalStatusMap: Record<string, string> = {
          KAWIN: "Kawin",
          "BELUM KAWIN": "Belum Kawin",
          CERAI: "Cerai",
          MARRIED: "Kawin",
        };

        const religionMap: Record<string, string> = {
          ISLAM: "Islam",
          KRISTEN: "Kristen",
          CHRISTIAN: "Kristen",
          KATOLIK: "Katolik",
          HINDU: "Hindu",
          BUDDHA: "Buddha",
          KONGHUCU: "Konghucu",
        };

        setForm((prev) => ({
          ...prev,
          nationalId: parsed.nationalId || prev.nationalId,
          fullName: parsed.fullName || prev.fullName,
          birthPlace: parsed.birthPlace || prev.birthPlace,
          birthDate: parsed.birthDate || prev.birthDate,
          gender: genderMap[parsed.gender || ""] || prev.gender,
          address: parsed.address || prev.address,
          rtRw: parsed.rtRw || prev.rtRw,
          village: parsed.village || prev.village,
          district: parsed.district || prev.district,
          religion: religionMap[parsed.religion || ""] || prev.religion,
          maritalStatus:
            maritalStatusMap[parsed.maritalStatus || ""] || prev.maritalStatus,
          occupation: parsed.occupation || prev.occupation,
        }));
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
        setForm(DefaultForm);
        await processImage(path);
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
        setForm(DefaultForm);
        await processImage(path);
      }
    } catch (error) {
      if (error instanceof Error)
        showToast("error", "Camera Error", error.message);
    }
  };

  const isValid = useMemo(() => {
    const check = validate(form);
    return Object.keys(check).length === 0;
  }, [form, validate]);

  const handleSubmit = async () => {
    const check = validate(form);
    setErrors(check);
    setSubmitted(true);

    if (Object.keys(check).length > 0) return;

    setIsSubmitting(true);

    const subsidies = products
      .filter((p: any) => ["gas lpg", "pupuk"].includes(p.name.toLowerCase()))
      .map((p: any) => p.id);

    const payload = {
      nik: form.nationalId,
      name: form.fullName,
      phone: form.phone,
      address: `${form.address}, RT/RW ${form.rtRw}`,
      district: form.district,
      income: Number(form.income),
      familiyMembers: Number(form.familiyMembers),
      landArea: Number(form.landArea),
      homeOwnership: form.homeOwnership,
      kjsNumber: form.kjsNumber,
      haveBankAccount: form.haveBankAccount === "Ya" ? true : false,
      password: form.password,
      subsidies,
      suspensionNotes: null,
    };

    try {
      const result = await register(payload);
      showToast("success", "Sukses", result.message);
      router.replace("/(auth)/login");
    } catch (error) {
      console.error(error);
      showToast(
        "error",
        "Gagal Daftar",
        "Terjadi kesalahan saat proses registrasi."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchData = async () => {
    try {
      await getProducts();
    } catch (error: any) {
      const message = error?.response?.data?.message ?? "Terjadi kesalahan";
      showToast("error", "Gagal", message);
    }
  };

  useEffect(() => {
    const getPermissions = async () => {
      const cameraPermissionResult = await requestCameraPermissionsAsync();
      setCameraPermission(cameraPermissionResult.status);

      const galleryPermissionResult =
        await requestMediaLibraryPermissionsAsync();
      setGalleryPermission(galleryPermissionResult.status);
    };

    getPermissions();
    fetchData();
  }, []);

  return (
    <SafeAreaView>
      <KeyboardAvoiding>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.illustrationWrapper, GlobalStyles.center]}>
            <ILRobot />
          </View>
          <Gap vertical={6} />
          <Text type="semibold" size="2xl" style={GlobalStyles.center}>
            Daftar
          </Text>
          <Gap vertical={8} />
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
          <Gap vertical={8} />
          <Input
            placeholder="NIK"
            value={form.nationalId}
            onChangeText={(v) => handleChange("nationalId", v)}
            error={submitted ? errors.nationalId : undefined}
          />
          <Gap vertical={4} />
          <Input
            placeholder="Nama Lengkap"
            value={form.fullName}
            onChangeText={(v) => handleChange("fullName", v)}
            error={submitted ? errors.fullName : undefined}
          />
          <Gap vertical={4} />
          <Input
            placeholder="Tempat Lahir"
            value={form.birthPlace}
            onChangeText={(v) => handleChange("birthPlace", v)}
            error={submitted ? errors.birthPlace : undefined}
          />
          <Gap vertical={4} />
          <DatePicker
            placeholder="Tanggal Lahir"
            value={form.birthDate}
            onChangeText={(v) => handleChange("birthDate", v)}
            error={submitted ? errors.birthDate : undefined}
          />
          <Gap vertical={4} />
          <Select
            placeholder="Jenis Kelamin"
            value={form.gender}
            onChange={(v) => handleChange("gender", v.value)}
            options={[
              { label: "Laki-laki", value: "L" },
              { label: "Perempuan", value: "P" },
            ]}
            error={submitted ? errors.gender : undefined}
          />
          <Gap vertical={4} />
          <Input
            placeholder="Nomor Handphone"
            keyboardType="phone-pad"
            value={form.phone}
            onChangeText={(v) => handleChange("phone", v)}
            error={submitted ? errors.phone : undefined}
          />
          <Gap vertical={4} />
          <Input
            placeholder="Alamat"
            value={form.address}
            onChangeText={(v) => handleChange("address", v)}
            error={submitted ? errors.address : undefined}
          />
          <Gap vertical={4} />
          <Input
            placeholder="RT / RW"
            value={form.rtRw}
            onChangeText={(v) => handleChange("rtRw", v)}
            error={submitted ? errors.rtRw : undefined}
          />
          <Gap vertical={4} />
          <Input
            placeholder="Kelurahan / Desa"
            value={form.village}
            onChangeText={(v) => handleChange("village", v)}
            error={submitted ? errors.village : undefined}
          />
          <Gap vertical={4} />
          <Input
            placeholder="Kecamatan"
            value={form.district}
            onChangeText={(v) => handleChange("district", v)}
            error={submitted ? errors.district : undefined}
          />
          <Gap vertical={4} />
          <Select
            placeholder="Agama"
            value={form.religion}
            onChange={(v) => handleChange("religion", v.value)}
            options={[
              { label: "Islam", value: "Islam" },
              { label: "Kristen", value: "Kristen" },
              { label: "Katolik", value: "Katolik" },
              { label: "Hindu", value: "Hindu" },
              { label: "Buddha", value: "Buddha" },
              { label: "Konghucu", value: "Konghucu" },
            ]}
            error={submitted ? errors.religion : undefined}
          />
          <Gap vertical={4} />
          <Select
            placeholder="Status Perkawinan"
            value={form.maritalStatus}
            onChange={(v) => handleChange("maritalStatus", v.value)}
            options={[
              { label: "Belum Kawin", value: "Belum Kawin" },
              { label: "Kawin", value: "Kawin" },
              { label: "Cerai", value: "Cerai" },
            ]}
            error={submitted ? errors.maritalStatus : undefined}
          />
          <Gap vertical={4} />
          <Input
            placeholder="Pekerjaan"
            value={form.occupation}
            onChangeText={(v) => handleChange("occupation", v)}
            error={submitted ? errors.occupation : undefined}
          />
          <Gap vertical={4} />
          <Input
            placeholder="Kewarganegaraan"
            value={form.nationality}
            onChangeText={(v) => handleChange("nationality", v)}
            disabled
            error={submitted ? errors.nationality : undefined}
          />
          <Gap vertical={4} />
          <Input
            placeholder="Penghasilan (Rp)"
            keyboardType="number-pad"
            value={form.income.toString()}
            onChangeText={(v) => handleChange("income", v)}
            error={submitted ? errors.income : undefined}
          />

          <Gap vertical={4} />
          <Input
            placeholder="Jumlah Anggota Keluarga"
            keyboardType="number-pad"
            value={form.familiyMembers.toString()}
            onChangeText={(v) => handleChange("familiyMembers", v)}
            error={submitted ? errors.familiyMembers : undefined}
          />

          <Gap vertical={4} />
          <Input
            placeholder="Luas Tanah (m²)"
            keyboardType="number-pad"
            value={form.landArea.toString()}
            onChangeText={(v) => handleChange("landArea", v)}
            error={submitted ? errors.landArea : undefined}
          />

          <Gap vertical={4} />
          <Select
            placeholder="Status Kepemilikan Rumah"
            value={form.homeOwnership}
            onChange={(v) => handleChange("homeOwnership", v.value)}
            options={[
              { label: "Milik Sendiri", value: "Milik Sendiri" },
              { label: "Sewa", value: "Sewa" },
              { label: "Menumpang", value: "Menumpang" },
            ]}
            error={submitted ? errors.homeOwnership : undefined}
          />

          <Gap vertical={4} />
          <Input
            placeholder="Nomor KJS"
            value={form.kjsNumber}
            onChangeText={(v) => handleChange("kjsNumber", v)}
            error={submitted ? errors.kjsNumber : undefined}
          />

          <Gap vertical={4} />
          <Select
            placeholder="Punya Rekening Bank?"
            value={form.haveBankAccount ? "Ya" : "Tidak"}
            onChange={(v) => handleChange("haveBankAccount", v.value)}
            options={[
              { label: "Ya", value: "Ya" },
              { label: "Tidak", value: "Tidak" },
            ]}
          />

          <Gap vertical={4} />
          <Input
            placeholder="Kata Sandi"
            secureTextEntry
            value={form.password}
            onChangeText={(v) => handleChange("password", v)}
            error={submitted ? errors.password : undefined}
          />
          <Gap vertical={4} />
          <Input
            placeholder="Konfirmasi Kata Sandi"
            secureTextEntry
            value={form.confirmPassword}
            onChangeText={(v) => handleChange("confirmPassword", v)}
            error={submitted ? errors.confirmPassword : undefined}
          />
          <Gap vertical={8} />
          <Button
            title="Daftar"
            loading={isSubmitting}
            onPress={handleSubmit}
            disabled={!isValid}
          />
          <Gap vertical={10} />
          <Gap vertical={10} />
          <View style={[styles.footer, GlobalStyles.rowCenter]}>
            <Text>Sudah punya akun? </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push("/(auth)/login")}
            >
              <Text type="medium" color={colors.primary[500]}>
                Masuk
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoiding>
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing[6],
    paddingBottom: spacing[10],
  },
  illustrationWrapper: {
    paddingTop: spacing[3],
  },
  imagePicker: {
    width: "100%",
    aspectRatio: 3 / 2,
    backgroundColor: colors.base.white,
    borderRadius: borderRadius["2xl"],
    overflow: "hidden",
    ...GlobalStyles.center,
  },
  footer: {
    ...GlobalStyles.center,
  },
});
