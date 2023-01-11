import { View } from "react-native";
import { useGlobalAppSettings } from "../../reducers/GlobalContext";
import * as utils from "../../utils";

const ListSection = ({ noMargin, marginTop, children }) => {
  const { appSettings } = useGlobalAppSettings();
  return (
    <>
      <View
        style={{
          marginTop: marginTop ? marginTop : 0,
          marginBottom: noMargin ? 0 : 16,
          overflow: "hidden",
          borderRadius: 16,
          marginHorizontal: 16,
          backgroundColor: utils.HexToRgb({
            hex: appSettings.theme.style.colors.foreground,
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
