import CURRENCY_CONSTANTS from "../../constants/currencyConstants";
import THEME_CONSTANTS from "../../constants/themeConstants";

const appSettingsFallback = {
  uid: null,
  _timestamps: {
    created_at: Date.now(),
    created_by: null,
    updated_at: Date.now(),
    updated_by: null,
  },
  fontSize: "medium",
  language: "english",
  locale: "en-US",
  dashboardSettings: {
    showRecentTransactions: true,
    showTotalBalanceWidget: true,
    showTotalExpenseWidget: true,
    showTotalIncomeWidget: true,
    showMyBudgetsWidget: true,
    showMyLogbooksWidget: true,
    showMyLoansWidget: true,
  },
  searchSettings: { showTransactionsResult: true, showSettingsResult: true },
  logbookSettings: {
    defaultCurrency: CURRENCY_CONSTANTS.DEFAULT,
    secondaryCurrency: CURRENCY_CONSTANTS.OPTIONS.find((currency) => {
      return currency.isoCode === "eu";
    }),
    showSecondaryCurrency: false,
    showTransactionNotes: true,
    negativeCurrencySymbol: "-",
    showTransactionTime: true,
    dailySummary: "expense-only",
  },
  hiddenScreens: [],
  currency: CURRENCY_CONSTANTS.DEFAULT,
  theme_id: THEME_CONSTANTS.DEFAULT.id,
};
export default appSettingsFallback;
