import getTotalAmountAndConvertToDefaultCurrency from "./getTotalAmountAndConvertToDefaultCurrency";
import getTransactionsByLogbookId from "./getTransactionsByLogbookId";
/**
 * Check if total amount is 0 in a loan contact
 *
 * @param newTransaction - Add new transaction to existing loan transaction
 * @param deleteTransaction - Delete transaction from existing loan transaction
 * @param logbookId - logbook id
 * @param targetCurrencyName - target currency name
 * @param globalCurrencyRates - global currency rates
 * @param groupSorted - groupSorted object
 * @param logbooks - array of logbooks
 * @returns isPaid - true if total amount is 0
 */
const checkIfLoanContactWillBePaid = ({
  newTransaction = null,
  deleteTransaction = null,
  transactionDetailsList,
  targetCurrencyName,
  globalCurrencyRates,
  groupSorted,
  logbooks,
}) => {
  let isPaid = false;
  let totalAmount = 0;
  const existingTotalAmount = getTotalAmountAndConvertToDefaultCurrency({
    transactions: transactionDetailsList,
    logbooks,
    targetCurrencyName,
    globalCurrencyRates,
  });

  switch (true) {
    case deleteTransaction !== null && newTransaction !== null:
      switch (newTransaction.details.in_out) {
        case "expense":
          totalAmount =
            existingTotalAmount +
            deleteTransaction.details.amount -
            newTransaction.details.amount;
          break;
        case "income":
          totalAmount =
            existingTotalAmount -
            deleteTransaction.details.amount +
            newTransaction.details.amount;
          break;
      }
      break;
    case newTransaction !== null:
      switch (newTransaction.details.in_out) {
        case "expense":
          totalAmount = existingTotalAmount - newTransaction.details.amount;
          break;
        case "income":
          totalAmount = existingTotalAmount + newTransaction.details.amount;
          break;
      }
      break;
    case deleteTransaction !== null:
      switch (deleteTransaction.details.in_out) {
        case "expense":
          totalAmount = existingTotalAmount + deleteTransaction.details.amount;
          break;
        case "income":
          totalAmount = existingTotalAmount - deleteTransaction.details.amount;
          break;
      }
      break;
  }

  if (totalAmount === 0) {
    isPaid = true;
  } else {
    isPaid = false;
  }
  return isPaid;
};
export default checkIfLoanContactWillBePaid;
