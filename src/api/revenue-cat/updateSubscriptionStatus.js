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
    const isBothActiveSubscriptionEmpty =
      !addNewActiveSubscription.length &&
      !removeExistingActiveSubscription.length;
    let modifiedUserAccount = userAccount;
    let modifiedAppSettings = appSettings;
    switch (true) {
      case !isBothActiveSubscriptionEmpty &&
        addNewActiveSubscription.length > 0:
        console.log("addNewActiveSubscription");
        modifiedUserAccount = {
          ...userAccount,
          subscription: {
            ...userAccount.subscription,
            activeSubscriptions: [
              ...userAccount.subscription.activeSubscriptions,
              ...addNewActiveSubscription,
            ],
            plan: "premium",
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

        break;
      case !isBothActiveSubscriptionEmpty &&
        removeExistingActiveSubscription.length > 0:
        console.log("removeExistingActiveSubscription");

        modifiedUserAccount = {
          ...userAccount,
          subscription: {
            ...userAccount.subscription,
            activeSubscriptions: [
              ...userAccount.subscription.activeSubscriptions.filter((subs) => {
                return !removeExistingActiveSubscription.includes(subs);
              }),
            ],
            plan: "premium",
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

        break;
      case !isBothActiveSubscriptionEmpty &&
        !addNewActiveSubscription.length > 0 &&
        !removeExistingActiveSubscription.length > 0:
        console.log("switch to free plan");
        modifiedUserAccount = {
          ...userAccount,
          subscription: {
            ...userAccount.subscription,
            activeSubscriptions: [],
            plan: "free",
          },
          _timestamps: {
            ...userAccount._timestamps,
            updated_at: Date.now(),
            updated_by: userAccount.uid,
          },
        };
        modifiedAppSettings = {
          ...appSettings,
          logbookSettings: {
            ...appSettings.logbookSettings,
            showSecondaryCurrency: false,
          },
          _timestamps: {
            ...appSettings._timestamps,
            updated_at: Date.now(),
            updated_by: userAccount.uid,
          },
        };
        dispatchUserAccount({
          type: REDUCER_ACTIONS.USER_ACCOUNT.SET_MULTI_ACTIONS,
          payload: modifiedUserAccount,
        });
        dispatchAppSettings({
          type: REDUCER_ACTIONS.APP_SETTINGS.SET_MULTI_ACTIONS,
          payload: modifiedAppSettings,
        });
        setTimeout(async () => {
          await firestore.setData(
            FIRESTORE_COLLECTION_NAMES.USERS,
            userAccount.uid,
            modifiedUserAccount
          );
          await firestore.setData(
            FIRESTORE_COLLECTION_NAMES.APP_SETTINGS,
            appSettings.uid,
            modifiedAppSettings
          );
        }, 5000);

        break;
      case isBothActiveSubscriptionEmpty:
        console.log("no change");
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
