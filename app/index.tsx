/* eslint-disable react-hooks/rules-of-hooks */
import { useAuthStore } from "@/stores/authStore";
import { colors } from "@/themes";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { Dimensions, StatusBar, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

const { height } = Dimensions.get("window");

const SplashScreen = () => {
  const title = "SubsidiKu".split("");

  const dropY = useSharedValue(-150);
  const expandScale = useSharedValue(1);
  const bgOpacity = useSharedValue(0);
  const finalFade = useSharedValue(0);

  const titleOpacities = title.map(() => useSharedValue(0));
  const titleTransforms = title.map(() => useSharedValue(10));

  useEffect(() => {
    const token = useAuthStore.getState().token;

    // Waterfall drop
    dropY.value = withTiming(height / 2 - 50, {
      duration: 1200,
      easing: Easing.out(Easing.quad),
    });

    // Droplet expand effect
    expandScale.value = withDelay(
      1000,
      withTiming(25, {
        duration: 900,
        easing: Easing.inOut(Easing.quad),
      })
    );

    // Background fade in
    bgOpacity.value = withDelay(
      1200,
      withTiming(1, {
        duration: 600,
        easing: Easing.linear,
      })
    );

    // Title animation per character
    titleOpacities.forEach((opacity, i) => {
      opacity.value = withDelay(
        2200 + i * 100,
        withTiming(1, { duration: 400, easing: Easing.out(Easing.exp) })
      );
    });

    titleTransforms.forEach((transform, i) => {
      transform.value = withDelay(
        2200 + i * 100,
        withTiming(0, { duration: 400, easing: Easing.out(Easing.exp) })
      );
    });

    // Transition to login
    setTimeout(() => {
      finalFade.value = withDelay(
        300,
        withTiming(1, {
          duration: 400,
          easing: Easing.inOut(Easing.exp),
        })
      );

      setTimeout(() => {
        if (token) {
          router.replace("/(tabs)");
        } else {
          router.replace("/(auth)/login");
        }
      }, 700);
    }, 3500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Styles
  const dropStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: dropY.value }, { scale: expandScale.value }],
    opacity: dropY.value < 0 ? 0 : 1,
  }));

  const whiteBgStyle = useAnimatedStyle(() => ({
    opacity: bgOpacity.value,
    backgroundColor: colors.base.white,
    ...StyleSheet.absoluteFillObject,
  }));

  const finalFadeStyle = useAnimatedStyle(() => ({
    opacity: finalFade.value,
    backgroundColor: colors.base.white,
    ...StyleSheet.absoluteFillObject,
    zIndex: 5,
  }));

  return (
    <View style={styles.page}>
      <StatusBar translucent barStyle="light-content" />

      {/* White background transition */}
      <Animated.View style={whiteBgStyle} />

      {/* Droplet animation */}
      <Animated.View style={[styles.droplet, dropStyle]} />

      {/* Title animation (SubsidiKu) */}
      <View style={[styles.logoContainer, { flexDirection: "row" }]}>
        {title.map((char, i) => {
          const animatedStyle = useAnimatedStyle(() => ({
            opacity: titleOpacities[i].value,
            transform: [{ translateY: titleTransforms[i].value }],
          }));

          return (
            <Animated.Text key={i} style={[styles.titleChar, animatedStyle]}>
              {char}
            </Animated.Text>
          );
        })}
      </View>

      {/* Final fade out cover */}
      <Animated.View style={finalFadeStyle} />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.primary[500],
    justifyContent: "center",
    alignItems: "center",
  },
  droplet: {
    position: "absolute",
    width: 20,
    height: 20,
    backgroundColor: colors.base.white,
    borderRadius: 10,
    top: 0,
    left: "50%",
    marginLeft: -10,
    zIndex: 2,
  },
  logoContainer: {
    zIndex: 3,
  },
  titleChar: {
    fontSize: 34,
    fontWeight: "700",
    color: colors.primary[700],
    textShadowColor: "rgba(0, 0, 0, 0.15)",
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 3,
  },
});
