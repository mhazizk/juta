// import { useContext, useMemo } from "react";
import persistStorage from "../reducers/persist/persistStorage";
import PERSIST_ACTIONS from "../reducers/persist/persist.actions";

// TAG : Convert and Save Transaction File
export const convertAndSaveTransctions = async (sortedTransactions) => {
  if (sortedTransactions) {
    // Get all transactions
    const transactionsToBeSaved = [];
    const getAllTransactions = sortedTransactions.groupSorted.forEach(
      (logbook) =>
        logbook.transactions.forEach((dateSection) =>
          dateSection.data.forEach((transaction) =>
            transactionsToBeSaved.push(transaction)
          )
        )
    );
    await persistStorage.asyncStorage({
      action: PERSIST_ACTIONS.SET,
      key: "transaction",
      rawValue: JSON.stringify(transactionsToBeSaved),
    });
  }
};

// TAG : Get Transaction File from storage
export const getTransactionsFromStorage = async () => {
  try {
    const json = await persistStorage.asyncStorage({
      action: PERSIST_ACTIONS.GET,
      key: "transaction",
    });
    if (json != null) {
      const parsed = JSON.parse(json);
      return parsed;
    }
  } catch (error) {
    alert(error);
  }
};

// TAG : Get Categories File from Storage
export const getCategoriesFromStorage = async () => {
  try {
    const json = await persistStorage.asyncStorage({
      action: PERSIST_ACTIONS.GET,
      key: "categories",
    });
    if (json != null) {
      const parsed = JSON.parse(json);
      return parsed;
    }
  } catch (error) {
    alert(error);
  }
};

// TAG : Get Logbooks File from Storage
export const getLogbooksFromStorage = async () => {
  try {
    const json = await persistStorage.asyncStorage({
      action: PERSIST_ACTIONS.GET,
      key: "logbooks",
    });

    if (json != null) {
      const parsed = JSON.parse(json);
      return parsed;
    }
  } catch (error) {
    alert(error);
  }
};

// TAG : Create new array group of logbook
const groupByLogbook = (logbooks) => {
  const grouped = Object.values(
    logbooks.map((logbook) => {
      return { logbook_id: logbook.logbook_id, transactions: [] };
    })
  );
  return grouped;
};

// TAG : Group transactions array by logbook id
const groupTransactionsByLogbook = (transactions) => {
  const grouped = Object.values(
    transactions.reduce((group, transaction) => {
      group[transaction.logbook_id] = group[transaction.logbook_id] || {
        logbook_id: transaction?.logbook_id,
        transactions: [],
      };
      group[transaction.logbook_id].transactions.push(transaction);
      return group;
    }, {})
  );
  return grouped;
};

// TAG : Sort transactions array from transactions
const sortTransactions = (prevTransaction, currentTransaction) => {
  if (prevTransaction.details.date < currentTransaction.details.date) {
    return 1;
  }
  if (prevTransaction.details.date > currentTransaction.details.date) {
    return -1;
  }
  return 0;
};

// TAG : Merge grouped logbooks and group sorted transactions by date
const mergeTransactionsByLogbook = ({
  groupedByLogbook,
  groupedTransactionsByDate,
}) => {
  const merged = groupedByLogbook.map((section) => {
    return {
      logbook_id: section.logbook_id,
      ...(groupedTransactionsByDate.filter((item) => {
        return item.logbook_id === section.logbook_id;
      })[0] && {
        transactions: groupedTransactionsByDate
          .filter((item) => {
            return item.logbook_id === section.logbook_id;
          })
          .map((item) => item.transactions)[0],
      }),
      ...(!groupedTransactionsByDate.filter((item) => {
        return item.logbook_id === section.logbook_id;
      })[0] && {
        transactions: [],
      }),
      // groupedTransactionsByDate.filter((item) => { return item.logbook_id === section.logbook_id }).map((item) => item.transactions)[0]
      // groupedTransactionsByDate.filter((item) => { return section.logbook_i === section.logbook_id }).length
    };
  });
  return merged;
};

// TAG : Group transactions array by date
const groupByDate = (array) => {
  if (array) {
    const grouped = Object.values(
      array.reduce((group, transaction) => {
        group[new Date(transaction.details.date).toLocaleDateString()] = group[
          new Date(transaction.details.date).toLocaleDateString()
        ] || {
          title: new Date(transaction.details.date).toLocaleDateString(),
          customDate: `${new Date(transaction.details.date).getFullYear()}/${(
            "0" +
            (new Date(transaction.details.date).getMonth() + 1)
          ).slice(-2)}/${(
            "0" + new Date(transaction.details.date).getDate()
          ).slice(-2)}`,
          data: [],
        };
        group[
          new Date(transaction.details.date).toLocaleDateString()
        ].data.push(transaction);
        return group;
      }, {})
    );
    return grouped;
  }
};

// TAG : New Sorted Transactions //
export const initSortedTransactions = async () => {
  const loadTransactions = persistStorage.asyncStorage({
    action: PERSIST_ACTIONS.GET,
    key: "transactions",
  });
  const loadLogbooks = persistStorage.asyncStorage({
    action: PERSIST_ACTIONS.GET,
    key: "logbooks",
  });
  const loadCategories = persistStorage.asyncStorage({
    action: PERSIST_ACTIONS.GET,
    key: "categories",
  });

  return Promise.all([loadCategories, loadLogbooks, loadTransactions]).then(
    (array) => {
      if (array[2]) {
      }
    }
  );
};

// TAG : Set Sorted Transactions //
export const setSortedTransactions = async (updatedTransactions = null) => {
  // try {
  const loadTransactions = persistStorage.asyncStorage({
    action: PERSIST_ACTIONS.GET,
    key: "transactions",
  });
  const loadLogbooks = persistStorage.asyncStorage({
    action: PERSIST_ACTIONS.GET,
    key: "logbooks",
  });
  const loadCategories = persistStorage.asyncStorage({
    action: PERSIST_ACTIONS.GET,
    key: "categories",
  });

  let sorted;
  let groupedByLogbook;
  let groupedTransactionsByLogbook;
  let sortedTransactions;
  let groupedTransactionsByDate;
  let finalMerged;

  return Promise.all([
    updatedTransactions,
    loadTransactions,
    loadLogbooks,
    loadCategories,
  ])
    .then((array) => {
      if (!array[0]) {
        // Create new array of objects based on logbook id in logbooks (data A)
        groupedByLogbook = groupByLogbook(array[2]);

        // Create new array of objects based on logbook id in transactions (data B)
        groupedTransactionsByLogbook = groupTransactionsByLogbook(array[1]);

        // Sort date grouped transactions in descending (data B)
        sortedTransactions = groupedTransactionsByLogbook.map((item) => {
          return {
            logbook_id: item.logbook_id,
            transactions: item.transactions.sort(sortTransactions),
          };
        });

        // Group sorted date transactions into section (data B)
        groupedTransactionsByDate = sortedTransactions.map((item) => {
          return {
            logbook_id: item.logbook_id,
            transactions: groupByDate(item.transactions),
          };
        });

        // Merge (data A) and (data B) into (data C)
        finalMerged = mergeTransactionsByLogbook({
          groupedByLogbook: groupedByLogbook,
          groupedTransactionsByDate: groupedTransactionsByDate,
        });

        // console.log(finalMerged)

        return finalMerged;
      }

      if (array[0]) {
        // Create new array of objects based on logbook id in logbooks (data A)
        groupedByLogbook = groupByLogbook(array[2]);

        // Create new array of objects based on logbook id in transactions (data B)
        groupedTransactionsByLogbook = groupTransactionsByLogbook(array[0]);

        // Sort date grouped transactions in descending (data B)
        sortedTransactions = groupedTransactionsByLogbook.map((item) => {
          return {
            logbook_id: item.logbook_id,
            transactions: item.transactions.sort(sortTransactions),
          };
        });

        // Group sorted date transactions into section (data B)
        groupedTransactionsByDate = sortedTransactions.map((item) => {
          return {
            logbook_id: item.logbook_id,
            transactions: groupByDate(item.transactions),
          };
        });

        // Merge (data A) and (data B) into (data C)
        finalMerged = mergeTransactionsByLogbook({
          groupedByLogbook: groupedByLogbook,
          groupedTransactionsByDate: groupedTransactionsByDate,
        });

        // console.log(finalMerged)

        return finalMerged;
      }
    })
    .catch((error) => console.log(error));
};

// TAG : Modify Sorted Transactions Data //
const modifySortedTransactions = async ({
  newTransaction,
  patchTransaction,
  deleteTransaction,
}) => {
  const newTrx = newTransaction ? newTransaction : null;
  const patchTrx = patchTransaction ? patchTransaction : null;
  const deleteTrx = deleteTransaction ? deleteTransaction : null;

  // New Transactions
};

// TAG : Set Initial App Settings //
// export const SetInitialAppSettings = () => {

//     const { appSettings, dispatchAppSettings } = useGlobalAppSettings();

//     dispatchAppSettings({
//         type: ACTIONS.APP_SETTINGS.THEME.SET,
//         payload: 'light'
//     });
//     dispatchAppSettings({
//         type: ACTIONS.APP_SETTINGS.LANGUAGE.SET,
//         payload: 'english'
//     });
//     dispatchAppSettings({
//         type: ACTIONS.APP_SETTINGS.FONT_SIZE.SET,
//         payload: 'medium'
//     })

// }
// TAG : Set Initial User Account //
// export const SetInitialUserAccount = () => {
//     const { userAccount, dispatchUserAccount } = useGlobalUserAccount();

//     dispatchUserAccount({
//         type: ACTIONS.USER_ACCOUNT.NICKNAME.SET,
//         payload: 'Haziz'
//     })
//     dispatchUserAccount({
//         type: ACTIONS.USER_ACCOUNT.EMAIL.SET,
//         payload: 'mhazizk@gmail.com'
//     })
//     dispatchUserAccount({
//         type: ACTIONS.USER_ACCOUNT.TOKEN.SET,
//         payload: '123456789'
//     })
//     dispatchUserAccount({
//         type: ACTIONS.USER_ACCOUNT.VERIFICATION.SET,
//         payload: true
//     })
// }

// TAG : Set Initial Transactions
// export const SetInitialTransactions = () => {
//     const { state, dispatch } = useGlobalTransactions();

//     dispatch({
//         type: ACTIONS.TRANSACTIONS.SET,
//         payload: getFileFromStorage()
//     })

//     dispatch({
//         type: ACTIONS.LOGBOOKS.SET,
//         payload: userLogBooks
//     });
//     dispatch({
//         type: ACTIONS.CATEGORIES.SET,
//         payload: userCategories
//     });
// }
