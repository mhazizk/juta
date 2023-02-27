import "expo-dev-client";

import "react-native-gesture-handler";
import RootStack from "./src/navigations/RootStack";
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from "@react-navigation/native";
import {
  GlobalStateProvider, useGlobalTheme
} from "./src/reducers/GlobalContext";
import { useEffect, useRef } from "react";
import sentryInit from "./src/sentry/sentryInit";
import * as Sentry from "sentry-expo";
export default Sentry.Native.wrap(App);
function App() {
  useEffect(() => {
    sentryInit();
  }, []);
  try {
    return (
      <>
        <GlobalStateProvider>
          <ThemeWrapper />
        </GlobalStateProvider>
      </>
    );
  } catch (error) {
    Sentry.Native.nativeCrash();
  }
}

const ThemeWrapper = () => {
  const { globalTheme } = useGlobalTheme();
  const routingInstrumentation =
    new Sentry.Native.ReactNavigationInstrumentation();
  const navigationRef = useRef();
  useEffect(() => {
    console.log({ globalTheme });
  }, [globalTheme]);

  return (
    <NavigationContainer
      theme={
        globalTheme?.identifier?.id?.includes("dark") ? DarkTheme : DefaultTheme
      }
      onReady={() => {
        routingInstrumentation.registerNavigationContainer(navigationRef);
      }}
    >
      <RootStack />
    </NavigationContainer>
  );
};
