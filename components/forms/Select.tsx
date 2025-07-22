import { useBottomSheet } from "@/context/BottomSheetContext"; // 👉 pakai global bottomsheet
import { borderRadius, colors, spacing } from "@/themes";
import { GlobalStyles } from "@/themes/common";
import { Option, SelectProps } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import React, { FC, memo, useCallback, useMemo } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Gap, Text } from "../ui";
import ErrorMessage from "./ErrorMessage";

const Select: FC<SelectProps> = ({
  label = "Pilih Data",
  value,
  options,
  error,
  disabled = false,
  style,
  placeholder,
  onChange,
}) => {
  const { show, hide } = useBottomSheet();

  const selectedOption = useMemo(
    () => options.find((item) => item.value === value),
    [options, value]
  );

  const wrapperStyle = useMemo(
    () => [
      styles.wrapper,
      disabled && styles.disabledWrapper,
      error && styles.errorWrapper,
      style,
    ],
    [disabled, error, style]
  );

  const textColor = useMemo(() => {
    if (!value) return disabled ? colors.neutral[70] : colors.neutral[50];
    return colors.neutral[90];
  }, [value, disabled]);

  const handleSelect = useCallback(
    (option: Option) => {
      onChange?.(option);
      hide();
    },
    [onChange, hide]
  );

  const renderItem = useCallback(
    ({ item }: { item: Option }) => {
      const isSelected = item.value === value;
      return (
        <Pressable
          style={styles.item}
          onPress={() => handleSelect(item)}
          testID={`select-option-${item.value}`}
          accessibilityRole="button"
          accessibilityLabel={`Select ${item.label}`}
          accessibilityState={{ selected: isSelected }}
        >
          <View
            style={isSelected ? styles.selectedItem : styles.unselectedItem}
          >
            <Text
              type="medium"
              size="md"
              color={isSelected ? colors.neutral[90] : colors.neutral[70]}
            >
              {item.label}
            </Text>
            {isSelected && (
              <Ionicons
                name="checkmark"
                size={20}
                color={colors.primary[600]}
              />
            )}
          </View>
        </Pressable>
      );
    },
    [value, handleSelect]
  );

  const keyExtractor = useCallback((item: Option) => item.value, []);

  const openPicker = useCallback(() => {
    if (disabled) return;

    show(
      <>
        <Text type="semibold" size="xl">
          {label}
        </Text>
        <Gap vertical={4} />
        <Text size="md" color={colors.neutral[70]}>
          Pilih salah satu
        </Text>
        <Gap vertical={4} />
        <View style={styles.list}>
          <FlashList
            estimatedItemSize={56}
            data={options}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            getItemType={() => "option"}
            removeClippedSubviews={true}
          />
        </View>
      </>
    );
  }, [disabled, label, options, renderItem, keyExtractor, show]);

  const displayText = useMemo(() => {
    return selectedOption?.label || placeholder || "";
  }, [selectedOption, placeholder]);

  return (
    <>
      <Pressable style={wrapperStyle} onPress={openPicker}>
        <View style={GlobalStyles.flex}>
          <Text color={textColor}>{displayText}</Text>
        </View>
        <Ionicons
          name="chevron-down"
          size={20}
          color={disabled ? colors.neutral[50] : colors.neutral[80]}
        />
      </Pressable>

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
  list: {
    backgroundColor: colors.neutral[0],
    borderRadius: borderRadius.xl,
  },
  item: {
    paddingHorizontal: spacing[1],
    paddingVertical: spacing[1],
  },
  selectedItem: {
    backgroundColor: colors.base.white,
    padding: spacing[4],
    borderRadius: borderRadius.xl,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    ...GlobalStyles.shadow,
  },
  unselectedItem: {
    padding: spacing[4],
    borderRadius: borderRadius.xl,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default memo(Select);
