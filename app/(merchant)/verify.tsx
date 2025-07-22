import { Gap, SafeAreaView, Text } from "@/components";
import Button from "@/components/screens/Verify/Button";
import { colors } from "@/themes";
import { GlobalStyles } from "@/themes/common";
import React, { useRef } from "react";
import { StyleSheet, Vibration, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS, useSharedValue } from "react-native-reanimated";

const VerifyScreen = () => {
  const progress = useSharedValue(0);
  const animationFrame = useRef<number | null>(null);
  const startTime = useRef<number>(0);
  const duration = 3000;

  const updateProgress = (timestamp: number) => {
    if (startTime.current === 0) startTime.current = timestamp;
    const elapsed = timestamp - startTime.current;

    progress.value = Math.min(elapsed / duration, 1);

    if (elapsed < duration) {
      animationFrame.current = requestAnimationFrame(updateProgress);
    }
  };

  const start = () => {
    startTime.current = 0;
    animationFrame.current = requestAnimationFrame(updateProgress);
  };

  const stop = () => {
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
      animationFrame.current = null;
    }
    if (progress.value < 1) {
      progress.value = 0;
    } else {
      runOnJS(Vibration.vibrate)(100);
    }
  };

  const gesture = Gesture.LongPress()
    .minDuration(0)
    .onStart(() => {
      runOnJS(start)();
    })
    .onEnd(() => {
      runOnJS(stop)();
    });

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text type="semibold" size="xl">
          Letakkan Sidik Jari Anda
        </Text>
        <Gap vertical={10} />
        <GestureDetector gesture={gesture}>
          <View>
            <Button progress={progress} />
          </View>
        </GestureDetector>
        <Gap vertical={10} />
        <Text type="semibold" size="xl">
          Verifikasi Sidik Jari
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default VerifyScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.base.white,
    ...GlobalStyles.flex,
    ...GlobalStyles.center,
  },
});
