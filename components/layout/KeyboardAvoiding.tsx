import { GlobalStyles } from "@/themes/common";
import { KeyboardAvoidingProps } from "@/types";
import React, { FC, memo } from "react";
import {
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

const KeyboardAvoiding: FC<KeyboardAvoidingProps> = ({ children, style }) => {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.wrapper}>
        <KeyboardAwareScrollView
          contentContainerStyle={[styles.scrollContent, style]}
          style={styles.container}
        >
          {children}
        </KeyboardAwareScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default memo(KeyboardAvoiding);

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    ...GlobalStyles.flex,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
