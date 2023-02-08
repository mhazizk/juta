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
  },
  searchSettings: { showTransactionsResult: true, showSettingsResult: true },
  logbookSettings: {
    defaultCurrency: { name: "IDR", symbol: "Rp", isoCode: "id" },
    secondaryCurrency: { name: "USD", symbol: "$", isoCode: "us" },
    showSecondaryCurrency: false,
    showTransactionNotes: true,
    showTransactionTime: true,
    dailySummary: "expense-only",
  },
  currencyRate: {
    data: [
      { name: "USD", rate: 1 },
      { name: "IDR", rate: 14000 },
    ],
    updatedAt: 1673275538634,
  },
  hiddenScreens: [],
  currency: { name: "IDR", symbol: "Rp", isoCode: "id" },
  theme_id: THEME_CONSTANTS.DEFAULT.id,
};
export default appSettingsFallback;
