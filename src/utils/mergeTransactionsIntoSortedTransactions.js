import getCustomDate from "./getCustomDate";

const mergeTransactionsIntoSortedTransactions = (transactions, logbooks) => {
  const loadedLogbooks = logbooks.sort((a, b) => {
    return a.logbook_name.localeCompare(b.logbook_name);
  });
  const loadedTransactions = transactions;
  const groupSorted = [];

  loadedLogbooks.forEach((logbook) => {
    const foundTransactions = [];
    loadedTransactions.forEach((transaction) => {
      if (logbook.logbook_id === transaction.logbook_id) {
        foundTransactions.push(transaction);
      }
    });
    let section = null;
    if (foundTransactions.length > 0) {
      section = groupTransactionsByDate(foundTransactions);
    }
    groupSorted.push({
      logbook_id: logbook.logbook_id,
      transactions: section || [],
    });
  });

  return groupSorted;
};

export default mergeTransactionsIntoSortedTransactions;

// TAG : Group transactions array by date
const groupTransactionsByDate = (transactions) => {
  const sortedTransactions = transactions.sort((a, b) => {
    return b.details.date - a.details.date;
  });
  if (transactions) {
    const grouped = Object.values(
      sortedTransactions.reduce((group, transaction) => {
        group[new Date(transaction.details.date).toDateString()] = group[
          new Date(transaction.details.date).toDateString()
        ] || {
          title: new Date(transaction.details.date).toDateString(),
          customDate: getCustomDate(transaction.details.date),
          data: [],
        };
        group[new Date(transaction.details.date).toDateString()].data.push(
          transaction
        );
        return group;
      }, {})
    );
    return grouped;
  }
};
