import CURRENCY_CONSTANTS from "../constants/currencyConstants";

/**
 * Legacy app settings currency conversion
 *
 * This function is used to convert legacy app settings currency data to new currency data
 *
 * @param legacyAppSettings - App settings with legacy currency data
 * @returns new app settings data with new currency data
 *
 * @example
 * const {defaultCurrency, secondaryCurrency} = appSettings.logbookSettings;
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
const legacyAppSettingsCurrencyConversion = (legacyAppSettings) => {
  const { defaultCurrency, secondaryCurrency } =
    legacyAppSettings.logbookSettings;
  let newDefaultCurrency = defaultCurrency;
  let newSecondaryCurrency = secondaryCurrency;

  if (!defaultCurrency?.hasOwnProperty("currencyCode")) {
    switch (defaultCurrency.name) {
      case "USD":
        const USDCurrency = CURRENCY_CONSTANTS.OPTIONS.find(
          (currency) => currency.name === "United States of America"
        );
        newDefaultCurrency = USDCurrency;
        break;
      case "EUR":
        const EUROCurrency = CURRENCY_CONSTANTS.OPTIONS.find(
          (currency) => currency.name === "France"
        );
        newDefaultCurrency = EUROCurrency;
        break;

      default:
        const otherCurrency = CURRENCY_CONSTANTS.OPTIONS.find(
          (currency) => currency.currencyCode === defaultCurrency.name
        );
        newDefaultCurrency = otherCurrency;
        break;
    }
  }
  if (!secondaryCurrency?.hasOwnProperty("currencyCode")) {
    switch (secondaryCurrency.name) {
      case "USD":
        const USDCurrency = CURRENCY_CONSTANTS.OPTIONS.find(
          (currency) => currency.name === "United States of America"
        );
        newSecondaryCurrency = USDCurrency;
        break;
      case "EUR":
        const EUROCurrency = CURRENCY_CONSTANTS.OPTIONS.find(
          (currency) => currency.name === "France"
        );
        newSecondaryCurrency = EUROCurrency;
        break;

      default:
        const otherCurrency = CURRENCY_CONSTANTS.OPTIONS.find(
          (currency) => currency.currencyCode === secondaryCurrency.name
        );
        newSecondaryCurrency = otherCurrency;
        break;
    }
  }

  return {
    ...legacyAppSettings,
    logbookSettings: {
      ...legacyAppSettings.logbookSettings,
      defaultCurrency: newDefaultCurrency,
      secondaryCurrency: newSecondaryCurrency,
    },
  };
};

export default legacyAppSettingsCurrencyConversion;
