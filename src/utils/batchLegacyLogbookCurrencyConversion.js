import CURRENCY_CONSTANTS from "../constants/currencyConstants";

/**
 * Batch legacy logbook currency conversion
 *
 * This function is used to convert legacy currency data to new currency data
 *
 * @param legacyLogbookList - List of logbooks with legacy currency data
 * @returns new logbooks data with new currency data
 *
 * @example
 * const {logbook_currency} = logbook;
 *
 * const legacyCurrencyFormat = {
 * name: "USD",
 * symbol: "$",
 * isoCode: "USD",
 * decimalSeparator: ".",
 * thousandSeparator: ",",
 * significantDigits: 2,
 * }
 *
 * const newCurrencyFormat = {
 * name: "United States of America",
 * currencyCode: "USD",
 * symbol: "$",
 * isoCode: "USD",
 * decimalSeparator: ".",
 * thousandSeparator: ",",
 * significantDigits: 2,
 * }
 *
 */
const batchLegacyLogbookCurrencyConversion = (legacyLogbookList) => {
  const newLogbooksDataWithCurrencyCode = legacyLogbookList.map((logbook) => {
    if (!logbook.logbook_currency?.hasOwnProperty("currencyCode")) {
      let newLogbookCurrency;
      switch (logbook.logbook_currency.name) {
        case "USD":
          const USDCurrency = CURRENCY_CONSTANTS.OPTIONS.find(
            (currency) => currency.name === "United States of America"
          );
          newLogbookCurrency = USDCurrency;
          break;
        case "EUR":
          const EUROCurrency = CURRENCY_CONSTANTS.OPTIONS.find(
            (currency) => currency.name === "France"
          );
          newLogbookCurrency = EUROCurrency;
          break;

        default:
          const otherCurrency = CURRENCY_CONSTANTS.OPTIONS.find(
            (currency) =>
              currency.currencyCode === logbook.logbook_currency.name
          );
          newLogbookCurrency = otherCurrency;
          break;
      }
      return {
        ...logbook,
        logbook_currency: newLogbookCurrency,
      };
    }
    return logbook;
  });

  return newLogbooksDataWithCurrencyCode;
};

export default batchLegacyLogbookCurrencyConversion;
