import Purchases from "react-native-purchases";
import REDUCER_ACTIONS from "../../reducers/reducer.action";
import firestore from "../firebase/firestore";
import FIRESTORE_COLLECTION_NAMES from "../firebase/firestoreCollectionNames";
import configureRevenueCat from "./configureRevenueCat";

const updateSubscriptionStatus = (userAccount, dispatchUserAccount) => {
  configureRevenueCat();
  return Purchases.addCustomerInfoUpdateListener(async (customerInfo) => {
    // console.log(customerInfo.activeSubscriptions);
    const existingActiveSubscriptions =
      userAccount?.subscription?.activeSubscriptions;
    const newActiveSubscriptions = customerInfo.activeSubscriptions;

    const addNewActiveSubscription = newActiveSubscriptions.filter((subs) => {
      return !existingActiveSubscriptions.includes(subs);
    });
    const removeExistingActiveSubscription = existingActiveSubscriptions.filter(
      (subs) => {
        return !newActiveSubscriptions.includes(subs);
      }
    );
    let data = userAccount;
    switch (true) {
      case addNewActiveSubscription.length > 0:
        console.log("addNewActiveSubscription");
        // data = {
        //   ...userAccount,
        //   subscription: {
        //     ...userAccount.subscription,
        //     activeSubscriptions: [
        //       ...userAccount.subscription.activeSubscriptions,
        //       ...addNewActiveSubscription,
        //     ],
        //   },
        //   _timestamps: {
        //     ...userAccount._timestamps,
        //     updated_at: Date.now(),
        //     updated_by: userAccount.uid,
        //   },
        // };
        // dispatchUserAccount({
        //   type: REDUCER_ACTIONS.USER_ACCOUNT.SET_MULTI_ACTIONS,
        //   payload: data,
        // });
        // setTimeout(async () => {
        //   await firestore.setData(
        //     FIRESTORE_COLLECTION_NAMES.USERS,
        //     userAccount.uid,
        //     data
        //   );
        // }, 5000);

        break;
      case removeExistingActiveSubscription.length > 0:
        console.log("removeExistingActiveSubscription");

        // data = {
        //   ...userAccount,
        //   subscription: {
        //     ...userAccount.subscription,
        //     activeSubscriptions: [
        //       ...userAccount.subscription.activeSubscriptions.filter((subs) => {
        //         return !removeExistingActiveSubscription.includes(subs);
        //       }),
        //     ],
        //   },
        //   _timestamps: {
        //     ...userAccount._timestamps,
        //     updated_at: Date.now(),
        //     updated_by: userAccount.uid,
        //   },
        // };
        // dispatchUserAccount({
        //   type: REDUCER_ACTIONS.USER_ACCOUNT.SET_MULTI_ACTIONS,
        //   payload: data,
        // });
        // setTimeout(async () => {
        //   await firestore.setData(
        //     FIRESTORE_COLLECTION_NAMES.USERS,
        //     userAccount.uid,
        //     data
        //   );
        // }, 5000);

        break;
    }
    // console.log({
    //   existingSubscriptionStatus,
    //   newSubscriptionStatus,
    //   latestExpirationDate,
    // });
    // console.log({ allPurchaseDate });
    // console.log(customerInfo.entitlements.active);
    // console.log("activesubs :" + customerInfo.activeSubscriptions);
  });
};

export default updateSubscriptionStatus;
