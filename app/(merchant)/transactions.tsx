import { Button, Gap } from "@/components";
import { GlobalStyles } from "@/themes/common";
import { router } from "expo-router";
import React from "react";
import { View } from "react-native";

const TransactionScreen = () => {
  return (
    <View style={[GlobalStyles.flex, GlobalStyles.center]}>
      <View>
        <Button
          title="Scan QR Code Pengguna"
          onPress={() => {
            router.push("/(merchant)/redeem");
          }}
        />
        <Gap vertical={4} />
        <Button
          title="Scan KTP Pengguna"
          onPress={() => {
            router.push("/(merchant)/redeem-ktp");
          }}
        />
        <Gap vertical={4} />
        <Button
          title="Tap KTP"
          onPress={() => {
            router.push("/(merchant)/tap-ktp");
          }}
        />
        <Gap vertical={4} />
        <Button
          title="Isi Manual"
          onPress={() => {
            router.push("/(merchant)/redeem-manual");
          }}
        />
      </View>
    </View>
  );
};

export default TransactionScreen;
