import { Platform } from "react-native";
import Purchases from "react-native-purchases";
import env from "../../config/env";

const configureRevenueCat = async (uid) => {
  const apiKey =
    Platform.OS == "android"
      ? env.revenueCat.googleApiKey
      : env.revenueCat.appleApiKey;
  return Promise.all([
    Purchases.configure({ apiKey: apiKey, appUserID: uid }),
    Purchases.setDebugLogsEnabled(true),
  ])
    .then(() => {
      return;
    })
    .catch((error) => {
      console.log(JSON.stringify({ error }, null, 2));
    });
};

export default configureRevenueCat;
