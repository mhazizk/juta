import { Platform } from "react-native";
import Purchases from "react-native-purchases";
import env from "../../config/env";

const getRevenueCatOfferings = async () => {
  const apiKey =
    Platform.OS == "android"
      ? env.revenueCat.googleApiKey
      : env.revenueCat.appleApiKey;
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

Purchases.getOfferings().then((offerings) =>
  offerings.current.availablePackages.map((pkg) => pkg.product)
);
