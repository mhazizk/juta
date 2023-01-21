import REDUCER_ACTIONS from "./reducer.action";

const globalRepeatedTransactionsReducer = (state, action) => {
  let reducerUpdatedAt;
  switch (action.type) {
    case REDUCER_ACTIONS.REPEATED_TRANSACTIONS.FORCE_SET:
      return action.payload;

    case REDUCER_ACTIONS.REPEATED_TRANSACTIONS.INSERT:
      const newRepeatedTransaction = action.payload.repeatedTransaction;
      reducerUpdatedAt = action.payload.reducerUpdatedAt;

      // check if the repeat transaction is already in the state
      const transactionInState = state.repeatedTransactions.find((repeatTransaction) => {
        return repeatTransaction.repeat_id === newRepeatedTransaction.repeat_id;
      });

      let updateTimeStamp = false;
      if (repeatedTransactionInState) {
        isTimestampNewer =
          patchRepeatedTransaction._timestamps.updated_at ===
          repeatedTransactionInState._timestamps.updated_at;
      }

      if (!transactionInState && !updateTimeStamp) {
        if (state.length > 0) {
          return {
            ...state,
            reducerUpdatedAt: reducerUpdatedAt,
            repeatedTransactions: [...state, newRepeatedTransaction].sort(
              (a, b) => {
                return a.next_repeat_date - b.next_repeat_date;
              }
            ),
          };
        } else {
          return {
            ...state,
            reducerUpdatedAt: reducerUpdatedAt,
            repeatedTransactions: [newRepeatedTransaction],
          };
        }
      }
      return state;

    case REDUCER_ACTIONS.REPEATED_TRANSACTIONS.PATCH:
      const patchRepeatedTransaction = action.payload.repeatedTransaction;
      reducerUpdatedAt = action.payload.reducerUpdatedAt;
      // get other repeat transactions

      // check if the repeat transaction is already in the state
      const repeatedTransactionInState = state.repeatedTransactions.find((repeatTransaction) => {
        return (
          repeatTransaction.repeat_id === patchRepeatedTransaction.repeat_id
        );
      });

      // check timestamp
      let isTimestampNewer = false;
      if (repeatedTransactionInState) {
        isTimestampNewer =
          patchRepeatedTransaction._timestamps.updated_at >
          repeatedTransactionInState._timestamps.updated_at;
      }

      if (repeatedTransactionInState && isTimestampNewer) {
        const otherRepeatTransactions = state.repeatedTransactions.filter(
          (repeatTransaction) =>
            repeatTransaction.repeat_id !== patchRepeatedTransaction.repeat_id
        );
        if (otherRepeatTransactions.length > 0) {
          return {
            ...state,
            reducerUpdatedAt,
            repeatedTransactions: [
              ...otherRepeatTransactions,
              patchRepeatedTransaction,
            ].sort((a, b) => {
              return a.next_repeat_date - b.next_repeat_date;
            }),
          };
        } else {
          return {
            ...state,
            reducerUpdatedAt,
            repeatedTransactions: [patchRepeatedTransaction],
          };
        }
      }

      return state;

    // case REDUCER_ACTIONS.REPEATED_TRANSACTIONS.PATCH_MANY:
    //   const repeatedTransactions = action.payload.repeatedTransactions;
    //   // const patchedTransactions = action.payload.patchedTransactions;

    //   // get other repeat transactions

    //   // check if the repeat transaction is already in the state
    //   const repeatedTransactionInState = state.find((repeatTransaction) => {
    //     return (
    //       repeatTransaction.repeat_id === patchRepeatedTransaction.repeat_id
    //     );
    //   });

    //   // check timestamp
    //   let timestamp = true;
    //   if (repeatedTransactionInState) {
    //     timestamp =
    //       patchRepeatedTransaction._timestamps.updated_at ===
    //       repeatedTransactionInState._timestamps.updated_at;
    //   }

    //   if (repeatedTransactionInState && !timestamp) {
    //     const otherRepeatTransactions = state.filter(
    //       (repeatTransaction) =>
    //         repeatTransaction.repeat_id !== patchRepeatedTransaction.repeat_id
    //     );
    //     if (otherRepeatTransactions.length > 0) {
    //       return [...otherRepeatTransactions, patchRepeatedTransaction].sort(
    //         (a, b) => {
    //           return a.next_repeat_date - b.next_repeat_date;
    //         }
    //       );
    //     } else {
    //       return [patchRepeatedTransaction];
    //     }
    //   }

    //   return state;

    case REDUCER_ACTIONS.REPEATED_TRANSACTIONS.DELETE_ONE:
      const deleteRepeatedTransaction =
        action.payload.deleteRepeatedTransaction;
      reducerUpdatedAt = action.payload.reducerUpdatedAt;
      // get other repeat transactions
      const otherNotDeletedRepeatTransactions = state.repeatedTransactions.filter(
        (repeatTransaction) =>
          repeatTransaction.repeat_id !== deleteRepeatedTransaction.repeat_id
      );
      if (otherNotDeletedRepeatTransactions.length > 0) {
        return {
          ...state,
          reducerUpdatedAt: reducerUpdatedAt,
          repeatedTransactions: [...otherNotDeletedRepeatTransactions].sort(
            (a, b) => {
              return a.next_repeat_date - b.next_repeat_date;
            }
          ),
        };
      } else {
        return {
          ...state,
          reducerUpdatedAt: reducerUpdatedAt,
          repeatedTransactions: [],
        };
      }
      return state;
    default:
      return state;
  }
};

export default globalRepeatedTransactionsReducer;
