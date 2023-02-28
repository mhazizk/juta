import { Platform } from "react-native";
import Purchases from "react-native-purchases";
import env from "../../config/env";
import SECRET_KEYS from "../../constants/secretManager";
import getSecretFromCloudFunctions from "../firebase/getSecretFromCloudFunctions";

const configureRevenueCat = async (uid) => {
  const apiKey =
    Platform.OS == "android"
      ? await getSecretFromCloudFunctions(
          SECRET_KEYS.REVENUE_CAT_GOOGLE_API_KEY
        )
      : env.REVENUE_CAT.appleApiKey;
  return Promise.all([Purchases.setDebugLogsEnabled(true)])
    .then(() => {
      Purchases.configure({ apiKey: apiKey, appUserID: uid });
      return Promise.resolve();
    })
    .catch((error) => {
      console.log(JSON.stringify({ error }, null, 2));
      return Promise.reject(error);
    });
};

export default configureRevenueCat;
