import { View } from "react-native";
import {
  useGlobalAppSettings,
  useGlobalTheme,
} from "../../reducers/GlobalContext";
import * as utils from "../../utils";
import { TextPrimary } from "../Text";

const TransactionListSection = ({
  //   isSingleItem = false,
  isFirstItem = false,
  isLastItem = false,
  noMargin,
  marginTop,
  marginBottom = 8,
  children,
  backgroundColor,
}) => {
  const { appSettings } = useGlobalAppSettings();
  const { globalTheme } = useGlobalTheme();
  const isSingleItem = isFirstItem && isLastItem;
  switch (true) {
    case isFirstItem && isSingleItem:
      return (
        <View
          style={{
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: noMargin ? 0 : marginBottom,
            overflow: "hidden",
            borderRadius: 16,
            marginHorizontal: 16,
            backgroundColor:
              backgroundColor ||
              utils.HexToRgb({
                hex: globalTheme.colors.foreground,
                opacity: 0.07,
              }),
          }}
        >
          {children}
        </View>
      );
    case isFirstItem:
      return (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            marginTop: marginTop ? marginTop : 0,
            overflow: "hidden",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            marginHorizontal: 16,
            backgroundColor:
              backgroundColor ||
              utils.HexToRgb({
                hex: globalTheme.colors.foreground,
                opacity: 0.07,
              }),
          }}
        >
          {children}
        </View>
      );
    case isLastItem:
      return (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            marginBottom: noMargin ? 0 : marginBottom,
            overflow: "hidden",
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
            marginHorizontal: 16,
            backgroundColor:
              backgroundColor ||
              utils.HexToRgb({
                hex: globalTheme.colors.foreground,
                opacity: 0.07,
              }),
          }}
        >
          {children}
        </View>
      );
    default:
      return (
        <View
          style={{
            width: "100%",
            overflow: "hidden",
            marginHorizontal: 16,
            backgroundColor:
              backgroundColor ||
              utils.HexToRgb({
                hex: globalTheme.colors.foreground,
                opacity: 0.07,
              }),
          }}
        >
          {children}
        </View>
      );
  }
};

export default TransactionListSection;
