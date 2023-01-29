import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  // StatusBar,
} from "react-native";
import "react-native-gesture-handler";
import RootStack from "./src/navigations/RootStack";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import {
  GlobalStateProvider,
  useGlobalAppSettings,
} from "./src/reducers/GlobalContext";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useRef } from "react";
import sentryInit from "./src/sentry/sentryInit";
// import * as Sentry from "@sentry/react-native";
import * as Sentry from "sentry-expo";
export default Sentry.Native.wrap(App);

function App() {
  // const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
  const dark = "dark";
  const routingInstrumentation =
    new Sentry.Native.ReactNavigationInstrumentation();
  const navigationRef = useRef();
  useEffect(() => {
    sentryInit();
  }, []);

  try {
    return (
      <>
        <GlobalStateProvider>
          <NavigationContainer
            theme={DarkTheme}
            onReady={() => {
              routingInstrumentation.registerNavigationContainer(navigationRef);
            }}
          >
            <RootStack />
          </NavigationContainer>
        </GlobalStateProvider>
      </>
    );
  } catch (error) {
    Sentry.Native.nativeCrash();
  }
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//     paddingTop: StatusBar.currentHeight,
//   },
// });
