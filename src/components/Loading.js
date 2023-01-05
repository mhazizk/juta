import { ActivityIndicator, View } from "react-native";
import { useGlobalAppSettings } from "../reducers/GlobalContext";
import { TextPrimary } from "./Text";

const Loading = ({ size }) => {
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();

  return (
    <>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator
          size={size || 48}
          color={appSettings.theme.style.colors.primary}
        />
        {/* <TextPrimary label="Loading..." /> */}
      </View>
    </>
  );
};

export default Loading;
