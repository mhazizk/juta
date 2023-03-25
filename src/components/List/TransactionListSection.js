import { View } from "react-native";
import Animated from "react-native-reanimated";
import {
  useGlobalAppSettings,
  useGlobalTheme,
} from "../../reducers/GlobalContext";
import * as utils from "../../utils";
import { TextPrimary } from "../Text";

const TransactionListSection = ({
  enteringAnimation = null,
  //   isSingleItem = false,
  isFirstItem = false,
  isLastItem = false,
  noMargin,
  marginTop,
  marginBottom = 8,
  children,
  backgroundColor = null,
}) => {
  const { appSettings } = useGlobalAppSettings();
  const { globalTheme } = useGlobalTheme();
  const isSingleItem = isFirstItem && isLastItem;
  switch (true) {
    case isFirstItem && isSingleItem:
      return (
        <Animated.View
          entering={enteringAnimation}
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
              utils.hexToRgb({
                hex: globalTheme.colors.listSection,
                opacity: 0.07,
              }),
          }}
        >
          {children}
        </Animated.View>
      );
    case isFirstItem:
      return (
        <Animated.View
          entering={enteringAnimation}
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
              utils.hexToRgb({
                hex: globalTheme.colors.listSection,
                opacity: 0.07,
              }),
          }}
        >
          {children}
        </Animated.View>
      );
    case isLastItem:
      return (
        <Animated.View
          entering={enteringAnimation}
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
              utils.hexToRgb({
                hex: globalTheme.colors.listSection,
                opacity: 0.07,
              }),
          }}
        >
          {children}
        </Animated.View>
      );
    default:
      return (
        <Animated.View
          entering={enteringAnimation}
          style={{
            width: "100%",
            overflow: "hidden",
            marginHorizontal: 16,
            backgroundColor:
              backgroundColor ||
              utils.hexToRgb({
                hex: globalTheme.colors.listSection,
                opacity: 0.07,
              }),
          }}
        >
          {children}
        </Animated.View>
      );
  }
};

export default TransactionListSection;
