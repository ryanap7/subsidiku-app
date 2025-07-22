import { colors } from "@/themes";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  interpolate,
  interpolateColor,
  runOnJS,
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
} from "react-native-reanimated";
import CircularProgress from "./CircularProgress";
import { ICON_SIZE, SIZE, STROKE_WIDTH } from "./Constants";

const AnimatedIcon = Animated.createAnimatedComponent(MaterialIcons);
const CONTENT_SIZE = SIZE - STROKE_WIDTH * 2;

interface ButtonProps {
  progress: SharedValue<number>;
}

const ProgressButton = ({ progress }: ButtonProps) => {
  const [active, setActive] = useState(false);

  useAnimatedReaction(
    () => progress.value,
    (val, prev: any) => {
      if (val >= 0.999 && prev < 0.999) {
        runOnJS(setActive)(true);
      }
    },
    []
  );

  useEffect(() => {
    if (active) {
      router.push("/(merchant)/success");
    }
  }, [active]);

  const heightStyle = useAnimatedStyle(() => {
    const height = interpolate(progress.value, [0, 1], [0, ICON_SIZE]);
    return {
      height,
      opacity: active ? 0 : 1,
    };
  }, [active]);

  const animatedColorStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      progress.value,
      [0, 1],
      [colors.base.background, colors.primary[500]]
    );
    return { color };
  });

  return (
    <View
      style={{
        width: SIZE,
        height: SIZE,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress
        progress={progress}
        bg={colors.base.white}
        fg={colors.primary[500]}
      />
      <View style={styles.container}>
        <AnimatedIcon
          name={active ? "check-circle" : "fingerprint"}
          size={ICON_SIZE}
          style={[styles.icon, !active && animatedColorStyle]}
        />
        <Animated.View style={[styles.activeIcon, heightStyle]}>
          <MaterialIcons
            name="fingerprint"
            size={ICON_SIZE}
            color={colors.primary[500]}
          />
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: STROKE_WIDTH,
    left: STROKE_WIDTH,
    right: STROKE_WIDTH,
    bottom: STROKE_WIDTH,
    backgroundColor: "white",
    borderRadius: CONTENT_SIZE / 2,
    zIndex: 100,
  },
  icon: {
    position: "absolute",
    top: (CONTENT_SIZE - ICON_SIZE) / 2,
    left: (CONTENT_SIZE - ICON_SIZE) / 2,
  },
  activeIcon: {
    position: "absolute",
    top: (CONTENT_SIZE - ICON_SIZE) / 2,
    left: (CONTENT_SIZE - ICON_SIZE) / 2,
  },
});

export default ProgressButton;
