import { ActivityIndicator, View } from "react-native";
import { useGlobalAppSettings } from "../reducers/GlobalContext";
import { TextPrimary } from "./Text";
import LottieView from "lottie-react-native";

const Loading = ({ size, lottie }) => {
  const { appSettings, dispatchAppSettings } = useGlobalAppSettings();

  return (
    <>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          position: lottie ? "absolute" : "relative",
        }}
      >
        {!lottie && (
          <ActivityIndicator
            size={size || 48}
            color={appSettings.theme.style.colors.primary}
          />
        )}
        {lottie && (
          <LottieView
            autoPlay
            resizeMode="cover"
            source={require("../assets/animation/loading-money.json")}
            // source={require("../assets/animation/wave.json")}
            style={{
              position: "absolute",
              width: size,
              height: size,
            }}
          />
        )}
        {/* <TextPrimary label="Loading..." /> */}
      </View>
    </>
  );
};

export default Loading;
