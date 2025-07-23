import { Loader } from "@/components";
import Merchant from "@/components/screens/Assistance/Merchant";
import User from "@/components/screens/Assistance/User";
import { useAuthStore } from "@/stores/authStore";
import { colors } from "@/themes";
import { GlobalStyles } from "@/themes/common";
import React from "react";
import { View } from "react-native";

const AssistanceScreen = () => {
  const { user, role }: any = useAuthStore();

  if (!user) {
    return (
      <View style={[GlobalStyles.flex, GlobalStyles.center]}>
        <Loader />
      </View>
    );
  }

  return (
    <View style={[GlobalStyles.flex, { backgroundColor: colors.base.white }]}>
      {role === "merchant" ? <Merchant /> : <User />}
    </View>
  );
};

export default AssistanceScreen;
