import Purchases from "react-native-purchases";
import REDUCER_ACTIONS from "../../reducers/reducer.action";
import firestore from "../firebase/firestore";
import FIRESTORE_COLLECTION_NAMES from "../firebase/firestoreCollectionNames";
import configureRevenueCat from "./configureRevenueCat";

const updateSubscriptionStatus = ({
  appSettings,
  dispatchAppSettings,
  userAccount,
  dispatchUserAccount,
}) => {
  configureRevenueCat();
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
          ...userAccount.subscription,
          plan: newActiveSubscriptionPlan,
        },
        _timestamps: {
          ...userAccount._timestamps,
          updated_at: Date.now(),
          updated_by: userAccount.uid,
        },
      };
      dispatchUserAccount({
        type: REDUCER_ACTIONS.USER_ACCOUNT.SET_MULTI_ACTIONS,
        payload: modifiedUserAccount,
      });
      setTimeout(async () => {
        await firestore.setData(
          FIRESTORE_COLLECTION_NAMES.USERS,
          userAccount.uid,
          modifiedUserAccount
        );
      }, 5000);
    }
  });
};

export default updateSubscriptionStatus;
