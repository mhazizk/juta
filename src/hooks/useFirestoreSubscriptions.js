import REDUCER_ACTIONS from "../reducers/reducer.action";
import FIRESTORE_COLLECTION_NAMES from "../api/firebase/firestoreCollectionNames";
import firestore from "../api/firebase/firestore";
import env from "../config/env";
import getSecretFromCloudFunctions from "../api/firebase/getSecretFromCloudFunctions";
import SECRET_KEYS from "../constants/secretManager";

const useFirestoreSubscriptions = ({
  uid,
  subscribeAll,
  unsubscribeAll,

  appSettings,
  dispatchAppSettings,

  userAccount,
  dispatchUserAccount,

  logbooks,
  dispatchLogbooks,

  sortedTransactions,
  dispatchSortedTransactions,

  categories,
  dispatchCategories,

  budgets,
  dispatchBudgets,

  repeatedTransactions,
  dispatchRepeatedTransactions,

  badgeCounter,
  dispatchBadgeCounter,

  globalCurrencyRates,
  dispatchGlobalCurrencyRates,

  globalLoan,
  dispatchGlobalLoan,

  globalFeatureSwitch,
  dispatchGlobalFeatureSwitch,
}) => {
  console.log("useFirestoreSubscriptions");

  // TAG : App Settings Subscription //
  const unsubscribeAppSettings = firestore.getAndListenOneDoc(
    FIRESTORE_COLLECTION_NAMES.APP_SETTINGS,
    uid,
    (data) => {
      console.log("changed app settings");
      if (!!data) {
        dispatchBadgeCounter({
          type: REDUCER_ACTIONS.BADGE_COUNTER.TAB.SET_BADGE_IN_USER_TAB,
          payload: 1,
        });
        dispatchAppSettings({
          type: REDUCER_ACTIONS.APP_SETTINGS.SET_MULTI_ACTIONS,
          payload: data,
        });
      }
    },
    (error) => {}
  );
  // unsubscribeAppSettings = userAccountSubscription;

  // TAG : User Account Subscription //
  const unsubscribeUserAccount = firestore.getAndListenOneDoc(
    FIRESTORE_COLLECTION_NAMES.USERS,
    uid,
    (data) => {
      if (!!data) {
        dispatchBadgeCounter({
          type: REDUCER_ACTIONS.BADGE_COUNTER.TAB.SET_BADGE_IN_USER_TAB,
          payload: 1,
        });
        dispatchUserAccount({
          type: REDUCER_ACTIONS.USER_ACCOUNT.SET_MULTI_ACTIONS,
          payload: data,
        });
      }
    },
    (error) => {}
  );

  // TAG : Loan Contacts Subscription //
  const unsubscribeLoan = firestore.getAndListenOneDoc(
    FIRESTORE_COLLECTION_NAMES.LOAN_CONTACTS,
    uid,
    (data) => {
      if (!!data) {
        dispatchGlobalLoan({
          type: REDUCER_ACTIONS.LOAN.SET_MULTI_ACTIONS,
          payload: data,
        });
      }
    },
    (error) => {}
  );

  // TAG : Currency rates Subscription //
  const unsubscribeCurrencyRates = firestore.getAndListenOneDoc(
    FIRESTORE_COLLECTION_NAMES.CURRENCY_RATES,
    uid,
    (data) => {
      if (!!data) {
        dispatchGlobalCurrencyRates({
          type: REDUCER_ACTIONS.CURRENCY_RATES.SET_MULTI_ACTIONS,
          payload: data,
        });
      }
    },
    (error) => {}
  );

  // TAG : Logbooks Subscription //
  const unsubscribeLogbooks = firestore.getAndListenMultipleDocs(
    FIRESTORE_COLLECTION_NAMES.LOGBOOKS,
    uid,
    (error) => {},
    (data) => {},
    (data, type) => {
      if (!!data) {
        switch (type) {
          case "added":
            dispatchLogbooks({
              type: REDUCER_ACTIONS.LOGBOOKS.INSERT,
              payload: {
                newLogbook: data,
                reducerUpdatedAt: Date.now(),
              },
            });
            break;
          case "modified":
            dispatchLogbooks({
              type: REDUCER_ACTIONS.LOGBOOKS.PATCH,
              payload: {
                patchLogbook: data,
                reducerUpdatedAt: Date.now(),
              },
            });
            break;
          case "removed":
            dispatchLogbooks({
              type: REDUCER_ACTIONS.LOGBOOKS.DELETE_ONE,
              payload: { deleteLogbook: data, reducerUpdatedAt: Date.now() },
            });

            break;

          default:
            break;
        }
      }
    }
  );

  // TAG : Transactions Subscription //
  const unsubscribeTransactions = firestore.getAndListenMultipleDocs(
    FIRESTORE_COLLECTION_NAMES.TRANSACTIONS,
    uid,
    (error) => {},
    (data) => {},
    (data, type) => {
      let prevTransaction = null;
      if (!!data) {
        switch (type) {
          case "added":
            // Check duplicate between new and prev transaction
            // if (prevTransaction) {
            //   isTimestampSame =
            //     data._timestamps.updated_at ===
            //     prevTransaction._timestamps.updated_at;
            // }
            // console.log({ prevTransaction, isTimestampSame });

            dispatchBadgeCounter({
              type: REDUCER_ACTIONS.BADGE_COUNTER.TAB.SET_BADGE_IN_LOGBOOK_TAB,
              payload: 1,
            });

            dispatchSortedTransactions({
              type: REDUCER_ACTIONS.SORTED_TRANSACTIONS.GROUP_SORTED
                .INSERT_TRANSACTION,
              payload: {
                transaction: data,
                reducerUpdatedAt: Date.now(),
                logbookToOpen: logbooks.logbooks.find((logbook) => {
                  if (logbook.logbook_id === data.logbook_id) {
                    return {
                      name: logbook.logbook_name,
                      logbook_id: logbook.logbook_id,
                      logbook_currency: logbook.logbook_currency,
                    };
                  }
                }),
              },
            });
            break;
          case "modified":
            // TODO : fix patch transaction with different target logbook
            dispatchBadgeCounter({
              type: REDUCER_ACTIONS.BADGE_COUNTER.TAB.SET_BADGE_IN_LOGBOOK_TAB,
              payload: 1,
            });

            dispatchSortedTransactions({
              type: REDUCER_ACTIONS.SORTED_TRANSACTIONS.GROUP_SORTED
                .PATCH_TRANSACTION,
              payload: {
                patchTransaction: data,
                reducerUpdatedAt: Date.now(),
              },
            });
            // }
            break;

          case "removed":
            dispatchBadgeCounter({
              type: REDUCER_ACTIONS.BADGE_COUNTER.TAB.SET_BADGE_IN_LOGBOOK_TAB,
              payload: 1,
            });

            dispatchSortedTransactions({
              type: REDUCER_ACTIONS.SORTED_TRANSACTIONS.GROUP_SORTED
                .DELETE_ONE_TRANSACTION,
              payload: {
                deleteTransaction: data,
                reducerUpdatedAt: Date.now(),
                logbookToOpen: logbooks.logbooks.find((logbook) => {
                  if (logbook.logbook_id === data.logbook_id) {
                    return {
                      name: logbook.logbook_name,
                      logbook_id: logbook.logbook_id,
                      logbook_currency: logbook.logbook_currency,
                    };
                  }
                }),
              },
            });
            // }
            break;

          default:
            break;
        }
      }
    }
  );
  // unsubscribeTransactions = transactionsSubscription;

  // TAG : Repeated Transactions Subscription //
  const unsubscribeRepeatedTransactions = firestore.getAndListenMultipleDocs(
    FIRESTORE_COLLECTION_NAMES.REPEATED_TRANSACTIONS,
    uid,
    (error) => {},
    (data) => {},
    (data, type) => {
      if (!!data) {
        switch (type) {
          case "added":
            dispatchRepeatedTransactions({
              type: REDUCER_ACTIONS.REPEATED_TRANSACTIONS.INSERT,
              payload: {
                repeatedTransaction: data,
                reducerUpdatedAt: Date.now(),
              },
            });
            break;
          case "modified":
            dispatchRepeatedTransactions({
              type: REDUCER_ACTIONS.REPEATED_TRANSACTIONS.PATCH,
              payload: {
                repeatedTransaction: data,
                reducerUpdatedAt: Date.now(),
              },
            });
            break;
          case "removed":
            dispatchRepeatedTransactions({
              type: REDUCER_ACTIONS.REPEATED_TRANSACTIONS.DELETE_ONE,
              payload: {
                repeatedTransaction: data,
                reducerUpdatedAt: Date.now(),
              },
            });
            break;

          default:
            break;
        }
      }
    }
  );

  // TAG : Categories Subscription //
  const unsubscribeCategories = firestore.getAndListenOneDoc(
    FIRESTORE_COLLECTION_NAMES.CATEGORIES,
    uid,
    (data) => {
      if (!!data) {
        dispatchCategories({
          type: REDUCER_ACTIONS.CATEGORIES.SET,
          payload: data,
        });
      }
    },
    (error) => {}
  );
  // unsubscribeCategories = categoriesSubscription;

  // TAG : Budgets Subscription //
  const unsubscribeBudgets = firestore.getAndListenMultipleDocs(
    FIRESTORE_COLLECTION_NAMES.BUDGETS,
    uid,
    (error) => {},
    (data) => {},
    (data) => {}
    // dispatchBudgets({
    //   type: REDUCER_ACTIONS.BUDGETS.SET,
    //   payload: data,
    // }),
  );

  return {
    unsubscribeAppSettings: unsubscribeAppSettings(),
    unsubscribeUserAccount: unsubscribeUserAccount(),
    unsubscribeLogbooks: unsubscribeLogbooks(),
    unsubscribeTransactions: unsubscribeTransactions(),
    unsubscribeCategories: unsubscribeCategories(),
    unsubscribeBudgets: unsubscribeBudgets(),
    unsubscribeRepeatedTransactions: unsubscribeRepeatedTransactions(),
    unsubscribeCurrencyRates: unsubscribeCurrencyRates(),
    unsubscribeLoan: unsubscribeLoan(),
    // unsubscribeFeatures: unsubscribeFeatures(),
  };
};

export default useFirestoreSubscriptions;
