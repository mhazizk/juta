import { Platform } from "react-native";
import Purchases from "react-native-purchases";
import env from "../../config/env";
import SECRET_KEYS from "../../constants/secretManager";
import getSecretFromCloudFunctions from "../firebase/getSecretFromCloudFunctions";

const getRevenueCatOfferings = async () => {
  const apiKey =
    Platform.OS == "android"
      ? await getSecretFromCloudFunctions(SECRET_KEYS.REVENUE_CAT_GOOGLE_API_KEY)
      : null; // Apple API key for RevenueCat
  return Promise.all([
    Purchases.configure({ apiKey: apiKey }),
    Purchases.setDebugLogsEnabled(true),
  ])
    .then(async () => {
      return await Purchases.getOfferings();
    })
    .catch((error) => {
      console.log(JSON.stringify(error));
    });
};

export default getRevenueCatOfferings;

// Purchases.getOfferings().then((offerings) =>
//   offerings.current.availablePackages.map((pkg) => pkg.product)
// );
