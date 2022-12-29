/**
 * Formats a number. Supports changing symbol, thousand and decimal separators and more (see props).
 * @param value The value to format
 * @param thousandSeparator The separator to use between thousands
 * @param decimalSeparator The separator to use before decimals
 * @param significantDigits The number of significant digits to show
 * @param showTrailingZeros Whether to show trailing zeros for significant digits (i.e. 1,00 if significant digits is 2)
 * @param symbol The  symbol to use
 * @param showSymbol Whether to show the symbol
 * @param symbolPosition Whether to show the symbol before or after the value
 * @param showSymbolSpace Whether to show a space between the  symbol and the value
 * @returns
 */
const getFormattedNumber = ({
  value,
  thousandSeparator,
  decimalSeparator,
  significantDigits,
  showTrailingZeros = false,
  currency,
  symbol,
  showSymbol,
  symbolPosition = "after",
  showSymbolSpace = true,
}) => {
  switch (true) {
    case currency === "en-US":
      symbol = "$";
      thousandSeparator = ",";
      decimalSeparator = ".";
      significantDigits = 2;
      break;
    case currency === "id-ID":
      symbol = "Rp";
      thousandSeparator = ".";
      significantDigits = 0;
      decimalSeparator = ",";
      break;
    default:
      symbol = "Rp";
      thousandSeparator = ".";
      significantDigits = 0;
      decimalSeparator = ",";
      break;
  }
  const significantDigitsExponent = 10 ** significantDigits;
  const valueWithSignificantDigits = showTrailingZeros
    ? // If significant digits is 2 then this is e.g. 1.00, 1.10, 1.11
      value.toFixed(significantDigits)
    : // If significant digits is 2 then this is e.g. 1, 1.1, 1.11
      `${
        Math.round((value + Number.EPSILON) * significantDigitsExponent) /
        significantDigitsExponent
      }`;

  // Split the value into the parts before and after the decimal point
  const [integerPart, fractionalPart] = valueWithSignificantDigits
    .toString()
    .split(".");
  // Replace thousand separator in integer part
  const formattedIntegerPart = `${integerPart.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    thousandSeparator
  )}`;
  // Add decimal separator and fractional part if needed
  const formattedValue = fractionalPart
    ? `${formattedIntegerPart}${decimalSeparator}${fractionalPart}`
    : formattedIntegerPart;

  // Add symbol
  if (showSymbol && Boolean(symbol)) {
    const formattedValueWithSymbol =
      symbolPosition === "after"
        ? `${formattedValue} ${symbol}`
        : `${symbol} ${formattedValue}`;
    return showSymbolSpace
      ? formattedValueWithSymbol
      : formattedValueWithSymbol.replace(" ", "");
  }

  return formattedValue;
};

export default getFormattedNumber;
