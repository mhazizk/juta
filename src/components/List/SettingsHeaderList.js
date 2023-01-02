import { View } from "react-native";
import IonIcons from "react-native-vector-icons/Ionicons";
import { useGlobalAppSettings } from "../../reducers/GlobalContext";
import { TextPrimary } from "../Text";

const SettingsHeaderList = ({ label, iconName }) => {
  const { appSettings } = useGlobalAppSettings();
  return (
    <View
      style={{
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      {iconName && (
        <IonIcons
          name={iconName}
          color={appSettings.theme.style.colors.primary}
          size={18}
          style={{
            marginRight: 16,
          }}
        />
      )}
      <TextPrimary
        label={label}
        style={{
          color: appSettings.theme.style.colors.primary,
          marginRight: 16,
        }}
      />
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: appSettings.theme.style.colors.secondary,
        }}
      />
    </View>
  );
};

export default SettingsHeaderList;
