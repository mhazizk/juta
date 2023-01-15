import {
  useGlobalAppSettings,
  useGlobalBadgeCounter,
  useGlobalBudgets,
  useGlobalCategories,
  useGlobalLogbooks,
  useGlobalSortedTransactions,
  useGlobalUserAccount,
} from "../reducers/GlobalContext";
import REDUCER_ACTIONS from "../reducers/reducer.action";
import FIRESTORE_COLLECTION_NAMES from "../api/firebase/firestoreCollectionNames";
import firestore from "../api/firebase/firestore";
import { Transaction } from "firebase/firestore";
import { useRef } from "react";

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
  badgeCounter,
  dispatchBadgeCounter,
}) => {
  // const userAccountRef = useRef(userAccount);
  // const appSettingsRef = useRef(appSettings);
  // const logbooksRef = useRef(logbooks);
  // const sortedTransactionsRef = useRef(sortedTransactions);
  // const categoriesRef = useRef(categories);
  // const budgetsRef = useRef(budgets);
  // const badgeCounterRef = useRef(badgeCounter);

  console.log("useFirestoreSubscriptions");
  // TAG : App Settings Subscription //
  const unsubscribeAppSettings = firestore.getAndListenOneDoc(
    FIRESTORE_COLLECTION_NAMES.APP_SETTINGS,
    uid,
    (data) => {
      dispatchBadgeCounter({
        type: REDUCER_ACTIONS.BADGE_COUNTER.TAB.SET_BADGE_IN_USER_TAB,
        payload: 1,
      });
      dispatchAppSettings({
        type: REDUCER_ACTIONS.APP_SETTINGS.FORCE_SET,
        payload: data,
      });
    },
    (error) => alert(error)
  );
  // unsubscribeAppSettings = userAccountSubscription;

  // TAG : User Account Subscription //
  const unsubscribeUserAccount = firestore.getAndListenOneDoc(
    FIRESTORE_COLLECTION_NAMES.USERS,
    uid,
    (data) => {
      dispatchBadgeCounter({
        type: REDUCER_ACTIONS.BADGE_COUNTER.TAB.SET_BADGE_IN_USER_TAB,
        payload: 1,
      });
      dispatchUserAccount({
        type: REDUCER_ACTIONS.USER_ACCOUNT.FORCE_SET,
        payload: data,
      });
    },
    (error) => alert(error)
  );
  // unsubscribeUserAccount = userAccountSubscription;

  // TAG : Logbooks Subscription //
  const unsubscribeLogbooks = firestore.getAndListenMultipleDocs(
    FIRESTORE_COLLECTION_NAMES.LOGBOOKS,
    uid,
    (error) => alert(error),
    (data) => {},
    (data, type) => {
      switch (type) {
        case "added":
          dispatchLogbooks({
            type: REDUCER_ACTIONS.LOGBOOKS.INSERT,
            payload: data,
          });
          break;
        case "modified":
          dispatchLogbooks({
            type: REDUCER_ACTIONS.LOGBOOKS.PATCH,
            payload: data,
          });
          break;
        case "removed":
          dispatchLogbooks({
            type: REDUCER_ACTIONS.LOGBOOKS.DELETE_ONE,
            payload: data,
          });

          break;

        default:
          break;
      }
    }
  );

  // TAG : Transactions Subscription //
  const unsubscribeTransactions = firestore.getAndListenMultipleDocs(
    FIRESTORE_COLLECTION_NAMES.TRANSACTIONS,
    uid,
    (error) => alert(error),
    (data) => {},
    (data, type) => {
      let prevTransaction = null;
      switch (type) {
        case "added":
          sortedTransactions.groupSorted.forEach((logbook) => {
            logbook.transactions.forEach((section) => {
              section.data.forEach((transaction) => {
                if (transaction.transaction_id === data.transaction_id) {
                  prevTransaction = transaction;
                }
              });
            });
          });
          // Check duplicate between new and prev transaction
          // if (prevTransaction) {
          //   isTimestampSame =
          //     data._timestamps.updated_at ===
          //     prevTransaction._timestamps.updated_at;
          // }
          // console.log({ prevTransaction, isTimestampSame });

          if (!prevTransaction) {
            dispatchBadgeCounter({
              type: REDUCER_ACTIONS.BADGE_COUNTER.TAB.SET_BADGE_IN_LOGBOOK_TAB,
              payload: 1,
            });

            dispatchSortedTransactions({
              type: REDUCER_ACTIONS.SORTED_TRANSACTIONS.GROUP_SORTED
                .INSERT_TRANSACTION,
              payload: {
                transaction: data,
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
            // TODO : problem transaction are late 1 step after addition, so we dont get the added transaction in this function
            setTimeout(() => {
              let added = [];
              sortedTransactions.groupSorted.forEach((logbook) => {
                logbook.transactions.forEach((section) => {
                  section.data.forEach((transaction) => {
                    added.push(transaction.transaction_id);
                  });
                });
              });
              console.log({ added });
            }, 2000);
          }
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
              // prevTransaction: prevTransaction,
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
  );
  // unsubscribeTransactions = transactionsSubscription;

  // TAG : Categories Subscription //
  const unsubscribeCategories = firestore.getAndListenOneDoc(
    FIRESTORE_COLLECTION_NAMES.CATEGORIES,
    uid,
    (data) => {
      dispatchCategories({
        type: REDUCER_ACTIONS.CATEGORIES.SET,
        payload: data,
      });
    },
    (error) => alert(error)
  );
  // unsubscribeCategories = categoriesSubscription;

  // TAG : Budgets Subscription //
  const unsubscribeBudgets = firestore.getAndListenMultipleDocs(
    FIRESTORE_COLLECTION_NAMES.BUDGETS,
    uid,
    (error) => alert(error),
    (data) => {},
    (data) => {}
    // dispatchBudgets({
    //   type: REDUCER_ACTIONS.BUDGETS.SET,
    //   payload: data,
    // }),
  );

  if (subscribeAll) {
    console.log("subscribeAll");
    unsubscribeAppSettings;
    unsubscribeUserAccount;
    unsubscribeLogbooks;
    unsubscribeTransactions;
    unsubscribeCategories;
    unsubscribeBudgets;
    // return {
    // };
  }
  if (unsubscribeAll) {
    console.log("unsubscribeAll");
    unsubscribeAppSettings();
    unsubscribeUserAccount();
    unsubscribeLogbooks();
    unsubscribeTransactions();
    unsubscribeCategories();
    unsubscribeBudgets();
    // return () => {
    // };
  }
};

export default useFirestoreSubscriptions;
