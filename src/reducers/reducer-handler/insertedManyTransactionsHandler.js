import * as utils from "../../utils";

/*
 * Insert many transactions into existing state
 * @param message {Object} - the message object
 */
const insertedManyTransactionsHandler = (state, action) => {
  const newInsertedTransactions = action.payload.insertedTransactions;
  const reducerUpdatedAt = action.payload.reducerUpdatedAt;

  // STEP : 1. loop insert the new transactions
  let groupSortedHasBeenReplaced = null || state.groupSorted;
  newInsertedTransactions.forEach((newInsertedTransaction) => {
    // console.log(newInsertedTransaction);
    // STEP : 2. create new custom date
    const customInsertDate = utils.getCustomDate(
      newInsertedTransaction.details.date
    );

    // STEP : 3. get previous transaction
    // let existingTransaction = null;
    // state.groupSorted.forEach((logbook) => {
    //   logbook.transactions.forEach((section) => {
    //     section.data.forEach((transaction) => {
    //       if (
    //         transaction.transaction_id === newInsertedTransaction.transaction_id
    //       ) {
    //         existingTransaction = transaction;
    //       }
    //     });
    //   });
    // });

    // STEP : 4. create new custom date for previous transaction
    const foundLogbook = groupSortedHasBeenReplaced.find((logbook) => {
      return logbook.logbook_id === newInsertedTransaction.logbook_id;
    });
    // STEP : 5. find the section
    const foundSection = foundLogbook.transactions.find((section) => {
      if (section.customDate === customInsertDate) {
        return section;
      }
    });

    // TAG : if no section found, create new section

    //STEP : 6. insert the transaction
    let newSection;
    if (!foundSection) {
      newSection = {
        title: utils.getRelativeDate(newInsertedTransaction.details.date),
        customDate: customInsertDate,
        data: [newInsertedTransaction],
      };
    } else {
      newSection = {
        ...foundSection,
        data: [
          ...foundSection.data.map((transaction) => transaction),
          newInsertedTransaction,
        ].sort(sortDescendingTransactionsDate),
      };
    }

    // STEP : 7. replace the section
    const newLogbook = {
      ...foundLogbook,
      transactions: [
        ...foundLogbook.transactions.filter(
          (section) => section.customDate !== customInsertDate
        ),
        newSection,
      ].sort(sortDescendingLogbookTransactions),
    };

    // STEP : 8. replace the logbook
    groupSortedHasBeenReplaced = [
      ...groupSortedHasBeenReplaced.filter(
        (logbook) => logbook.logbook_id !== newInsertedTransaction.logbook_id
      ),
      newLogbook,
    ];
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

export default insertedManyTransactionsHandler;
