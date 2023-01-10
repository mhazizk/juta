import { View } from "react-native";
import { useGlobalAppSettings } from "../../reducers/GlobalContext";
import * as utils from "../../utils";

const SettingsSection = ({ noMargin, children }) => {
  const { appSettings } = useGlobalAppSettings();
  return (
    <>
      <View
        style={{
          marginBottom: noMargin ? 0 : 16,
          overflow: "hidden",
          borderRadius: 16,
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

export default SettingsSection;
