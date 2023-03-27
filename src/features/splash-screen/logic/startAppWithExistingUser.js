import firestore from "../../../api/firebase/firestore";
import FIRESTORE_COLLECTION_NAMES from "../../../api/firebase/firestoreCollectionNames";
import getSecretFromCloudFunctions from "../../../api/firebase/getSecretFromCloudFunctions";
import SECRET_KEYS from "../../../constants/secretManager";
import useFirestoreSubscriptions from "../../../hooks/useFirestoreSubscriptions";
import userAccountModel from "../../../model/userAccountModel";
import screenList from "../../../navigations/ScreenList";
import appSettingsFallback from "../../../reducers/fallback-state/appSettingsFallback";
import categoriesFallback from "../../../reducers/fallback-state/categoriesFallback";
import initialCategories from "../../../reducers/initial-state/initialCategories";
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
import getNewDeviceIdentifier from "../../devices/model/getNewDeviceIdentifer";
import BUDGET_TYPE_CONSTANTS from "../../../constants/budgetTypeConstants";
import legacyLogbookConversion from "../../../utils/legacyLogbookConversion";
import legacyAppSettingsCurrencyConversion from "../../../utils/legacyAppSettingsCurrencyConversion";
import updateSubscriptionStatus from "../../../api/revenue-cat/updateSubscriptionStatus";
import getCustomerInfo from "../../../api/revenue-cat/getCustomerInfo";
import { Platform } from "react-native";
import legacyCategoryConversion from "../../../utils/legacyCategoryConversion";

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
    expoPushToken,
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

  // TODO : commented for testing on iOS simulator
  // const loadRCCustomerInfo = getCustomerInfo(currentUser.uid);

  // const loadGlobalCurrenyRatesFromFirestore = getAllCurrenciesFromFirestore();
  const loadGlobalCurrenyRatesFromFirestore = firestore.getOneDoc(
    FIRESTORE_COLLECTION_NAMES.GLOBAL_CURRENCY_RATES,
    "allCurrencyRates"
  );

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
    // loadCurrencyRatesFromFirestore,
    loadGlobalCurrenyRatesFromFirestore,
    loadLoanContactsFromFirestore,
    loadSubs,
    // loadRCCustomerInfo,
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

      // TODO : commented for testing on iOS simulator
      // const rcCustomerInfoData = data[13];

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

      const newDevice = getNewDeviceIdentifier({
        expoPushToken,
        deviceId: deviceIdData,
        deviceName: deviceNameData,
        deviceOSName: deviceOSNameData,
      });

      const userAccountWithRecentDevice = {
        ...userAccountData,
        devicesLoggedIn: [
          ...filteredDevicesLoggedIn,
          {
            ...newDevice,
          },
        ],
      };

      // TODO : commented for testing on iOS simulator
      // let updatedUserAccount;
      // TODO : temporary assign this variable to userAccountData
      let updatedUserAccount = userAccountWithRecentDevice;
      let updatedAppSettings = appSettingsData;

      // TAG : check if appSettings has budgetSettings property
      if (!updatedAppSettings?.hasOwnProperty("budgetSettings")) {
        updatedAppSettings = {
          ...updatedAppSettings,
          budgetSettings: appSettingsFallback.budgetSettings,
        };
      }

      // TAG : check if appSettings has legacy currency property
      updatedAppSettings =
        legacyAppSettingsCurrencyConversion(updatedAppSettings);

      // TODO : commented for testing on iOS simulator
      // updateSubscriptionStatus({
      //   globalFeatureSwitch: subsData,
      //   rcCustomerInfo: rcCustomerInfoData,
      //   appSettings: updatedAppSettings,
      //   userAccount: updatedUserAccount,
      //   callback: ({ newUserAccount, newAppSettings }) => {
      //     updatedUserAccount = newUserAccount;
      //     updatedAppSettings = newAppSettings;
      //   },
      // });

      dispatchGlobalFeatureSwitch({
        type: REDUCER_ACTIONS.FEATURE_SWITCH.FORCE_SET,
        payload: subsData,
      });

      // setTimeout(async () => {
      //   await firestore.setData(collectionName, docId, subsData);
      // }, 1);

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
        payload: updatedAppSettings.theme_id
          ? updatedAppSettings.theme_id
          : appSettingsFallback.theme_id,
      });

      // TAG : Categories

      const newCategoriesData = categoriesFallback({
        uid: currentUser.uid,
      });

      const isCategoryHasIsShownProperties = Boolean(
        categoriesData.expense[0].hasOwnProperty("is_shown")
      );

      let convertedCategories;

      // convert legacy categories data to new format
      if (!isCategoryHasIsShownProperties)
        convertedCategories = legacyCategoryConversion(categoriesData);

      // console.log(JSON.stringify({ convertedCategories }, null, 2));

      const categoriesForGlobalState = {
        ...initialCategories,
        categories: convertedCategories || { ...newCategoriesData },
      };

      dispatchCategories({
        type: REDUCER_ACTIONS.CATEGORIES.FORCE_SET,
        payload: categoriesForGlobalState,
      });

      if (!categoriesData) {
        setTimeout(async () => {
          await firestore.setData(
            FIRESTORE_COLLECTION_NAMES.CATEGORIES,
            currentUser.uid,
            newCategoriesData
          );
        }, 1);
      }

      if (!isCategoryHasIsShownProperties) {
        setTimeout(async () => {
          await firestore.setData(
            FIRESTORE_COLLECTION_NAMES.CATEGORIES,
            currentUser.uid,
            convertedCategories
          );
        }, 1);
      }

      // TAG : Logbooks

      // Check if logbooks data includes currencyCode
      // If not, add it

      const convertedLogbookData = legacyLogbookConversion(logbooksData);

      let newLogbooksData = convertedLogbookData;

      const newLogbook = getLogbookModel({
        logbookName: "My Logbook",
        uid: currentUser.uid,
        defaultCurrency:
          updatedAppSettings.logbookSettings.defaultCurrency ||
          newAppSettings.logbookSettings.defaultCurrency,
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
      if (!!convertedLogbookData.length) {
        convertedLogbookData.forEach(async (convertedLogbook) => {
          setTimeout(async () => {
            await firestore.setData(
              FIRESTORE_COLLECTION_NAMES.LOGBOOKS,
              convertedLogbook.logbook_id,
              convertedLogbook
            );
          }, 1);
        });
      }

      // if (!logbooksData[0].logbook_currency.currencyCode) {
      //   newLogbooksData.forEach(async (logbookWithNewCurrency) => {
      //     setTimeout(async () => {
      //       await firestore.setData(
      //         FIRESTORE_COLLECTION_NAMES.LOGBOOKS,
      //         logbookWithNewCurrency.logbook_id,
      //         logbookWithNewCurrency
      //       );
      //     });
      //   }, 1);
      // }

      dispatchLogbooks({
        type: REDUCER_ACTIONS.LOGBOOKS.FORCE_SET,
        payload: {
          ...initialLogbooks,
          logbooks: newLogbooksData || [newLogbook],
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
        newLogbooksData || [newLogbook]
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
      const budgets = budgetsData;
      const addedBudgetType = budgetsData.map((budget) => {
        if (!budget.hasOwnProperty("budget_type")) {
          return {
            ...budget,
            budget_type:
              BUDGET_TYPE_CONSTANTS.OPTIONS[
                BUDGET_TYPE_CONSTANTS.OPTIONS.length - 1
              ].id,
          };
        } else {
          return budget;
        }
      });

      let newBudget;
      if (addedBudgetType.length > 1) {
        console.log(addedBudgetType);
        const today = Date.now();
        const budget = addedBudgetType[0];
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
          payload: newBudget || addedBudgetType[0],
        });
      }

      // TAG : Global currency rates

      let newCurrencyRateData;

      const nullish = [null, undefined, "error"];

      // const isNewFetchNullish =
      // fetchNewCurrencyData.includes(nullish) ||
      // fetchNewCurrencyData.length < 1;

      const isStoredCurrencyRatesAvailable = Boolean(currencyRatesData);

      if (isStoredCurrencyRatesAvailable) {
        newCurrencyRateData = currencyRatesData;
      }

      // if (!isNewFetchNullish) {
      //   newCurrencyRateData = fetchNewCurrencyData;
      // }

      // const newCurrencyRates = {
      //   ...initialGlobalCurrencyRates,
      //   uid: currentUser.uid,
      //   data: newCurrencyRateData,
      //   _timestamps: {
      //     created_at: Date.now(),
      //     created_by: currentUser.uid,
      //     updated_at: Date.now(),
      //     updated_by: currentUser.uid,
      //   },
      // };
      dispatchGlobalCurrencyRates({
        type: REDUCER_ACTIONS.CURRENCY_RATES.FORCE_SET,
        payload: newCurrencyRateData,
      });

      // if (!isNewFetchNullish) {
      //   setTimeout(async () => {
      //     await firestore.setData(
      //       FIRESTORE_COLLECTION_NAMES.CURRENCY_RATES,
      //       currentUser.uid,
      //       newCurrencyRates
      //     );
      //   }, 1);
      // }

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

      // TAG : Global Loan

      const newLoanContactsData = {
        ...initialGlobalLoan,
        uid: currentUser.uid,
        _timestamps: {
          ...initialGlobalLoan._timestamps,
          created_by: currentUser.uid,
          updated_by: currentUser.uid,
        },
      };

      dispatchGlobalLoan({
        type: REDUCER_ACTIONS.LOAN.FORCE_SET,
        payload: loanContactsData || newLoanContactsData,
      });

      setTimeout(() => {
        useFirestoreSubscriptions({
          uid: updatedUserAccount.uid,
          skipFirstRun: true,

          appSettings: appSettings,
          dispatchAppSettings: dispatchAppSettings,

          userAccount: userAccount,
          dispatchUserAccount: dispatchUserAccount,

          logbooks: logbooks,
          dispatchLogbooks: dispatchLogbooks,

          sortedTransactions: sortedTransactions,
          dispatchSortedTransactions: dispatchSortedTransactions,

          categories: categoriesForGlobalState,
          dispatchCategories: dispatchCategories,

          budgets: budgets,
          dispatchBudgets: dispatchBudgets,

          repeatedTransactions: repeatedTransactions,
          dispatchRepeatedTransactions: dispatchRepeatedTransactions,

          badgeCounter: badgeCounter,
          dispatchBadgeCounter: dispatchBadgeCounter,

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
      console.log(
        JSON.stringify(
          { error: "error on startAppWithExistingUser", err },
          null,
          2
        )
      );
      // TODO: handle error on iOS
      return screenList.bottomTabNavigator;
      // return screenList.bottomTabNavigator;
    });
};

export default startAppWithExistingUser;
