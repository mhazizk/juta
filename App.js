import "expo-dev-client";

import "react-native-gesture-handler";
import RootStack from "./src/navigations/RootStack";
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from "@react-navigation/native";
import {
  GlobalStateProvider,
  useExpoPushToken,
  useGlobalTheme,
} from "./src/reducers/GlobalContext";
import { createContext, useEffect, useRef, useState } from "react";
import sentryInit from "./src/sentry/sentryInit";
import * as Sentry from "sentry-expo";
import * as Notifications from "expo-notifications";
import setNotificationHandler from "./src/utils/setNotificationHandler";
import registerForPushNotificationsAsync from "./src/utils/registerForPushNotificationsAsync";
import {
  Alert,
  AppState,
  KeyboardAvoidingView,
  LogBox,
  Platform,
  StatusBar,
} from "react-native";
import { requestTrackingPermissionsAsync } from "expo-tracking-transparency";

setNotificationHandler();

function App() {
  const [isGrantedToTrack, setIsGrantedTrack] = useState(false);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    if (__DEV__) {
      LogBox.ignoreAllLogs();
    }
    sentryInit();
    if (Platform.OS === "ios") {
      requestiosTrackingPermissionsAsync(isGrantedToTrack).then((isGranted) => {
        setIsGrantedTrack(isGranted);
      });
    }

    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        requestiosTrackingPermissionsAsync(isGrantedToTrack).then(
          (isGranted) => {
            setIsGrantedTrack(isGranted);
          }
        );
      }
      appState.current = nextAppState;
      console.log(appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const requestiosTrackingPermissionsAsync = async (isGranted) => {
    if (!isGranted) {
      const { status } = await requestTrackingPermissionsAsync(isGranted);
      if (status === "granted") {
        return true;
      } else {
        trackingAlert(isGranted);
      }
    }
  };

  const trackingAlert = (isGranted) => {
    return Alert.alert(
      "Tracking Permission",
      "Please allow tracking permission to continue using this app",
      [
        {
          text: "Cancel",
          onPress: () => {
            return trackingAlert(isGranted);
          },
        },
        {
          text: "OK",
          onPress: () => {
            return requestiosTrackingPermissionsAsync(isGranted);
          },
        },
      ]
    );
  };

  try {
    return (
      <>
        <GlobalStateProvider>
          <GlobalStateWrapper />
        </GlobalStateProvider>
      </>
    );
  } catch (error) {
    Sentry.Native.nativeCrash();
  }
}
export default Sentry.Native.wrap(App);

const GlobalStateWrapper = () => {
  const { globalTheme } = useGlobalTheme();
  const { expoPushToken, setExpoPushToken } = useExpoPushToken();
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  const routingInstrumentation =
    new Sentry.Native.ReactNavigationInstrumentation();
  const navigationRef = useRef();
  useEffect(() => {
    console.log({ globalTheme });
  }, [globalTheme]);

  useEffect(() => {
    // Register for push notifications and listen for notifications
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        // Event handler when user taps on notification
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "position"}
        contentContainerStyle={{
          backgroundColor: globalTheme.colors.background,
          flex: 1,
        }}
        style={{
          backgroundColor: globalTheme.colors.background,
          flex: 1,
        }}
      >
        <NavigationContainer
          theme={
            globalTheme?.identifier?.id?.includes("dark")
              ? DarkTheme
              : DefaultTheme
          }
          onReady={() => {
            routingInstrumentation.registerNavigationContainer(navigationRef);
          }}
        >
          <StatusBar
            animated={true}
            barStyle={
              globalTheme.identifier.id.includes("dark")
                ? "light-content"
                : "dark-content"
            }
            backgroundColor={globalTheme.colors.header}
          />
          <RootStack />
        </NavigationContainer>
      </KeyboardAvoidingView>
    </>
  );
};
