export interface DatePickerProps {
  label?: string;
  value?: string | Date | null;
  error?: string;
  disabled?: boolean;
  style?: ViewStyle;
  placeholder?: string;
  minimumDate?: Date;
  maximumDate?: Date;
  mode?: "date" | "time" | "datetime";
  locale?: string;
  dateFormat?: string;
  testID?: string;
  onChangeText?: (dateString: string) => void;
  onDateChange?: (date: Date | null) => void;
}
