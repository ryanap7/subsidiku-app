import { useBottomSheet } from "@/context/BottomSheetContext";
import { borderRadius, colors, spacing } from "@/themes";
import { GlobalStyles } from "@/themes/common";
import { DatePickerProps } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import moment from "moment";
import "moment/locale/id";
import React, { FC, memo, useCallback, useMemo, useState } from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { Button, Gap, Text } from "../ui";
import ErrorMessage from "./ErrorMessage";

const DatePicker: FC<DatePickerProps> = ({
  label = "Tanggal Lahir",
  value,
  error,
  disabled = false,
  style,
  placeholder = "DD/MM/YYYY",
  minimumDate,
  maximumDate = new Date(),
  mode = "date",
  locale = "id-ID",
  dateFormat = "DD/MM/YYYY",
  testID,
  onChangeText,
  onDateChange,
}) => {
  const { show, hide } = useBottomSheet();

  const initialDate = useMemo(() => {
    if (!value) return null;
    if (value instanceof Date) return value;
    return new Date(value);
  }, [value]);

  const [date, setDate] = useState<Date | null>(initialDate);
  const [tempDate, setTempDate] = useState<Date>(
    () => initialDate || new Date()
  );
  const [showAndroidPicker, setShowAndroidPicker] = useState(false);

  const formattedValue = useMemo(() => {
    if (!date) return placeholder;
    try {
      return moment(date).format(dateFormat);
    } catch (error) {
      console.warn("DatePicker: Invalid date format", error);
      return placeholder;
    }
  }, [date, dateFormat, placeholder]);

  const textColor = useMemo(() => {
    if (!date) return disabled ? colors.neutral[70] : colors.neutral[50];
    return colors.neutral[90];
  }, [date, disabled]);

  const wrapperStyle = useMemo(
    () => [
      styles.wrapper,
      disabled && styles.disabledWrapper,
      error && styles.errorWrapper,
      style,
    ],
    [disabled, error, style]
  );

  const handleDateChange = useCallback(
    (event: DateTimePickerEvent, selectedDate?: Date) => {
      const { type } = event;

      if (Platform.OS === "android") setShowAndroidPicker(false);

      if (type === "dismissed") return;

      if (selectedDate) {
        if (Platform.OS === "android") {
          setDate(selectedDate);
          onChangeText?.(selectedDate.toISOString());
          onDateChange?.(selectedDate);
        } else {
          setTempDate(selectedDate);
        }
      }
    },
    [onChangeText, onDateChange]
  );

  const handleConfirm = useCallback(() => {
    setDate(tempDate);
    onChangeText?.(tempDate.toISOString());
    onDateChange?.(tempDate);
    hide();
  }, [tempDate, onChangeText, onDateChange, hide]);

  const openPicker = useCallback(() => {
    if (disabled) return;

    if (Platform.OS === "ios") {
      setTempDate(date || new Date());
      show(
        <>
          <Text type="semibold" size="xl">
            {label}
          </Text>
          <Gap vertical={2} />
          <Text size="md" color={colors.neutral[70]}>
            {mode === "date"
              ? "Tentukan tanggal lahir kamu"
              : mode === "time"
              ? "Tentukan waktu"
              : "Tentukan tanggal dan waktu"}
          </Text>
          <Gap vertical={4} />
          <View style={styles.datepicker}>
            <DateTimePicker
              locale={locale}
              mode={mode}
              display="spinner"
              value={tempDate}
              onChange={handleDateChange}
              minimumDate={minimumDate}
              maximumDate={maximumDate}
              testID={`${testID}-ios-picker`}
            />
          </View>
          <Gap vertical={4} />
          <Button
            title="Atur"
            onPress={handleConfirm}
            style={styles.confirmButton}
          />
        </>
      );
    } else {
      setShowAndroidPicker(true);
    }
  }, [
    disabled,
    label,
    mode,
    locale,
    tempDate,
    minimumDate,
    maximumDate,
    handleDateChange,
    handleConfirm,
    show,
  ]);

  return (
    <>
      <Pressable style={wrapperStyle} onPress={openPicker} testID={testID}>
        <View style={GlobalStyles.flex}>
          <Text color={textColor}>{formattedValue}</Text>
        </View>
        <Ionicons
          name="calendar-number"
          size={20}
          color={disabled ? colors.neutral[50] : colors.neutral[80]}
        />
      </Pressable>

      {Platform.OS === "android" && showAndroidPicker && (
        <DateTimePicker
          mode={mode}
          display="default"
          value={date || new Date()}
          onChange={handleDateChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          locale={locale}
          testID={`${testID}-android-picker`}
        />
      )}

      {error && (
        <View style={styles.spacing}>
          <ErrorMessage message={error} />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    height: 64,
    backgroundColor: colors.base.white,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderWidth: 1.5,
    borderRadius: borderRadius.rounded,
    borderColor: "transparent",
    justifyContent: "space-between",
    ...GlobalStyles.rowCenter,
  },
  disabledWrapper: {
    backgroundColor: colors.neutral[0],
  },
  errorWrapper: {
    borderColor: colors.primary[400],
  },
  spacing: {
    marginTop: spacing[1],
  },
  datepicker: {
    width: "100%",
    ...GlobalStyles.center,
  },
  confirmButton: {
    ...GlobalStyles.flex,
  },
});

export default memo(DatePicker);
