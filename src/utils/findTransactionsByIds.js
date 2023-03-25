/**
 *
 * @param transactionIds - array of transaction ids
 * @param groupSorted - state of groupSorted from `sortedTransactions` reducer
 * @param callback - callback function
 * @returns array of transactions
 */
const findTransactionsByIds = ({ transactionIds, groupSorted, callback }) => {
  if (!transactionIds?.length || !groupSorted) {
    return callback([]);
  }

  if (!!transactionIds.length && groupSorted) {
    const foundTransactions = [];
    transactionIds.forEach((id) => {
      groupSorted.forEach((logbook) => {
        logbook.transactions.forEach((section) => {
          section.data.forEach((transaction) => {
            if (transaction.transaction_id === id) {
              foundTransactions.push(transaction);
            }
          });
        });
      });
    });

    return callback(
      foundTransactions.sort((a, b) => b.details.date - a.details.date)
    );
  }
};

export default findTransactionsByIds;
