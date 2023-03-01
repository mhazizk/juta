import React, { useEffect, useRef, useState } from "react";
import CustomScrollView from "../../../shared-components/CustomScrollView";
import { TextPrimary } from "../../../components/Text";
import Entypo from "react-native-vector-icons/Entypo";
import { useGlobalTheme } from "../../../reducers/GlobalContext";
import { AppState } from "react-native";
import isInternetReachable from "../../../utils/isInternetReachable";

const NoInternetScreen = ({ route, navigation }) => {
  const { fromScreen } = route.params;
  const { globalTheme } = useGlobalTheme();
  const [isConnected, setIsConnected] = useState(false);

  const appState = useRef(AppState.currentState);

  useEffect(() => {
    isInternetReachable().then((isConnected) => {
      if (!isConnected) {
        setIsConnected(false);
      } else {
        setIsConnected(true);
      }
    });

    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        isInternetReachable().then((isConnected) => {
          if (!isConnected) {
            setIsConnected(false);
          } else {
            setIsConnected(true);
          }
        });
      }
      appState.current = nextAppState;
      console.log(appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (isConnected) {
      navigation.replace(fromScreen);
    }
  }, [isConnected]);

  return (
    <CustomScrollView
      contentContainerStyle={{
        justifyContent: "center",
      }}
    >
      <Entypo
        name="emoji-sad"
        size={48}
        color={globalTheme.colors.foreground}
        style={{ padding: 16 }}
      />

      <TextPrimary
        label="Uh, oh! Something went wrong"
        style={{
          textAlign: "center",
          fontSize: 20,
          fontWeight: "bold",
        }}
      />
      <TextPrimary
        style={{
          textAlign: "center",
        }}
        label={`It could be that you are not connected to the internet.\nPlease check your internet connection and try again.`}
      />
    </CustomScrollView>
  );
};

export default NoInternetScreen;
