import { borderRadius, colors, spacing } from "@/themes";
import { GlobalStyles } from "@/themes/common";
import { ModalProps, ModalState } from "@/types";
import { BlurView } from "expo-blur";
import React, { PureComponent } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  PanResponder,
  PanResponderInstance,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

export default class Modal extends PureComponent<ModalProps, ModalState> {
  opacity = new Animated.Value(0);
  scale = new Animated.Value(0.9);
  panResponder: PanResponderInstance;

  constructor(props: ModalProps) {
    super(props);
    this.state = {
      visible: false,
    };

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => false,
    });
  }

  show = () => {
    this.setState({ visible: true }, () => {
      Animated.parallel([
        Animated.timing(this.opacity, {
          toValue: 1,
          duration: 250,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.spring(this.scale, {
          toValue: 1,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  hide = () => {
    Animated.parallel([
      Animated.timing(this.opacity, {
        toValue: 0,
        duration: 200,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(this.scale, {
        toValue: 0.9,
        duration: 200,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => {
      this.setState({ visible: false });
    });
  };

  render() {
    const { children, style } = this.props;
    const { visible } = this.state;

    if (!visible) return null;

    return (
      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        <Animated.View
          style={[StyleSheet.absoluteFill, { opacity: this.opacity }]}
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={this.hide}>
            <BlurView
              intensity={70}
              tint="dark"
              experimentalBlurMethod="dimezisBlurView"
              style={StyleSheet.absoluteFillObject}
            />
          </Pressable>
        </Animated.View>

        <View style={styles.modalWrapper} pointerEvents="box-none">
          <Animated.View
            {...this.panResponder.panHandlers}
            style={[
              styles.modal,
              style,
              {
                opacity: this.opacity,
                transform: [{ scale: this.scale }],
              },
            ]}
          >
            {children}
          </Animated.View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modalWrapper: {
    ...GlobalStyles.flex,
    ...GlobalStyles.center,
  },
  modal: {
    width: SCREEN_WIDTH - 32,
    maxHeight: SCREEN_HEIGHT * 0.9,
    backgroundColor: colors.base.white,
    padding: spacing[6],
    borderRadius: borderRadius["3xl"],
  },
});
