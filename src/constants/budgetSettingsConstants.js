const BUDGET_SETTINGS_CONSTANTS = {
  FIRST_DAY_OF_THE_WEEK: {
    DEFAULT: "monday",
    OPTIONS: [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ],
  },
  FIRST_DATE_OF_THE_MONTH: {
    DEFAULT: 1,
    OPTIONS: () => {
      const arr = [];
      for (let i = 1; i <= 31; i++) {
        arr.push(i);
      }
      return arr;
    },
  },
  FIRST_MONTH_OF_THE_YEAR: {
    DEFAULT: "january",
    OPTIONS: [
      "january",
      "february",
      "march",
      "april",
      "may",
      "june",
      "july",
      "august",
      "september",
      "october",
      "november",
      "december",
    ],
  },
};
export default BUDGET_SETTINGS_CONSTANTS;
