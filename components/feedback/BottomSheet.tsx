import { borderRadius, colors, spacing } from "@/themes";
import { BottomSheetProps, BottomSheetState } from "@/types";
import { BlurView } from "expo-blur";
import React, { PureComponent } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import {
  GestureEvent,
  PanGestureHandler,
  PanGestureHandlerStateChangeEvent,
} from "react-native-gesture-handler";
import { PanGestureHandlerEventPayload } from "react-native-screens";

const SCREEN_HEIGHT = Dimensions.get("window").height;

export default class BottomSheet extends PureComponent<
  BottomSheetProps,
  BottomSheetState
> {
  translateY = new Animated.Value(SCREEN_HEIGHT);
  blurOpacity = new Animated.Value(0);
  private currentTranslateY: number = 0;

  constructor(props: BottomSheetProps) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  show = () => {
    this.setState({ visible: true }, () => {
      this.translateY.setValue(SCREEN_HEIGHT);
      this.blurOpacity.setValue(0);

      Animated.parallel([
        Animated.timing(this.translateY, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(this.blurOpacity, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  hide = () => {
    Animated.parallel([
      Animated.timing(this.translateY, {
        toValue: SCREEN_HEIGHT,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(this.blurOpacity, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => {
      this.setState({ visible: false });
    });
  };

  animateTo = (toValue: number) => {
    Animated.timing(this.translateY, {
      toValue,
      duration: 200,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  onGestureEvent = (event: GestureEvent<PanGestureHandlerEventPayload>) => {
    const translationY = event.nativeEvent.translationY;

    if (translationY > 0) {
      this.currentTranslateY = translationY;
      this.translateY.setValue(translationY);
    }
  };

  onHandlerStateChange = (event: PanGestureHandlerStateChangeEvent) => {
    const { translationY } = event.nativeEvent;

    if (translationY > 100) {
      this.hide();
    } else {
      this.animateTo(0);
    }

    this.currentTranslateY = 0;
  };

  render() {
    const { children, style, type = "content" } = this.props;
    const { visible } = this.state;

    if (!visible) return null;

    return (
      <View style={styles.wrapper} pointerEvents="box-none">
        {/* BLUR BACKGROUND */}
        <Animated.View
          style={[styles.blurPressable, { opacity: this.blurOpacity }]}
        >
          <Pressable style={styles.blurPressable} onPress={this.hide}>
            <BlurView
              intensity={70}
              tint="dark"
              experimentalBlurMethod="dimezisBlurView"
              style={styles.blur}
            />
          </Pressable>
        </Animated.View>

        {/* SHEET */}
        <Animated.View
          style={[
            styles.sheet,
            type === "full" && styles.fullSheet,
            style,
            { transform: [{ translateY: this.translateY }] },
          ]}
        >
          <PanGestureHandler
            onGestureEvent={this.onGestureEvent}
            onHandlerStateChange={this.onHandlerStateChange}
          >
            <View style={styles.hintWrapper}>
              <View style={styles.hint} />
            </View>
          </PanGestureHandler>

          <View style={styles.content}>{children}</View>
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  blurPressable: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
  },
  blur: {
    ...StyleSheet.absoluteFillObject,
  },
  hintWrapper: {
    height: 20,
    width: "100%",
    paddingTop: spacing[2],
    alignItems: "center",
    zIndex: 3,
  },
  hint: {
    backgroundColor: colors.neutral[70],
    height: 4,
    width: 56,
    borderRadius: borderRadius.lg,
  },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.base.white,
    borderTopLeftRadius: borderRadius["2xl"],
    borderTopRightRadius: borderRadius["2xl"],
    zIndex: 3,
  },
  content: {
    padding: spacing[4],
    paddingBottom: spacing[9],
  },
  fullSheet: {
    top: 0,
    bottom: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
});
