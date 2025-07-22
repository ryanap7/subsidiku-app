import { useEffect, useState } from "react";
import { Animated } from "react-native";

export const useFloatingLabel = (value?: string | number) => {
  const [animated] = useState(new Animated.Value(value ? 1 : 0));

  const animate = (toValue: number) => {
    Animated.timing(animated, {
      toValue,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const onFocus = () => animate(1);
  const onBlur = () => {
    if (!value) animate(0);
  };

  useEffect(() => {
    animate(value ? 1 : 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return { animated, onFocus, onBlur };
};
