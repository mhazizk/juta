import { useState } from "react";
import { View } from "react-native";
import { useGlobalAppSettings } from "../../reducers/GlobalContext";
import * as utils from "../../utils";

const DashboardTourScreen = ({ navigation }) => {
  const { appSettings } = useGlobalAppSettings();
  const [dashboardComponentToShow, setDashboardComponentToShow] = useState([
    "expense",
    "my budget",
    "recent transaction",
    "dashboard tab",
  ]);
  // TODO : Create tutorial screen with hole view
  return (
    <>
      <View
        style={{
          height: "100%",
          backgroundColor: utils.HexToRgb({
            hex: appSettings.theme.style.colors.background,
            opacity: 0.8,
          }),
        }}
      >
        <View
          style={{
            position: "absolute",
            zIndex: 1,
            bottom: 0,
            height: 100,
            width: 100,
            borderRadius: 100 / 2,
            backgroundColor: utils.HexToRgb({
              hex: appSettings.theme.style.colors.primary,
              opacity: 0.8,
            }),
          }}
        />
      </View>
    </>
  );
};

export default DashboardTourScreen;
