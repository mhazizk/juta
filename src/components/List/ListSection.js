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
          backgroundColor: utils.hexToRgb({
            hex: backgroundColor || globalTheme.colors.listSection,
            opacity: 0.07,
          }),
        }}
      >
        {children}
      </Animated.View>
    </>
  );
};

export default ListSection;
