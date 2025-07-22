export interface TabSwitchProps {
  active: "Login" | "Register";
  onTabChange: (value: "Login" | "Register") => void;
}

export interface AuthPagerProps {
  active: "Login" | "Register";
  onSwipeChange: (val: "Login" | "Register") => void;
  isFromUserTabChange: boolean;
}
