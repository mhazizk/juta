import convertCurrency from "./convertCurrency";
import FindById from "./FindById";

const getTotalAmountAndConvertToDefaultCurrency = ({
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
    if (transaction.details.in_out === "expense") {
      amount = +transaction.details.amount;
    } else {
      amount = -transaction.details.amount;
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
