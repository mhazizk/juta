import { View } from "react-native";
import {
  useGlobalAppSettings,
  useGlobalTheme,
} from "../../reducers/GlobalContext";
import * as utils from "../../utils";

const ListSection = ({ noMargin, marginTop, children, backgroundColor }) => {
  const { appSettings } = useGlobalAppSettings();
  const { globalTheme } = useGlobalTheme();
  return (
    <>
      <View
        style={{
          width: "100%",
          marginTop: marginTop ? marginTop : 0,
          marginBottom: noMargin ? 0 : 16,
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
    </>
  );
};

export default ListSection;
