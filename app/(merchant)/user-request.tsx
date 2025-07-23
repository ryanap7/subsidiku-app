import {
  BottomSheet,
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
import { useMerchantStore } from "@/stores/merchantStore";
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
import LottieView from "lottie-react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const DATA = [
  {
    nationalId: "3214100312890002",
    fullName: "Ahmad Syaripudin",
    birthPlace: "PURWAKARTA",
    birthDate: "1989-12-03",
    gender: "LAKI-LAKI",
    phone: "",
    address: "KP TANJUNGKERTA",
    rtRw: "005/002",
    village: "CIHERANG",
    district: "PESAWAHA",
    religion: "Islam",
    maritalStatus: "Kawin",
    occupation: "PELAJAR/MAHASISWA",
    nationality: "Indonesia",
    password: "",
    confirmPassword: "",
    income: "",
    landArea: "",
    familiyMembers: "",
    homeOwnership: "",
    kjsNumber: "",
    haveBankAccount: "",
    subsidies: ["00001", "00002"],
    suspensionNotes: null,
  },
  {
    nationalId: "3471140209790001",
    fullName: "RIYANTO, SE",
    birthPlace: "GROBOGAN",
    birthDate: "1979-09-02",
    gender: "LAKI-LAKI",
    phone: "",
    address: "PRM PURI DOMAS D-3, SEMPU",
    rtRw: "001/024",
    village: "WEDOMARTANI",
    district: "NGEMPLAK",
    religion: "Islam",
    maritalStatus: "Kawin",
    occupation: "PEDAGANG",
    nationality: "Indonesia",
    password: "",
    confirmPassword: "",
    income: "",
    landArea: "",
    familiyMembers: "",
    homeOwnership: "",
    kjsNumber: "",
    haveBankAccount: "",
    subsidies: [],
    suspensionNotes: null,
  },
  {
    nationalId: "3506042602660001",
    fullName: "SULISTYONO",
    birthPlace: "KEDIRI",
    birthDate: "1966-02-26",
    gender: "LAKI-LAKI",
    phone: "",
    address: "JL.RAYA - DSN PURWOKERTO",
    rtRw: "002/003",
    village: "PURWOKERTO",
    district: "NGADILUWIH",
    religion: "Islam",
    maritalStatus: "Kawin",
    occupation: "GURU",
    nationality: "Indonesia",
    password: "",
    confirmPassword: "",
    income: "",
    landArea: "",
    familiyMembers: "",
    homeOwnership: "",
    kjsNumber: "",
    haveBankAccount: "",
    subsidies: [],
    suspensionNotes: null,
  },
  {
    nationalId: "3510243006730004",
    fullName: "TUHAN",
    birthPlace: "BANYUWANGI",
    birthDate: "1973-06-30",
    gender: "LAKI-LAKI",
    phone: "",
    address: "DUSUN KRAJAN",
    rtRw: "001/002",
    village: "KLUNCING",
    district: "LICIN",
    religion: "Islam",
    maritalStatus: "Kawin",
    occupation: "WIRASWASTA",
    nationality: "Indonesia",
    password: "",
    confirmPassword: "",
    income: "",
    landArea: "",
    familiyMembers: "",
    homeOwnership: "",
    kjsNumber: "",
    haveBankAccount: "",
    subsidies: [],
    suspensionNotes: null,
  },
];

const UserRequestScreen = () => {
  const { merchant } = useMerchantStore();
  const [form, setForm] = useState(DefaultForm);

  const ref = useRef<BottomSheet | null>(null);

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

  const handleAutoFillByNIK = (nik: string) => {
    const found = DATA.find((item) => item.nationalId === nik);
    if (found) {
      setForm((prev) => ({ ...prev, ...found }));
    }
  };

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

  const handleSearch = useCallback(async () => {
    try {
      const found = DATA.find((item) => item.nationalId === "3214100312890002");
      if (found) {
        setForm((prev) => ({ ...prev, ...found }));
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

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

    const subsidies = merchant?.products
      .filter((p: any) =>
        ["gas lpg", "pupuk"].includes(p.product.name.toLowerCase())
      )
      .map((p: any) => p.product.id);

    const payload = {
      merchantCode: merchant.code,
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
      router.back();
    } catch (error) {
      console.error(error);
      showToast(
        "error",
        "Gagal Ajukan",
        "Terjadi kesalahan saat proses registrasi."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const getPermissions = async () => {
      const result = await requestMediaLibraryPermissionsAsync();
      setGalleryPermission(result.status);
    };
    getPermissions();
  }, []);

  return (
    <>
      <SafeAreaView>
        <KeyboardAvoiding>
          <View style={styles.header}>
            <TouchableOpacity activeOpacity={0.8} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} />
            </TouchableOpacity>
          </View>
          <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text type="semibold" size="2xl" style={GlobalStyles.center}>
              Ajukan Subsidi untuk Warga
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
            <View style={GlobalStyles.rowCenter}>
              <Input
                placeholder="Masukkan NIK"
                keyboardType="numeric"
                value={form.nationalId}
                onChangeText={(v) => {
                  handleChange("nationalId", v);
                  handleAutoFillByNIK(v);
                }}
                error={submitted ? errors.nationalId : undefined}
                containerStyle={GlobalStyles.flex}
              />
              <Gap horizontal={4} />
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.button}
                onPress={() => {
                  ref.current?.show();
                  setTimeout(() => {
                    handleSearch();
                    ref.current?.hide();
                  }, 5000);
                }}
              >
                <Ionicons name="search" size={24} color={colors.base.white} />
              </TouchableOpacity>
            </View>
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
              title="Ajukan"
              loading={isSubmitting}
              onPress={handleSubmit}
              disabled={!isValid}
            />
            <Gap vertical={10} />
          </ScrollView>
        </KeyboardAvoiding>
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

export default UserRequestScreen;

const styles = StyleSheet.create({
  container: {
    padding: spacing[6],
  },
  header: {
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[4],
  },
  imagePicker: {
    width: "100%",
    aspectRatio: 3 / 2,
    backgroundColor: colors.base.white,
    borderRadius: borderRadius["2xl"],
    ...GlobalStyles.center,
  },
  button: {
    backgroundColor: colors.neutral[90],
    width: 56,
    height: 56,
    borderRadius: borderRadius.xl,
    ...GlobalStyles.center,
  },
  illustration: {
    width: 200,
    height: 200,
  },
});
