
const APP_SETTINGS = {
  // THEME: {
  //   DEFAULT: { name: "Light Theme", id: "light", style: lightMonoTheme },
  //   USER: { name: "Light Theme", id: "light", style: lightMonoTheme },
  //   OPTIONS: [
  //     { name: "Light Theme", id: "light", style: lightMonoTheme },
  //     { name: "Dark Theme", id: "dark", style: darkMonoTheme },
  //     {
  //       name: "Color of The Year 2023",
  //       id: "colorOfTheYear2023",
  //       style: colorOfTheYear2023,
  //     },
  //     {
  //       name: "Color of The Year 2022",
  //       id: "colorOfTheYear2022",
  //       style: darkColorTheme,
  //     },
  //   ],
  // },
  FONT_SIZE: {
    DEFAULT: "medium",
    USER: "medium",
    OPTIONS: ["small", "medium", "large"],
  },
  LANGUAGE: {
    DEFAULT: { name: "english", locale: "en-US" },
    USER: { name: "english", locale: "en-US" },
    OPTIONS: [{ name: "english", locale: "en-US" }],
  },
  CURRENCY: {
    DEFAULT: { name: "IDR", symbol: "Rp", isoCode: "id" },
    USER: { name: "IDR", symbol: "Rp", isoCode: "id" },
    OPTIONS: [
      { name: "IDR", symbol: "Rp", isoCode: "id" },
      { name: "USD", symbol: "$", isoCode: "us" },
    ],
  },
  DECIMALS: {
    DEFAULT: true,
    USER: true,
    OPTIONS: [false, true],
  },
  LOGBOOKS: {
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
  },
};

export default APP_SETTINGS;
