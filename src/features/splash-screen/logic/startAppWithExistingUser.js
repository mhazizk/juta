import { signOut } from "firebase/auth/react-native";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../../../api/firebase/auth";
import firestore from "../../../api/firebase/firestore";
import FIRESTORE_COLLECTION_NAMES from "../../../api/firebase/firestoreCollectionNames";
import getSecretFromCloudFunctions from "../../../api/firebase/getSecretFromCloudFunctions";
import getCustomerInfo from "../../../api/revenue-cat/getCustomerInfo";
import updateSubscriptionStatus from "../../../api/revenue-cat/updateSubscriptionStatus";
import SECRET_KEYS from "../../../constants/secretManager";
import useFirestoreSubscriptions from "../../../hooks/useFirestoreSubscriptions";
import userAccountModel from "../../../model/userAccountModel";
import screenList from "../../../navigations/ScreenList";
import appSettingsFallback from "../../../reducers/fallback-state/appSettingsFallback";
import categoriesFallback from "../../../reducers/fallback-state/categoriesFallback";
import initialCategories from "../../../reducers/initial-state/initialCategories";
import initialGlobalCurrencyRates from "../../../reducers/initial-state/initialGlobalCurrencyRates";
import initialGlobalLoan from "../../../reducers/initial-state/initialGlobalLoan";
import initialLogbooks from "../../../reducers/initial-state/initialLogbooks";
import initialRepeatedTransactions from "../../../reducers/initial-state/initialRepeatedTransactions";
import initialSortedTransactions from "../../../reducers/initial-state/initialSortedTransactions";
import REDUCER_ACTIONS from "../../../reducers/reducer.action";
import {
  createNewTransactionFromActiveRepeatedTransaction,
  getDeviceId,
  getDeviceName,
  getDeviceOSName,
} from "../../../utils";
import mergeTransactionsIntoSortedTransactions from "../../../utils/mergeTransactionsIntoSortedTransactions";
import getFeatureLimit from "../../subscription/logic/getFeatureLimit";
import FEATURE_NAME from "../../subscription/model/featureName";
import * as Sentry from "@sentry/react-native";
import getLogbookModel from "../../logbook/model/getLogbookModel";

const newReducerUpdatedAt = Date.now();

const startAppWithExistingUser = async ({ currentUser, globalContext }) => {
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

  const deviceId = getDeviceId();

  const deviceName = getDeviceName();

  const deviceOSName = getDeviceOSName();

  const loadUserDataFromFirestore = firestore.getOneDoc(
    FIRESTORE_COLLECTION_NAMES.USERS,
    currentUser.uid
  );

  const loadAppSettingsFromFirestore = firestore.getOneDoc(
    FIRESTORE_COLLECTION_NAMES.APP_SETTINGS,
    currentUser.uid
  );

  const loadLogbooksFromFirestore = firestore.queryData(
    FIRESTORE_COLLECTION_NAMES.LOGBOOKS,
    currentUser.uid
  );

  const loadTransactionsFromFirestore = firestore.queryData(
    FIRESTORE_COLLECTION_NAMES.TRANSACTIONS,
    currentUser.uid
  );

  const loadCategoriesFromFirestore = firestore.getOneDoc(
    FIRESTORE_COLLECTION_NAMES.CATEGORIES,
    currentUser.uid
  );

  const loadBudgetsFromFirestore = firestore.queryData(
    FIRESTORE_COLLECTION_NAMES.BUDGETS,
    currentUser.uid
  );

  const loadRepeatedTransactionsFromFirestore = firestore.queryData(
    FIRESTORE_COLLECTION_NAMES.REPEATED_TRANSACTIONS,
    currentUser.uid
  );

  const loadCurrencyRatesFromFirestore = firestore.queryData(
    FIRESTORE_COLLECTION_NAMES.CURRENCY_RATES,
    currentUser.uid
  );

  const loadLoanContactsFromFirestore = firestore.getOneDoc(
    FIRESTORE_COLLECTION_NAMES.LOAN_CONTACTS,
    currentUser.uid
  );
  const collectionName = await getSecretFromCloudFunctions(
    SECRET_KEYS.FEATURE_SWITCH_COLLECTION_NAME
  );
  const docId = await getSecretFromCloudFunctions(
    SECRET_KEYS.FEATURE_SWITCH_DOCUMENT_ID
  );
  const loadSubs = firestore.getOneDoc(collectionName, docId);
  const loadRCCustomerInfo = getCustomerInfo(currentUser.uid);

  return Promise.all([
    deviceId,
    deviceName,
    deviceOSName,
    loadUserDataFromFirestore,
    loadAppSettingsFromFirestore,
    loadTransactionsFromFirestore,
    loadLogbooksFromFirestore,
    loadCategoriesFromFirestore,
    loadBudgetsFromFirestore,
    loadRepeatedTransactionsFromFirestore,
    loadCurrencyRatesFromFirestore,
    loadLoanContactsFromFirestore,
    loadSubs,
    loadRCCustomerInfo,
  ])
    .then((data) => {
      const deviceIdData = data[0];
      const deviceNameData = data[1];
      const deviceOSNameData = data[2];
      const userAccountData = data[3];
      const appSettingsData = data[4];
      const transactionsData = data[5];
      const logbooksData = data[6];
      const categoriesData = data[7];
      const budgetsData = data[8];
      const repeatedTransactionsData = data[9];
      const currencyRatesData = data[10];
      const loanContactsData = data[11];
      const subsData = data[12];
      const rcCustomerInfoData = data[13];

      const filteredDevicesLoggedIn = userAccountData?.devicesLoggedIn.filter(
        (device) => device.device_id !== deviceIdData
      );

      const maxDevicesLoggedIn = getFeatureLimit({
        subsData,
        subscriptionPlan: userAccountData?.subscription.plan,
        featureName: FEATURE_NAME.DEVICES,
      });

      // if (filteredDevicesLoggedIn.length >= maxDevicesLoggedIn) {
      //   alert(
      //     `You have reached the maximum number of devices allowed for your subscription plan.\nPlease upgrade your subscription plan to add more devices.`
      //   );
      //   signOut(auth)
      //     .then(() => {})
      //     .catch((error) => {
      //       alert(error);
      //     });
      //   return;
      // }

      // TAG : currentUser account

      const newAccount = userAccountModel({
        displayName: currentUser.displayName,
        uid: currentUser.uid,
        email: currentUser.email,
        emailVerified: currentUser.emailVerified,
        photoURL: currentUser.photoURL,
      });

      const loggedInUserAccount = {
        ...userAccountData,
        devicesLoggedIn: [
          ...filteredDevicesLoggedIn,
          {
            device_id: deviceIdData,
            device_name: deviceNameData,
            device_os_name: deviceOSNameData,
            last_login: Date.now(),
          },
        ],
      };

      let updatedUserAccount;
      let updatedAppSettings = appSettingsData;

      updateSubscriptionStatus({
        globalFeatureSwitch: subsData,
        rcCustomerInfo: rcCustomerInfoData,
        appSettings: appSettingsData,
        userAccount: loggedInUserAccount,
        callback: ({ newUserAccount, newAppSettings }) => {
          updatedUserAccount = newUserAccount;
          updatedAppSettings = newAppSettings;
        },
      });

      dispatchGlobalFeatureSwitch({
        type: REDUCER_ACTIONS.FEATURE_SWITCH.FORCE_SET,
        payload: subsData,
      });

      setTimeout(async () => {
        await firestore.setData(collectionName, docId, subsData);
      }, 1);

      dispatchUserAccount({
        type: REDUCER_ACTIONS.USER_ACCOUNT.FORCE_SET,
        payload: userAccountData ? updatedUserAccount : newAccount,
      });
      setTimeout(async () => {
        await firestore.setData(
          FIRESTORE_COLLECTION_NAMES.USERS,
          currentUser.uid,
          userAccountData ? updatedUserAccount : newAccount
        );
      }, 1);

      // TAG : App settings

      const newAppSettings = {
        ...appSettingsFallback,
        uid: currentUser.uid,
        _timestamps: {
          ...appSettingsFallback._timestamps,
          created_by: currentUser.uid,
          updated_by: currentUser.uid,
        },
      };

      dispatchAppSettings({
        type: REDUCER_ACTIONS.APP_SETTINGS.FORCE_SET,
        payload: appSettingsData ? updatedAppSettings : newAppSettings,
      });

      setTimeout(async () => {
        await firestore.setData(
          FIRESTORE_COLLECTION_NAMES.APP_SETTINGS,
          currentUser.uid,
          appSettingsData ? updatedAppSettings : newAppSettings
        );
      }, 1);

      // TAG : Global theme

      dispatchGlobalTheme({
        type: REDUCER_ACTIONS.THEME.SET,
        payload: appSettingsData.theme_id
          ? appSettingsData.theme_id
          : appSettingsFallback.theme_id,
      });

      // TAG : Categories

      const fallbackCategories = categoriesFallback({
        uid: currentUser.uid,
        created_by: currentUser.uid,
        updated_by: currentUser.uid,
      });

      const categories = {
        ...initialCategories,
        categories: categoriesData || { ...fallbackCategories },
      };

      dispatchCategories({
        type: REDUCER_ACTIONS.CATEGORIES.FORCE_SET,
        payload: categories,
      });

      if (!categoriesData) {
        setTimeout(async () => {
          await firestore.setData(
            FIRESTORE_COLLECTION_NAMES.CATEGORIES,
            currentUser.uid,
            fallbackCategories
          );
        }, 1);
      }

      // TAG : Logbooks

      let newLogbooksData = logbooksData;
      const newLogbook = getLogbookModel({
        logbookName: "My Logbook",
        uid: currentUser.uid,
        defaultCurrency: appSettingsData.logbookSettings.defaultCurrency,
      });
      if (logbooksData.length < 1) {
        newLogbooksData = [newLogbook];
        setTimeout(async () => {
          await firestore.setData(
            FIRESTORE_COLLECTION_NAMES.LOGBOOKS,
            newLogbook.logbook_id,
            newLogbook
          );
        }, 1);
      }

      dispatchLogbooks({
        type: REDUCER_ACTIONS.LOGBOOKS.FORCE_SET,
        payload: {
          ...initialLogbooks,
          logbooks: newLogbooksData,
        },
      });

      // TAG : Transactions

      const checkedTransactionsAndRepeatedTransactions =
        createNewTransactionFromActiveRepeatedTransaction(
          repeatedTransactionsData,
          transactionsData
        );

      // Merge transactions into sorted transactions
      const groupSorted = mergeTransactionsIntoSortedTransactions(
        checkedTransactionsAndRepeatedTransactions.getAllTransactions,
        newLogbooksData
      );

      const initialSortedTransactionsToDispatch = {
        ...initialSortedTransactions,
        reducerUpdatedAt: newReducerUpdatedAt,
        groupSorted: groupSorted,
      };

      dispatchSortedTransactions({
        type: REDUCER_ACTIONS.SORTED_TRANSACTIONS.GROUP_SORTED.FORCE_SET,
        payload: initialSortedTransactionsToDispatch,
      });

      // TAG : budgets

      // Check budget if it is expired
      // const budget = budgetsData[0];
      let newBudget;
      if (budgetsData.length > 1) {
        console.log(budgetsData);
        const today = Date.now();
        const budget = budgetsData[0];
        // const foundBudget = budget.find((budget) => {
        //   today > budget.finish_date;
        // });

        if (budget.repeat === true && today > budget.finish_date) {
          const duration = budget.finish_date - budget.start_date;
          newBudget = {
            ...budget,
            start_date: budget.start_date,
            finish_date: budget.finish_date + duration,
          };
        }
        dispatchBudgets({
          type: REDUCER_ACTIONS.BUDGETS.SET,
          payload: newBudget || budgetsData[0],
        });
      }

      // TAG : Repeated transactions

      dispatchRepeatedTransactions({
        type: REDUCER_ACTIONS.REPEATED_TRANSACTIONS.FORCE_SET,
        payload: {
          ...initialRepeatedTransactions,
          repeatedTransactions:
            checkedTransactionsAndRepeatedTransactions.getAllRepeatedTransactions ||
            [],
        },
      });

      // TAG : Global currency rates

      dispatchGlobalCurrencyRates({
        type: REDUCER_ACTIONS.CURRENCY_RATES.FORCE_SET,
        payload: currencyRatesData || {
          ...initialGlobalCurrencyRates,
          uid: currentUser.uid,
          _timestamps: {
            ...initialGlobalCurrencyRates._timestamps,
            created_by: currentUser.uid,
            updated_by: currentUser.uid,
          },
        },
      });

      // push new transaction to firestore
      checkedTransactionsAndRepeatedTransactions.getNewTransactionsOnly.forEach(
        async (newTransaction) => {
          await firestore.setData(
            FIRESTORE_COLLECTION_NAMES.TRANSACTIONS,
            newTransaction.transaction_id,
            newTransaction
          );
        }
      );

      // push modified repeat section to firestore
      checkedTransactionsAndRepeatedTransactions.getModifiedRepeatedTransactionsOnly.forEach(
        async (modifiedRepeatSection) => {
          await firestore.setData(
            FIRESTORE_COLLECTION_NAMES.REPEATED_TRANSACTIONS,
            modifiedRepeatSection.repeat_id,
            modifiedRepeatSection
          );
        }
      );
      dispatchGlobalLoan({
        type: REDUCER_ACTIONS.LOAN.FORCE_SET,
        payload: loanContactsData || {
          ...initialGlobalLoan,
          uid: currentUser.uid,
          _timestamps: {
            ...initialGlobalLoan._timestamps,
            created_by: currentUser.uid,
            updated_by: currentUser.uid,
          },
        },
      });

      setTimeout(() => {
        useFirestoreSubscriptions({
          uid: userAccountData?.uid,
          skipFirstRun: true,

          appSettings: appSettings,
          dispatchAppSettings: dispatchAppSettings,

          userAccount: userAccount,
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
      Sentry.setUser({
        id: currentUser.uid,
      });
      return screenList.bottomTabNavigator;
    })
    .catch((err) => {
      console.log(err);
      // TODO: handle error on iOS
      return screenList.loginScreen;
    });
};

export default startAppWithExistingUser;
