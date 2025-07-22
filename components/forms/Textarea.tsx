import { useFloatingLabel } from "@/hooks/useFloatingLabel";
import { colors, spacing, typography } from "@/themes";
import { InputProps } from "@/types";
import React, {
  FC,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Animated, Platform, StyleSheet, TextInput, View } from "react-native";
import { Text } from "../ui";
import ErrorMessage from "./ErrorMessage";

const MAX_LENGTH = 50;

const Textarea: FC<InputProps> = ({
  error,
  disabled = false,
  label,
  style,
  value = "",
  containerStyle,
  inputStyle,
  testID,
  onChangeText,
  ...rest
}) => {
  const {
    animated,
    onFocus: onFloatingFocus,
    onBlur: onFloatingBlur,
  } = useFloatingLabel(value);

  const [focused, setFocused] = useState(false);
  const [charError, setCharError] = useState(false);

  // Memoize label style to prevent recalculation
  const labelStyle = useMemo(
    () => ({
      top: animated.interpolate({ inputRange: [0, 1], outputRange: [16, 6] }),
      fontSize: animated.interpolate({
        inputRange: [0, 1],
        outputRange: [16, 12],
      }),
      color: animated.interpolate({
        inputRange: [0, 1],
        outputRange: [colors.neutral[50], colors.neutral[50]],
      }),
    }),
    [animated]
  );

  // Memoize computed styles to prevent recalculation
  const computedStyles = useMemo(() => {
    if (disabled) {
      return {
        borderColor: "transparent",
        backgroundColor: colors.neutral[0],
        textColor: colors.neutral[70],
      };
    }
    if (error || charError) {
      return {
        borderColor: colors.primary[40],
        backgroundColor: colors.overlay[5],
        textColor: colors.neutral[90],
      };
    }
    if (focused) {
      return {
        borderColor: colors.neutral[80],
        backgroundColor: colors.overlay[5],
        textColor: colors.neutral[90],
      };
    }
    return {
      borderColor: "transparent",
      backgroundColor: colors.overlay[5],
      textColor: colors.neutral[90],
    };
  }, [focused, error, disabled, charError]);

  // Memoize wrapper style
  const wrapperStyle = useMemo(
    () => [
      styles.wrapper,
      {
        borderColor: computedStyles.borderColor,
        backgroundColor: computedStyles.backgroundColor,
      },
      containerStyle,
    ],
    [computedStyles.borderColor, computedStyles.backgroundColor, containerStyle]
  );

  // Memoize input style
  const textInputStyle = useMemo(
    () => [
      styles.input,
      {
        color: computedStyles.textColor,
      },
      style,
      inputStyle,
    ],
    [computedStyles.textColor, style, inputStyle]
  );

  // Optimize focus handler with useCallback
  const handleFocus = useCallback(() => {
    setFocused(true);
    onFloatingFocus();
  }, [onFloatingFocus]);

  // Optimize blur handler with useCallback
  const handleBlur = useCallback(() => {
    setFocused(false);
    onFloatingBlur();
  }, [onFloatingBlur]);

  // Optimize change text handler with useCallback
  const handleChangeText = useCallback(
    (text: string) => {
      onChangeText?.(text);
    },
    [onChangeText]
  );

  // Memoize error message calculation
  const errorMessage = useMemo(() => {
    if (charError) return `Maksimal ${MAX_LENGTH} karakter.`;
    return error || "";
  }, [charError, error]);

  // Memoize character count display
  const characterCount = useMemo(
    () => `${value?.length ?? 0}/${MAX_LENGTH}`,
    [value?.length]
  );

  // Memoize character count text color
  const characterCountColor = useMemo(
    () => (charError ? colors.primary[40] : colors.neutral[50]),
    [charError]
  );

  // Memoize error component
  const ErrorComponent = useMemo(() => {
    if (!error && !charError) return null;

    return <ErrorMessage message={errorMessage} />;
  }, [error, charError, errorMessage]);

  // Memoize character count component
  const CharacterCountComponent = useMemo(
    () => (
      <Text
        size="sm"
        style={{
          color: characterCountColor,
        }}
      >
        {characterCount}
      </Text>
    ),
    [characterCount, characterCountColor]
  );

  // Character error effect
  useEffect(() => {
    setCharError(value.length > MAX_LENGTH);
  }, [value.length]);

  return (
    <View style={containerStyle}>
      <View style={wrapperStyle}>
        <Animated.Text style={[styles.label, labelStyle]}>
          {label}
        </Animated.Text>

        <TextInput
          {...rest}
          value={value}
          editable={!disabled}
          placeholderTextColor={colors.neutral[50]}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          maxLength={MAX_LENGTH + 10}
          style={textInputStyle}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChangeText={handleChangeText}
          testID={testID}
          autoCorrect={false}
          spellCheck={false}
          textContentType="none"
          importantForAutofill="no"
        />
      </View>

      <View style={styles.spacing}>
        <View style={styles.rowBetween}>
          <View style={styles.errorContainer}>{ErrorComponent}</View>
          {CharacterCountComponent}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    minHeight: 120,
    paddingHorizontal: spacing[4],
    paddingTop: spacing[6],
    borderWidth: 1.5,
    borderRadius: 16,
    position: "relative",
    justifyContent: "flex-start",
  },
  input: {
    flex: 1,
    fontFamily: typography.regular,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.3,
    paddingTop: spacing[1],
    paddingBottom: Platform.OS === "ios" ? 2 : 0,
  },
  label: {
    position: "absolute",
    left: Platform.OS === "ios" ? spacing[4] : spacing[5],
    fontFamily: typography.regular,
    backgroundColor: "transparent",
  },
  spacing: {
    marginTop: spacing[1],
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
  },
});

export default memo(Textarea);
