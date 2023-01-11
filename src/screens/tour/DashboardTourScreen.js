import { useState } from "react";
import { Dimensions, View } from "react-native";
import { Circle, Defs, Mask, Rect, Svg } from "react-native-svg";
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
          // zIndex: 1,
          height: "100%",
          backgroundColor: utils.HexToRgb({
            hex: appSettings.theme.style.colors.background,
            opacity: 0.5,
          }),
        }}
      >
        <Svg height="100%" width="100%">
          <Defs>
            <Mask id="mask" x="0" y="0" height="100%" width="100%">
              <Rect height="100%" width="100%" fill="white" opacity={0.8} />
              <Rect
                x={Dimensions.get("window").width / 2 - 150 / 2}
                y={Dimensions.get("window").height / 2 - 150 / 2}
                rx="50"
                ry="50"
                width={150}
                height={150}
                stroke="white"
                strokeWidth="5"
                fill-opacity="0"
              />
            </Mask>
          </Defs>
          <Circle cx="50%" cy="50%" r="48" fill="white" mask="url(#mask)" />
          {/* <Rect height="100%" width="100%" mask="url(#mask)" fill="white" /> */}
        </Svg>
      </View>
      <View
        style={{
          position: "absolute",
          zIndex: 2,
          bottom: 0,
          height: 100,
          width: 100,
          borderRadius: 100 / 2,
          backgroundColor: "transparent",
          opacity: 0.5,
        }}
      />
    </>
  );
};

export default DashboardTourScreen;
