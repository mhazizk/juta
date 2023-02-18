import CURRENCY_CONSTANTS from "../constants/currencyConstants";

const removeNumberSeparator = ({ value, currency }) => {
  console.log("value", value);
  const { symbol, thousandSeparator, decimalSeparator, significantDigits } =
    CURRENCY_CONSTANTS.OPTIONS.find((option) => {
      return option.name === currency;
    });

  const showTrailingZeros = significantDigits > 0 && showTrailingZeros;
  const regex =
    decimalSeparator === "." ? new RegExp(/[^0-9.]/g) : new RegExp(/[^0-9,]/g);

  // Get all the numbers from the value
  const valueWithoutSymbol = value.replace(regex, "");

  // Return the value as a number
  return parseFloat(valueWithoutSymbol);
};

export default removeNumberSeparator;
