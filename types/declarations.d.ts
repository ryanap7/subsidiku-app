declare module "*.svg" {
  import { FC } from "react";
  import { SvgProps } from "react-native-svg";
  const content: FC<SvgProps>;
  export default content;
}

declare module "*.png" {
  const value: any;
  export default value;
}
