import Purchases from "react-native-purchases";
import REDUCER_ACTIONS from "../../reducers/reducer.action";
import firestore from "../firebase/firestore";
import FIRESTORE_COLLECTION_NAMES from "../firebase/firestoreCollectionNames";
import configureRevenueCat from "./configureRevenueCat";

const updateSubscriptionStatus = (userAccount, dispatchUserAccount) => {
  configureRevenueCat();
  return Purchases.addCustomerInfoUpdateListener(async (customerInfo) => {
    // console.log(customerInfo.activeSubscriptions);
    const existingSubscriptionStatus = userAccount?.subscription?.plan;
    const newSubscriptionStatus =
      customerInfo.activeSubscriptions.length > 0 ? "premium" : "free";
    const allPurchaseDate = customerInfo.allPurchaseDates;
    const latestExpirationDate = new Date(
      customerInfo.latestExpirationDate
    ).getTime();
    // console.log({
    //   existingSubscriptionStatus,
    //   newSubscriptionStatus,
    //   latestExpirationDate,
    // });
    // console.log({ allPurchaseDate });
    // console.log(customerInfo.entitlements.active);
    // console.log("activesubs :" + customerInfo.activeSubscriptions);
    if (existingSubscriptionStatus !== newSubscriptionStatus) {
      const data = {
        ...userAccount,
        subscription: {
          ...userAccount.subscription,
          plan: newSubscriptionStatus,
          expirationDate: latestExpirationDate,
        },
        _timestamps: {
          ...userAccount._timestamps,
          updated_at: Date.now(),
          updated_by: userAccount.uid,
        },
      };
      dispatchUserAccount({
        type: REDUCER_ACTIONS.USER_ACCOUNT.SET_MULTI_ACTIONS,
        payload: data,
      });

      setTimeout(async () => {
        await firestore.setData(
          FIRESTORE_COLLECTION_NAMES.USERS,
          userAccount.uid,
          data
        );
      });
    }
  });
};

export default updateSubscriptionStatus;
