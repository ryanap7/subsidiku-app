export type Option = {
  label: string;
  value: string;
};

export type SelectProps = {
  label?: string;
  value?: string;
  options: Option[];
  error?: string;
  disabled?: boolean;
  style?: ViewStyle;
  placeholder?: string;
  onChange?: (option: Option) => void;
  testID?: string;
};
