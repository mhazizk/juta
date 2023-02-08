import { ActivityIndicator, View } from "react-native";
import {
  useGlobalAppSettings,
  useGlobalTheme,
} from "../reducers/GlobalContext";
import { TextPrimary } from "./Text";
import LottieView from "lottie-react-native";

const Loading = ({ size, lottie, loadingText = null }) => {
  const { appSettings } = useGlobalAppSettings();
  const { globalTheme } = useGlobalTheme();

  return (
    <>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          position: lottie ? "absolute" : "relative",
          padding: 16,
        }}
      >
        {!lottie && (
          <ActivityIndicator
            size={size || 48}
            color={globalTheme.colors.primary}
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
        {loadingText && <TextPrimary label={loadingText} />}
      </View>
    </>
  );
};

export default Loading;
