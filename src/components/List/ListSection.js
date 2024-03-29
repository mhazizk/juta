import { View } from "react-native";
import Animated from "react-native-reanimated";
import {
  useGlobalAppSettings,
  useGlobalTheme,
} from "../../reducers/GlobalContext";
import * as utils from "../../utils";

const ListSection = ({
  enteringAnimation = null,
  noMargin,
  marginTop,
  marginBottom = 16,
  children,
  backgroundColor = null,
  backgroundOpacity = 0.07,
}) => {
  const { appSettings } = useGlobalAppSettings();
  const { globalTheme } = useGlobalTheme();
  return (
    <>
      <Animated.View
        entering={enteringAnimation}
        style={{
          width: "100%",
          marginTop: marginTop ? marginTop : 0,
          marginBottom: noMargin ? 0 : marginBottom,
          overflow: "hidden",
          borderRadius: 16,
          marginHorizontal: 16,
          backgroundColor: backgroundOpacity
            ? utils.hexToRgb({
                hex: backgroundColor || globalTheme.colors.listSection,
                opacity: backgroundOpacity,
              })
            : backgroundColor,
        }}
      >
        {children}
      </Animated.View>
    </>
  );
};

export default ListSection;
