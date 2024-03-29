import Purchases from "react-native-purchases";
import configureRevenueCat from "./configureRevenueCat";

/**
 * Get customer info from RevenueCat
 *
 * @returns
 */
const getCustomerInfo = async (uid) => {
  return configureRevenueCat(uid).then(() => {
    return Purchases.getCustomerInfo();
  });
};

export default getCustomerInfo;
