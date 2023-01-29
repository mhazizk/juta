import REDUCER_ACTIONS from "./reducer.action";

const globalTransactionsReducer = (state, action) => {
  let reducerUpdatedAt;
  switch (action.type) {
    // TAG : Transactions
    // Set Transactions
    case REDUCER_ACTIONS.TRANSACTIONS.SET:
      return {
        ...state,
        transactions: action.payload,
        transactionsPatchCounter: 0,
        transactionsInsertCounter: 0,
      };
    // TAG : Insert New Transaction
    case REDUCER_ACTIONS.TRANSACTIONS.INSERT:
      let insertedArray = [...state.transactions, action.payload];
      let count;

      if (!state.transactionsInsertCounter) {
        count = 1;
      } else {
        count = state.transactionsInsertCounter + 1;
      }
      return {
        ...state,
        transactions: insertedArray,
        transactionsInsertCounter: count,
      };

    // TAG : Patch Transaction
    case REDUCER_ACTIONS.TRANSACTIONS.PATCH:
      const filter = state.transactions.filter((transaction) => {
        return transaction.transaction_id !== action.payload.transaction_id;
      });
      const pushed = [...filter, action.payload];
      let patched;
      if (!state.transactionsPatchCounter) {
        patched = 1;
      } else {
        patched = state.transactionsPatchCounter + 1;
      }
      return {
        ...state,
        transactions: pushed,
        transactionsPatchCounter: patched,
      };

    // TAG : Delete One Transaction
    case REDUCER_ACTIONS.TRANSACTIONS.DELETE_ONE:
      const deleteFiltered = state.transactions.filter((transaction) => {
        return transaction.transaction_id !== action.payload;
      });
      let deleted;
      if (!state.transactionsDeleteCounter) {
        deleted = 1;
      } else {
        deleted = state.transactionsDeleteCounter + 1;
      }

      return {
        ...state,
        transactions: deleteFiltered,
        transactionsDeleteCounter: deleted,
      };

    // TAG : Clear Transactions
    case REDUCER_ACTIONS.TRANSACTIONS.CLEAR:
      return { ...state, transactions: null };

    // TAG : Sorted Transactions
    // Set Transactions
    case REDUCER_ACTIONS.GROUPED_TRANSACTIONS.SET:
      return { ...state, groupedTransactions: action.payload };

    // TAG : Logbooks
    // // Set Logbooks
    // case REDUCER_ACTIONS.LOGBOOKS.SET:
    //     return {
    //         ...state,
    //         logbooks: action.payload,
    //         logbooksLength: action.payload.length
    //     }

    // Insert Logbook
    // case REDUCER_ACTIONS.LOGBOOKS.INSERT:
    //     return { ...state, logbooks: [...state.logbooks, action.payload] }

    // Clear Logbooks
    // case REDUCER_ACTIONS.LOGBOOKS.SET:
    //     return { ...state, logbooks: null }

    // TAG : Categories
    // Set Categories
    // case REDUCER_ACTIONS.CATEGORIES.SET:
    //     return { ...state, categories: action.payload }

    // Clear Categories
    // case REDUCER_ACTIONS.CATEGORIES.SET:
    //     return { ...state, categories: null }

    // TAG : Multiple Actions
    // Set Initial Transactions, Logbooks, and Catogories
    case REDUCER_ACTIONS.MULTI_ACTIONS.SET_INIT_TRANSACTIONS:
      return {
        ...state,
        transactions: action.payload.transactions,
        transactionsPatchCounter: 0,
        transactionsInsertCounter: 0,
        transactionsDeleteCounter: 0,
        logbooks: action.payload.logbooks,
        logbooksPatchCounter: 0,
        logbooksLength: action.payload.logbooks.length,
        categories: action.payload.categories,
      };

    default:
      return state;
  }
};

export default globalTransactionsReducer;