/**
 * Get transactions by logbook id
 *
 * @param groupSorted - groupSorted object
 * @param logbookId - logbook id
 * @returns array of transactions
 */
const getTransactionsByLogbookId = ({ groupSorted, logbookId }) => {
  let array = [];
  groupSorted.forEach((logbook) => {
    logbook.transactions.forEach((section) => {
      section.data.forEach((transaction) => {
        if (transaction.logbook_id === logbookId) {
          array.push(transaction);
        }
      });
    });
  });
  return array;
};

export default getTransactionsByLogbookId;
