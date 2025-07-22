import { colors, spacing } from "@/themes";
import { GlobalStyles } from "@/themes/common";
import { ButtonProps } from "@/types";
import React, { FC, memo, useCallback, useMemo, useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import Text from "./Text";

const Button: FC<ButtonProps> = ({
  title,
  variant = "primary",
  icon,
  loading,
  disabled,
  style,
  ...rest
}) => {
  const isLoading = loading;
  const isDisabled = disabled;
  const isPressable = isLoading || isDisabled;

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(() => {
    Animated.timing(scaleAnim, {
      toValue: 0.96,
      duration: 120,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);

  const handlePressOut = useCallback(() => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 120,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);

  const backgroundColor = useMemo(() => {
    if (isDisabled) return colors.neutral[20];

    switch (variant) {
      case "primary":
        return colors.neutral[90];
      case "secondary":
        return colors.neutral[10];
      case "tertiary":
        return colors.base.white;
      default:
        return colors.neutral[10];
    }
  }, [isDisabled, variant]);

  const textColor = useMemo(() => {
    if (isDisabled) return colors.base.white;

    switch (variant) {
      case "primary":
        return colors.base.white;
      case "secondary":
      case "tertiary":
        return colors.neutral[90];
      default:
        return colors.neutral[90];
    }
  }, [isDisabled, variant]);

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isPressable}
      {...rest}
    >
      <Animated.View
        style={[
          styles.button,
          {
            backgroundColor,
            transform: [{ scale: scaleAnim }],
          },
          style,
        ]}
      >
        {isLoading ? (
          <ActivityIndicator color={textColor} />
        ) : (
          <View style={styles.content}>
            {icon && <View style={styles.icon}>{icon}</View>}
            <Text type="medium" color={textColor}>
              {title}
            </Text>
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "100%",
    height: 52,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    ...GlobalStyles.rowCenter,
    ...GlobalStyles.center,
    ...GlobalStyles.rounded,
  },
  content: {
    ...GlobalStyles.rowCenter,
  },
  icon: {
    marginRight: spacing[3],
  },
});

export default memo(Button);
