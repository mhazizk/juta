import Purchases from "react-native-purchases";
import configureRevenueCat from "./configureRevenueCat";
import getSubscriptionLimit from "../../features/subscription/logic/getSubscriptionLimit";
import SUBSCRIPTION_LIMIT from "../../features/subscription/model/subscriptionLimit";

/**
 * Listen subscription status from RevenueCat
 *
 * @param globalSubscriptionFeatures - Global subscription features state
 * @param appSettings - App settings state
 * @param userAccount - User account state
 * @param callback - Callback function
 * @returns
 */
const listenSubscriptionStatus = ({
  globalSubscriptionFeatures,
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
          showSecondaryCurrency: getSubscriptionLimit({
            globalSubscriptionFeatures,
            subscriptionPlan: userAccount?.subscription.plan,
            subscriptionLimit: SUBSCRIPTION_LIMIT.SECONDARY_CURRENCY,
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