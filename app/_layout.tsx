import { Container } from "@/components";
import { BottomSheetProvider } from "@/context/BottomSheetContext";
import { GlobalStyles } from "@/themes/common";
import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import "react-native-reanimated";
import Toast from "react-native-toast-message";

export default function RootLayout() {
  const [loaded] = useFonts({
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
  });

  if (!loaded) return null;

  return (
    <GestureHandlerRootView style={GlobalStyles.flex}>
      <KeyboardProvider>
        <BottomSheetProvider>
          <Container>
            <Slot />
            <Toast />
          </Container>
        </BottomSheetProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}
