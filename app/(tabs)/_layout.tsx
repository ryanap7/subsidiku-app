import TabBarButton from "@/components/layout/BottomNavigation/TabBarButton";
import { colors } from "@/themes";
import { Ionicons } from "@expo/vector-icons";
import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import { Tabs } from "expo-router";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const renderTabBarButton = (props: BottomTabBarButtonProps) => (
  <TabBarButton {...props} />
);

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        animation: "shift",
        freezeOnBlur: true,
        headerShown: false,
        tabBarActiveTintColor: colors.primary[500],
        tabBarInactiveTintColor: colors.neutral[50],
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 74 + insets.bottom,
          backgroundColor: colors.base.white,
          paddingTop: 12,
          paddingBottom: insets.bottom,
          borderTopWidth: 0,
        },
        tabBarButton: renderTabBarButton,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="wallet-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="assistance"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="pricetags-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
