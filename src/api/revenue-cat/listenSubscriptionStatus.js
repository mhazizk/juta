import Purchases from "react-native-purchases";
import configureRevenueCat from "./configureRevenueCat";
import getFeatureLimit from "../../features/subscription/logic/getFeatureLimit";
import FEATURE_NAME from "../../features/subscription/model/featureName";

/**
 * Listen subscription status from RevenueCat
 *
 * @param globalFeatureSwitch - Global subscription features state
 * @param appSettings - App settings state
 * @param userAccount - User account state
 * @param callback - Callback function
 * @returns
 */
const listenSubscriptionStatus = ({
  globalFeatureSwitch,
  appSettings,
  userAccount,
  callback,
}) => {
  configureRevenueCat(userAccount?.uid);
  return Purchases.addCustomerInfoUpdateListener(async (customerInfo) => {
    const existingActiveSubscriptionPlan = userAccount?.subscription.plan;
    const newActiveSubscriptionPlan =
      customerInfo?.activeSubscriptions.length > 0 ? "premium" : "free";

    const isBothActiveSubscriptionPlanSame =
      existingActiveSubscriptionPlan === newActiveSubscriptionPlan;

    if (!isBothActiveSubscriptionPlanSame) {
      const modifiedUserAccount = {
        ...userAccount,
        subscription: {
          ...userAccount?.subscription,
          plan: newActiveSubscriptionPlan,
        },
        _timestamps: {
          ...userAccount?._timestamps,
          updated_at: Date.now(),
          updated_by: userAccount?.uid,
        },
      };
      const modifiedAppSettings = {
        ...appSettings,
        logbookSettings: {
          ...appSettings?.logbookSettings,
          showSecondaryCurrency: getFeatureLimit({
            globalFeatureSwitch,
            subscriptionPlan: userAccount?.subscription.plan,
            featureName: FEATURE_NAME.SECONDARY_CURRENCY,
          }),
        },
      };
      callback({
        newUserAccount: modifiedUserAccount,
        newAppSettings: modifiedAppSettings,
      });
    }
  });
};

export default listenSubscriptionStatus;
