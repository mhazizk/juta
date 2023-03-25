import CURRENCY_CONSTANTS from "../../constants/currencyConstants";

const initialGlobalCurrencyRates = {
  // uid: null,
  data: CURRENCY_CONSTANTS.OPTIONS.map((currency) => ({
    ...currency,
    rate: 1,
  })),
  _timestamps: {
    createdAt: Date.now(),
    createdBy: null,
    updatedAt: Date.now(),
    updatedBy: null,
  },
};
export default initialGlobalCurrencyRates;
