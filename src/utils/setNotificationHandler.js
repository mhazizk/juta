import * as Notifications from "expo-notifications";

/**
 * Set notification handler for expo-notifications
 * 
 * Should be called before `App.js` is rendered
 * 
 * Call this function outside of `App()` to avoid re-rendering
 * 
 * Example :
 * ```
 * setNotificationHandler()
 * App()
 * ```
 * 
 * @returns 
 */
const setNotificationHandler = () => {
  return Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
};

export default setNotificationHandler;