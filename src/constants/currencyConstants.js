const CURRENCY_CONSTANTS = {
  DEFAULT: {
    name: "USD",
    symbol: "$",
    isoCode: "us",
    thousandSeparator: ",",
    significantDigits: 2,
    decimalSeparator: ".",
  },
  OPTIONS: [
    {
      name: "IDR",
      symbol: "Rp",
      isoCode: "id",
      thousandSeparator: ".",
      significantDigits: 0,
      decimalSeparator: ",",
    },
    {
      name: "USD",
      symbol: "$",
      isoCode: "us",
      thousandSeparator: ",",
      significantDigits: 2,
      decimalSeparator: ".",
    },
    {
      name: "EUR",
      symbol: "€",
      isoCode: "eu",
      thousandSeparator: ".",
      significantDigits: 2,
      decimalSeparator: ",",
    },
    {
      name: "GBP",
      symbol: "£",
      isoCode: "gb",
      thousandSeparator: ",",
      significantDigits: 2,
      decimalSeparator: ".",
    },
    {
      name: "JPY",
      symbol: "¥",
      isoCode: "jp",
      thousandSeparator: ",",
      significantDigits: 0,
      decimalSeparator: ".",
    },
  ],
};

export default CURRENCY_CONSTANTS;
