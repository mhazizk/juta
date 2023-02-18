import convertCurrency from "./convertCurrency";
import FindById from "./FindById";

/**
 * Get total amount and convert to default currency
 *
 * @param invertResult  - if true, expense will be marked as (+) and income will be marked as (-)
 * @param transactions  - array of transaction details
 * @param logbooks - array of logbooks
 * @param targetCurrencyName - target currency name
 * @param globalCurrencyRates - global currency rates
 * @returns
 */
const getTotalAmountAndConvertToDefaultCurrency = ({
  invertResult = false,
  transactions,
  logbooks,
  targetCurrencyName,
  globalCurrencyRates,
}) => {
  let totalAmount = [];
  transactions?.forEach((transaction) => {
    const logbookCurrencyName = FindById.findLogbookById({
      id: transaction.logbook_id,
      logbooks: logbooks,
    }).logbook_currency.name;
    let amount = 0;
    switch (invertResult) {
      case true:
        if (transaction.details.in_out === "expense") {
          amount = +transaction.details.amount;
        } else {
          amount = -transaction.details.amount;
        }
        break;
      case false:
        if (transaction.details.in_out === "expense") {
          amount = -transaction.details.amount;
        } else {
          amount = +transaction.details.amount;
        }
        break;

      default:
        break;
    }
    const convertedAmount = convertCurrency({
      amount,
      from: logbookCurrencyName,
      target: targetCurrencyName,
      globalCurrencyRates,
    });
    totalAmount.push(convertedAmount);
  });
  return totalAmount.reduce((a, b) => a + b, 0);
};

export default getTotalAmountAndConvertToDefaultCurrency;
