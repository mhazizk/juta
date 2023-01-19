import REDUCER_ACTIONS from "./reducer.action";

const globalRepeatedTransactionsReducer = (state, action) => {
  switch (action.type) {
    case REDUCER_ACTIONS.REPEATED_TRANSACTIONS.FORCE_SET:
      return action.payload;

    case REDUCER_ACTIONS.REPEATED_TRANSACTIONS.INSERT:
      const newRepeatedTransaction = action.payload;

      // check if the repeat transaction is already in the state
      const transactionInState = state.find((repeatTransaction) => {
        return repeatTransaction.repeat_id === newRepeatedTransaction.repeat_id;
      });

      let updateTimeStamp = false;
      if (repeatedTransactionInState) {
        timestamp =
          patchRepeatedTransaction._timestamps.updated_at ===
          repeatedTransactionInState._timestamps.updated_at;
      }

      if (!transactionInState && !updateTimeStamp) {
        if (state.length > 0) {
          return [...state, newRepeatedTransaction].sort((a, b) => {
            return a.next_repeat_date - b.next_repeat_date;
          });
        } else {
          return [newRepeatedTransaction];
        }
      }
      return state;

    case REDUCER_ACTIONS.REPEATED_TRANSACTIONS.PATCH:
      const patchRepeatedTransaction = action.payload;
      // get other repeat transactions

      // check if the repeat transaction is already in the state
      const repeatedTransactionInState = state.find((repeatTransaction) => {
        return (
          repeatTransaction.repeat_id === patchRepeatedTransaction.repeat_id
        );
      });

      // check timestamp
      let timestamp = true;
      if (repeatedTransactionInState) {
        timestamp =
          patchRepeatedTransaction._timestamps.updated_at ===
          repeatedTransactionInState._timestamps.updated_at;
      }

      if (repeatedTransactionInState && !timestamp) {
        const otherRepeatTransactions = state.filter(
          (repeatTransaction) =>
            repeatTransaction.repeat_id !== patchRepeatedTransaction.repeat_id
        );
        if (otherRepeatTransactions.length > 0) {
          return [...otherRepeatTransactions, patchRepeatedTransaction].sort(
            (a, b) => {
              return a.next_repeat_date - b.next_repeat_date;
            }
          );
        } else {
          return [patchRepeatedTransaction];
        }
      }

      return state;

    case REDUCER_ACTIONS.REPEATED_TRANSACTIONS.DELETE_ONE:
      const deleteRepeatedTransaction = action.payload;
      // get other repeat transactions
      const otherNotDeletedRepeatTransactions = state.filter(
        (repeatTransaction) =>
          repeatTransaction.repeat_id !== deleteRepeatedTransaction.repeat_id
      );
      if (otherNotDeletedRepeatTransactions.length > 0) {
        return [...otherNotDeletedRepeatTransactions].sort((a, b) => {
          return a.next_repeat_date - b.next_repeat_date;
        });
      } else {
        return [];
      }
      return state;
    default:
      return state;
  }
};

export default globalRepeatedTransactionsReducer;
