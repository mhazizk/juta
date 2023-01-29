const mergeTransactionsIntoSortedTransactions = (transactions, logbooks) => {
  const loadedLogbooks = logbooks;
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

  //   // Create new array of objects based on logbook id in logbooks (data A)
  //   groupedByLogbook = groupByLogbook(array[2]);

  //   // Create new array of objects based on logbook id in transactions (data B)
  //   groupedTransactionsByLogbook = groupTransactionsByLogbook(array[1]);

  //   // Sort date grouped transactions in descending (data B)
  //   sortedTransactions = groupedTransactionsByLogbook.map((item) => {
  //     return {
  //       logbook_id: item.logbook_id,
  //       transactions: item.transactions.sort(sortTransactions),
  //     };
  //   });

  //   // Group sorted date transactions into section (data B)
  //   groupedTransactionsByDate = sortedTransactions.map((item) => {
  //     return {
  //       logbook_id: item.logbook_id,
  //       transactions: groupByDate(item.transactions),
  //     };
  //   });

  //   // Merge (data A) and (data B) into (data C)
  //   finalMerged = mergeTransactionsByLogbook({
  //     groupedByLogbook: groupedByLogbook,
  //     groupedTransactionsByDate: groupedTransactionsByDate,
  //   });

  // console.log(finalMerged)

  //   return console.log(JSON.stringify(groupSorted));
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
          customDate: `${new Date(transaction.details.date).getFullYear()}/${(
            "0" +
            (new Date(transaction.details.date).getMonth() + 1)
          ).slice(-2)}/${(
            "0" + new Date(transaction.details.date).getDate()
          ).slice(-2)}`,
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
