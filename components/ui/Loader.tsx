import { colors } from "@/themes";
import { GlobalStyles } from "@/themes/common";
import { LoaderProps } from "@/types";
import React, { FC, memo, useEffect, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const Loader: FC<LoaderProps> = ({
  size = 120,
  color = colors.primary[500],
  duration = 2000,
  style,
}) => {
  const scale1 = useSharedValue(0);
  const opacity1 = useSharedValue(1);
  const scale2 = useSharedValue(0);
  const opacity2 = useSharedValue(1);

  useEffect(() => {
    const timing = { duration, easing: Easing.linear };

    scale1.value = withRepeat(withTiming(1, timing), -1, false);
    opacity1.value = withRepeat(withTiming(0, timing), -1, false);

    scale2.value = withRepeat(
      withDelay(0.5 * duration, withTiming(1, timing)),
      -1,
      false
    );
    opacity2.value = withRepeat(
      withDelay(0.5 * duration, withTiming(0, timing)),
      -1,
      false
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration]);

  const rippleStyle1 = useAnimatedStyle(() => ({
    transform: [{ scale: scale1.value }],
    opacity: opacity1.value,
  }));

  const rippleStyle2 = useAnimatedStyle(() => ({
    transform: [{ scale: scale2.value }],
    opacity: opacity2.value,
  }));

  const baseStyle = useMemo(
    () => ({
      width: size,
      height: size,
      borderRadius: size / 2,
      borderWidth: size / 10,
      borderColor: color,
    }),
    [size, color]
  );

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Animated.View style={[baseStyle, styles.circle, rippleStyle1]} />
      <Animated.View style={[baseStyle, styles.circle, rippleStyle2]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...GlobalStyles.center,
  },
  circle: {
    position: "absolute",
  },
});

export default memo(Loader);
