import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import { Pressable } from "react-native";

const TabBarButton = (props: BottomTabBarButtonProps) => {
  return (
    <Pressable
      onPress={props.onPress}
      onLongPress={props.onLongPress}
      testID={props.testID}
      style={(pressableState) => [
        props.style,
        { opacity: pressableState.pressed ? 1 : 1 },
      ]}
      android_ripple={{ color: "transparent" }}
    >
      {props.children}
    </Pressable>
  );
};

export default TabBarButton;
