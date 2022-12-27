import {
  SafeAreaView,
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

export default function App() {
  // const { appSettings, dispatchAppSettings } = useGlobalAppSettings();
  const dark = "dark";
  return (
    <>
      {
        // appSettings?.theme?.id !== 'dark' &&
        dark !== "dark" && (
          <GlobalStateProvider>
            <NavigationContainer>
              <RootStack />
            </NavigationContainer>
          </GlobalStateProvider>
        )
      }

      {
        // appSettings?.theme?.id === 'dark' &&
        dark === "dark" && (
          <GlobalStateProvider>
            <NavigationContainer theme={DarkTheme}>
              <RootStack />
            </NavigationContainer>
          </GlobalStateProvider>
        )
      }
    </>
  );
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
