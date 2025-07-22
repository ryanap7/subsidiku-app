export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  9: 36,
  10: 64,
} as const;

export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  "2xl": 36,
  "3xl": 42,
  rounded: 9999,
} as const;

export const fontSize = {
  xs: 10,
  sm: 12,
  md: 14,
  base: 16,
  lg: 18,
  xl: 20,
  "2xl": 24,
  "3xl": 28,
  "4xl": 32,
} as const;

export const typography = {
  regular: "Poppins-Regular",
  medium: "Poppins-Medium",
  semibold: "Poppins-SemiBold",
} as const;

export const colors = {
  base: {
    white: "#FFFFFF",
    black: "#030003",
    background: "#F3F5F6",
  },
  neutral: {
    0: "#F2F2F5",
    10: "#E3E3E8",
    20: "#CFCFCF",
    30: "#BEBEC4",
    40: "#9D9DA1",
    50: "#8B8B8C",
    60: "#717173",
    70: "#575758",
    80: "#3E3E40",
    90: "#242426",
  },
  overlay: {
    5: "#0E0E100D",
    10: "#0E0E101A",
  },
  primary: {
    50: "#F4F3FF",
    100: "#EBE9FE",
    200: "#D9D6FE",
    300: "#BDB4FE",
    400: "#9B8AFB",
    500: "#7A5AF8",
    600: "#6938EF",
    700: "#5925DC",
    800: "#4A1FB8",
    900: "#3E1C96",
  },
  success: {
    0: "#E7F4ED",
    50: "#D1ECE0",
    100: "#A6DAC4",
    200: "#7CC8A9",
    300: "#52B58D",
    400: "#28A371",
    500: "#0E8A58",
    600: "#0B6F46",
    700: "#085533",
    800: "#063B22",
    900: "#042110",
  },
  warning: {
    0: "#FFF8EA",
  },
  error: {
    0: "#FBEAEA",
    50: "#F8D4D4",
    100: "#F1A8A8",
    200: "#EA7D7D",
    300: "#E35151",
    400: "#DB2626",
    500: "#C42020",
    600: "#A81B1B",
    700: "#8C1616",
    800: "#701111",
    900: "#540C0C",
  },
} as const;

export const theme = {
  spacing,
  fontSize,
  borderRadius,
  colors,
  typography,
} as const;
