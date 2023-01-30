import { LogbookCurrencyType } from "./logbook";
import { GlobalThemeType } from "./theme";

/**
 * Type for global app settings
 *
 * @type AppSettingsType
 *
 */
export type GlobalAppSettingsType = {
  uid: string | number[];
  theme: GlobalThemeType;
  logbookSettings: LogbookSettingsType;
  dashboardSettings: DashboardSettingsType;
  currency: LogbookCurrencyType;
  currencyRate: CurrencyRatesType;
  locale: "en-US" | "id-ID";
  language: "english" | "indonesia";
  fontSize: "small" | "medium" | "large";
};

/**
 * Type for currency rates
 * @type CurrencyRatesType
 * @property {updatedAt} number - timestamp in milliseconds
 * @property {data} CurrencyRateType[] - array of currency rates
 *
 */
export type CurrencyRatesType = {
  updatedAt: number;
  data: CurrencyRateType[];
};

/**
 * Type for currency rate
 * @type CurrencyRateType
 * @property {name} enum - currency name 'USD' | 'IDR'
 * @property {rate} number - currency rate realtive to USD
 * 
 */
export type CurrencyRateType = {
  name: "USD" | "IDR";
  rate: number;
};

export type DashboardSettingsType = {
  showMyBudgetsWidget: boolean;
  showMyLogbooksWidget: boolean;
  showRecentTransactions: boolean;
  showTotalBalanceWidget: boolean;
  showTotalIncomeWidget: boolean;
  showTotalExpenseWidget: boolean;
};

export type LogbookSettingsType = {
  showSecondaryCurrency: boolean;
  showTransactionNotes: boolean;
  showTransactionTime: boolean;
  dailySummary:
    | "expense-only"
    | "income-only"
    | "expense-income"
    | "income-expense";
  defaultCurrency: LogbookCurrencyType;
  secondaryCurrency: LogbookCurrencyType;
};
