import { View } from "react-native";
import IonIcons from "react-native-vector-icons/Ionicons";
import {
  useGlobalAppSettings,
  useGlobalTheme,
} from "../../reducers/GlobalContext";
import { TextPrimary } from "../Text";

const SettingsHeaderList = ({ label, iconName }) => {
  const { appSettings } = useGlobalAppSettings();
  const { globalTheme } = useGlobalTheme();
  return (
    <View
      style={{
        width: "100%",
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      {iconName && (
        <IonIcons
          name={iconName}
          color={globalTheme.text.textPrimary.color}
          size={18}
          style={{
            marginRight: 16,
          }}
        />
      )}
      <TextPrimary
        label={label}
        style={{
          marginRight: 16,
        }}
      />
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: globalTheme.colors.secondary,
        }}
      />
    </View>
  );
};

export default SettingsHeaderList;
