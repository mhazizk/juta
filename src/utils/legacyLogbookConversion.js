import CURRENCY_CONSTANTS from "../constants/currencyConstants";

/**
 * Batch legacy logbook conversion
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
const legacyLogbookConversion = (legacyLogbookList) => {
  const convertedLogbookData = legacyLogbookList.map((logbook) => {
    let convertedLogbook = logbook;

    // add new `logbook_initial_balance_transaction_id` field
    if (!logbook.hasOwnProperty("logbook_initial_balance_transaction_id")) {
      convertedLogbook = {
        ...convertedLogbook,
        logbook_initial_balance_transaction_id: null,
      };
    }

    //  convert legacy currency format
    let newLogbookCurrency;
    if (!convertedLogbook.logbook_currency?.hasOwnProperty("currencyCode")) {
      switch (convertedLogbook.logbook_currency.name) {
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
      convertedLogbook = {
        ...convertedLogbook,
        logbook_currency: newLogbookCurrency,
      };
    }
    return convertedLogbook;
  });

  return convertedLogbookData;
};

export default legacyLogbookConversion;
