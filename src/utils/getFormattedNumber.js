import CURRENCY_CONSTANTS from "../constants/currencyConstants";
import { useGlobalAppSettings } from "../reducers/GlobalContext";

/**
 * Formats a number. Supports changing symbol, thousand and decimal separators and more (see props).
 *
 * @param value The value to format
 * @param currencyIsoCode The currency isoCode to use
 * @param negativeSymbol Negative symbol to use
 * @param absolute If true, the number will be converted to absolute value
 * @returns
 */
const getFormattedNumber = ({
  value,
  currencyIsoCode,
  negativeSymbol,
  absolute = false,
}) => {
  const { thousandSeparator, decimalSeparator, significantDigits } =
    CURRENCY_CONSTANTS?.OPTIONS?.find((option) => {
      return option.isoCode === currencyIsoCode;
    });

  const showTrailingZeros = significantDigits > 0 ? true : false;

  // Check negative sign
  let isNegative = false;
  if (String(value).slice(0, 1) === "-") {
    isNegative = true;
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
  // if (showSymbol && Boolean(symbol)) {
  //   const formattedValueWithSymbol =
  //     symbolPosition === "after"
  //       ? `${formattedValue} ${symbol}`
  //       : `${symbol} ${formattedValue}`;
  //   return showSymbolSpace
  //     ? formattedValueWithSymbol
  //     : formattedValueWithSymbol.replace(" ", "");
  // }

  if (isNegative && !absolute) {
    const removedSymbol = formattedValue.replace("-", "");
    switch (negativeSymbol) {
      case "-":
        return `-${removedSymbol}`;
      case "()":
        return `(${removedSymbol})`;
      default:
        break;
    }
  } else {
    const removedSymbol = formattedValue.replace("-", "");
    return removedSymbol;
  }
};

export default getFormattedNumber;
