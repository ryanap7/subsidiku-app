import React from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { PI, RADIUS } from "./Constants";
import HalfCircle from "./HalfCircle";

interface CircularProgressProps {
  progress: SharedValue<number>;
  bg: string;
  fg: string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  progress,
  bg,
  fg,
}) => {
  const topHalfStyle = useAnimatedStyle(() => {
    const angle = progress.value * 2 * PI;
    return {
      transform: [
        { translateY: RADIUS / 2 },
        { rotate: `${angle}rad` },
        { translateY: -RADIUS / 2 },
      ],
      opacity: angle < PI ? 1 : 0,
    };
  });

  const bottomHalfStyle = useAnimatedStyle(() => {
    const angle = interpolate(
      progress.value * 2 * PI,
      [PI, 2 * PI],
      [0, PI],
      Extrapolate.CLAMP
    );
    return {
      transform: [
        { translateY: RADIUS / 2 },
        { rotate: `${angle}rad` },
        { translateY: -RADIUS / 2 },
      ],
    };
  });

  return (
    <View style={styles.wrapper}>
      <View style={styles.halfContainer}>
        <HalfCircle color={fg} />
        <Animated.View style={[StyleSheet.absoluteFillObject, topHalfStyle]}>
          <HalfCircle color={bg} />
        </Animated.View>
      </View>

      <View
        style={[styles.halfContainer, { transform: [{ rotate: "180deg" }] }]}
      >
        <HalfCircle color={fg} />
        <Animated.View style={[StyleSheet.absoluteFillObject, bottomHalfStyle]}>
          <HalfCircle color={bg} />
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: RADIUS * 2,
    height: RADIUS * 2,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  halfContainer: {
    width: RADIUS * 2,
    height: RADIUS,
    overflow: "hidden",
  },
});

export default CircularProgress;
