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
  useGlobalTheme,
} from "./src/reducers/GlobalContext";
import { useEffect, useRef, useState } from "react";
import sentryInit from "./src/sentry/sentryInit";
import * as Sentry from "sentry-expo";
import * as Notifications from "expo-notifications";
import setNotificationHandler from "./src/utils/setNotificationHandler";
import registerForPushNotificationsAsync from "./src/utils/registerForPushNotificationsAsync";

setNotificationHandler();

function App() {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    sentryInit();

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
export default Sentry.Native.wrap(App);

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
