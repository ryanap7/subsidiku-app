import { IcEye, IcEyeOff } from "@/assets";
import { borderRadius, colors, fontSize, spacing, typography } from "@/themes";
import { GlobalStyles } from "@/themes/common";
import { InputProps } from "@/types";
import React, { FC, memo, useCallback, useMemo, useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import ErrorMessage from "./ErrorMessage";

const Input: FC<InputProps> = ({
  error,
  icon,
  disabled = false,
  label,
  style,
  value,
  containerStyle,
  inputStyle,
  testID,
  onChangeText,

  ...rest
}) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Memoize computed styles to prevent recalculation
  const computedStyles = useMemo(() => {
    if (disabled) {
      return {
        borderColor: "transparent",
        backgroundColor: colors.neutral[20],
        textColor: colors.neutral[90],
      };
    }
    if (error) {
      return {
        borderColor: colors.error[500],
        backgroundColor: colors.base.white,
        textColor: colors.neutral[90],
      };
    }
    if (focused) {
      return {
        borderColor: colors.primary[500],
        backgroundColor: colors.base.white,
        textColor: colors.neutral[90],
      };
    }
    return {
      borderColor: "transparent",
      backgroundColor: colors.base.white,
      textColor: colors.neutral[90],
    };
  }, [focused, error, disabled]);

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
  }, []);

  // Optimize blur handler with useCallback
  const handleBlur = useCallback(() => {
    setFocused(false);
  }, []);

  // Optimize password toggle with useCallback
  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  // Memoize password icon component to prevent recreation
  const PasswordToggleIcon = useMemo(() => {
    if (!rest.secureTextEntry || disabled) return null;

    return (
      <TouchableOpacity activeOpacity={0.8} onPress={togglePasswordVisibility}>
        {showPassword ? (
          <IcEye width={20} height={20} />
        ) : (
          <IcEyeOff width={20} height={20} />
        )}
      </TouchableOpacity>
    );
  }, [rest.secureTextEntry, disabled, showPassword, togglePasswordVisibility]);

  // Memoize error message component
  const ErrorComponent = useMemo(() => {
    if (!error) return null;

    return (
      <View style={styles.spacing}>
        <ErrorMessage message={error} />
      </View>
    );
  }, [error]);

  return (
    <View style={containerStyle}>
      <View style={wrapperStyle}>
        <TextInput
          {...rest}
          value={value}
          editable={!disabled}
          secureTextEntry={rest.secureTextEntry && !showPassword}
          placeholderTextColor={colors.neutral[50]}
          style={textInputStyle}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChangeText={onChangeText}
          testID={testID}
          autoCorrect={false}
          spellCheck={false}
          textContentType={rest.secureTextEntry ? "password" : "none"}
          importantForAutofill={rest.secureTextEntry ? "yes" : "no"}
          autoCapitalize="none"
        />

        {PasswordToggleIcon}
      </View>

      {ErrorComponent}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    height: 56,
    paddingHorizontal: spacing[4],
    borderWidth: 1.5,
    borderRadius: borderRadius.rounded,
    ...GlobalStyles.rowCenter,
  },
  input: {
    flex: 1,
    height: 56,
    fontFamily: typography.regular,
    fontSize: fontSize.base,
    color: colors.neutral[90],
  },
  spacing: {
    marginTop: spacing[1],
  },
});

export default memo(Input);
