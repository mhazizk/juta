import firestore from "../../../api/firebase/firestore";
import FIRESTORE_COLLECTION_NAMES from "../../../api/firebase/firestoreCollectionNames";
import getCustomerInfo from "../../../api/revenue-cat/getCustomerInfo";
import useFirestoreSubscriptions from "../../../hooks/useFirestoreSubscriptions";
import screenList from "../../../navigations/ScreenList";
import REDUCER_ACTIONS from "../../../reducers/reducer.action";
import { getDeviceId, getDeviceName, getDeviceOSName } from "../../../utils";

const startAppWithNewUser = async ({ currentUser, globalContext }) => {
  const {
    appSettings,
    dispatchAppSettings,
    globalTheme,
    dispatchGlobalTheme,
    userAccount,
    dispatchUserAccount,
    logbooks,
    dispatchLogbooks,
    categories,
    dispatchCategories,
    globalLoan,
    dispatchGlobalLoan,
    globalFeatureSwitch,
    dispatchGlobalFeatureSwitch,
    sortedTransactions,
    dispatchSortedTransactions,
    budgets,
    dispatchBudgets,
    repeatedTransactions,
    dispatchRepeatedTransactions,
    globalCurrencyRates,
    dispatchGlobalCurrencyRates,
    badgeCounter,
    dispatchBadgeCounter,
  } = globalContext;

  return Promise.all([
    firestore.getOneDoc(FIRESTORE_COLLECTION_NAMES.USERS, currentUser.uid),
    getDeviceId(),
    getDeviceName(),
    getDeviceOSName(),
    getCustomerInfo(currentUser.uid),
  ])
    .then((data) => {
      const userAccountData = data[0];
      const deviceId = data[1];
      const deviceName = data[2];
      const deviceOSName = data[3];
      const rcCustomerInfo = data[4];
      const loggedInUserAccount = {
        ...userAccountData,
        devicesLoggedIn: [
          ...userAccountData.devicesLoggedIn.filter((device) => {
            return device.device_id !== deviceId;
          }),
          {
            device_id: deviceId,
            device_name: deviceName,
            device_os_name: deviceOSName,
            last_login: Date.now(),
          },
        ],
      };
      dispatchUserAccount({
        type: REDUCER_ACTIONS.USER_ACCOUNT.FORCE_SET,
        payload: loggedInUserAccount,
      });

      dispatchAppSettings({
        type: REDUCER_ACTIONS.APP_SETTINGS.FORCE_SET,
        payload: {
          ...appSettings,
          uid: currentUser.uid,
        },
      });

      // dispatchGlobalFeatureSwitch({
      //   type: REDUCER_ACTIONS.SUBSCRIPTION_FEATURES.FORCE_SET,
      //   payload: { subscriptionFeatureList },
      // });

      // dispatchCategories({
      //   type: REDUCER_ACTIONS.CATEGORIES.SET_MULTI_ACTIONS,
      //   payload: {
      //     categories: { ...categoriesFallback, uid: currUser.uid },
      //   },
      // });
      setTimeout(async () => {
        await firestore.setData(
          FIRESTORE_COLLECTION_NAMES.USERS,
          currentUser.uid,
          loggedInUserAccount
        );
      }, 1);

      setTimeout(async () => {
        useFirestoreSubscriptions({
          uid: userAccountData.uid,
          skipFirstRun: true,

          appSettings: appSettings,
          dispatchAppSettings: dispatchAppSettings,

          userAccount: userAccountData,
          dispatchUserAccount: dispatchUserAccount,

          logbooks: logbooks,
          dispatchLogbooks: dispatchLogbooks,

          sortedTransactions: sortedTransactions,
          dispatchSortedTransactions: dispatchSortedTransactions,

          categories: categories,
          dispatchCategories: dispatchCategories,

          budgets: budgets,
          dispatchBudgets: dispatchBudgets,

          repeatedTransactions: repeatedTransactions,
          dispatchRepeatedTransactions: dispatchRepeatedTransactions,

          badgeCounter: badgeCounter,
          dispatchBadgeCounter: dispatchBadgeCounter,

          globalCurrencyRates,
          dispatchGlobalCurrencyRates,

          globalLoan,
          dispatchGlobalLoan,

          globalFeatureSwitch,
          dispatchGlobalFeatureSwitch,
        });
      }, 1000);
      return screenList.bottomTabNavigator;
    })
    .catch((err) => {
      console.log(err);
      return screenList.loginScreen;
    });
};

export default startAppWithNewUser;
