import * as utils from '../../utils'

/*
 * Insert many transactions into existing state
 * @param message {Object} - the message object
 */
const deletedManyTransactionsHandler = (state, action) => {
  const newDeletedTransactions = action.payload.deletedTransactions;
  const reducerUpdatedAt = action.payload.reducerUpdatedAt;

  // STEP : 1. loop insert the new transactions
  let groupSortedHasBeenReplaced = null || state.groupSorted;
  newDeletedTransactions.forEach((newDeletedTransaction) => {
    // console.log(newDeletedTransaction);

    // STEP : 2. find the logbook
    const foundLogbook = groupSortedHasBeenReplaced.find((logbook) => {
      return logbook.logbook_id === newDeletedTransaction.logbook_id;
    });

    // STEP : 3. find the existing section
    let foundSection = null;
    foundLogbook.transactions.forEach((section) => {
      section.data.forEach((transaction) => {
        if (
          transaction.transaction_id === newDeletedTransaction.transaction_id
        ) {
          foundSection = section;
        }
      });
    });

    //STEP : 4. delete the transaction
    const newSection = {
      ...foundSection,
      data:
        foundSection.data.length > 0
          ? [
              ...foundSection.data.filter(
                (transaction) =>
                  transaction.transaction_id !==
                  newDeletedTransaction.transaction_id
              ),
            ].sort(sortDescendingTransactionsDate)
          : [],
    };

    // STEP : 5. replace the section
    const newLogbook = {
      ...foundLogbook,
      transactions:
        newSection.data.length > 0 && foundLogbook.transactions.length > 0
          ? [
              ...foundLogbook.transactions.filter(
                (section) => section.customDate !== newSection.customDate
              ),
              newSection,
            ].sort(sortDescendingLogbookTransactions)
          : !newSection.data.length && foundLogbook.transactions.length > 0
          ? [
              ...foundLogbook.transactions.filter(
                (section) => section.customDate !== newSection.customDate
              ),
            ].sort(sortDescendingLogbookTransactions)
          : [],
    };

    // STEP : 7. replace the logbook
    groupSortedHasBeenReplaced =
      groupSortedHasBeenReplaced.length > 0
        ? [
            ...groupSortedHasBeenReplaced.filter(
              (logbook) =>
                logbook.logbook_id !== newDeletedTransaction.logbook_id
            ),
            newLogbook,
          ]
        : [];
  });

  return {
    ...state,
    reducerUpdatedAt,
    groupSorted: groupSortedHasBeenReplaced,
  };
};

const sortDescendingTransactionsDate = (a, b) => {
  return b.details.date - a.details.date;
};

const sortDescendingLogbookTransactions = (a, b) => {
  return b.customDate < a.customDate ? -1 : 1;
};

export default deletedManyTransactionsHandler;
