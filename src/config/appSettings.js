import { colorOfTheYear2022 } from "../assets/themes/colorOfTheYear2022";
import { colorOfTheYear2023 } from "../assets/themes/colorOfTheYear2023";
import { darkTheme } from "../assets/themes/darkTheme";
import { lightTheme } from "../assets/themes/lightTheme";

const APP_SETTINGS = {
  THEME: {
    DEFAULT: { name: "Light Theme", id: "light", style: lightTheme },
    USER: { name: "Light Theme", id: "light", style: lightTheme },
    OPTIONS: [
      { name: "Light Theme", id: "light", style: lightTheme },
      { name: "Dark Theme", id: "dark", style: darkTheme },
      {
        name: "Color of The Year 2023",
        id: "colorOfTheYear2023",
        style: colorOfTheYear2023,
      },
      {
        name: "Color of The Year 2022",
        id: "colorOfTheYear2022",
        style: colorOfTheYear2022,
      },
    ],
  },
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
      DEFAULT: TRUE,
      USER: TRUE,
      OPTIONS: [TRUE, FALSE],
    },
    SHOW_TRANSACTION_NOTES: {
      DEFAULT: TRUE,
      USER: TRUE,
      OPTIONS: [TRUE, FALSE],
    },
  },
};

export default APP_SETTINGS;
