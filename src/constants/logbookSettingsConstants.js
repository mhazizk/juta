const LOGBOOK_SETTINGS_CONSTANTS = {
  DAILY_SUMMARY: {
    DEFAULT: "expense-income",
    USER: "expense-income",
    OPTIONS: [
      "expense-only",
      "income-only",
      "expense-income",
      "income-expense",
    ],
  },
  SHOW_TRANSACTION_TIME: {
    DEFAULT: 1,
    USER: 1,
    OPTIONS: [1, 0],
  },
  SHOW_TRANSACTION_NOTES: {
    DEFAULT: 1,
    USER: 1,
    OPTIONS: [1, 0],
  },
};

export default LOGBOOK_SETTINGS_CONSTANTS;
