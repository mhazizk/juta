import { useMemo, useState } from "react";
import CURRENCY_CONSTANTS from "../constants/currencyConstants";
import { useGlobalAppSettings } from "../reducers/GlobalContext";

let currency = null;

/**
 * Formats a number. Supports changing symbol, thousand and decimal separators and more (see props).
 *
 * @param value The value to format
 * @param currencyCountryName: The currency country name to use
 * @param negativeSymbol Negative symbol to use
 * @param absolute If true, the number will be converted to absolute value
 * @param useAbbreviation If true, the number will be abbreviated
 * @returns
 */
const getFormattedNumber = ({
  value,
  currencyCountryName,
  negativeSymbol,
  absolute = false,
  useAbbreviation = false,
}) => {
  if (currency?.name !== currencyCountryName) {
    const newCurrency = CURRENCY_CONSTANTS?.OPTIONS?.find((currency) => {
      return currency.name === currencyCountryName;
    });

    currency = newCurrency;
  }

  const { thousandSeparator, decimalSeparator, significantDigits } = currency;

  const newValue = value;

  // Check negative sign
  let isNegative = false;
  if (String(newValue).slice(0, 1) === "-") {
    isNegative = true;
  }

  let abbreviatedValue = null;
  let abbreviationSymbol = "";
  if (useAbbreviation) {
    const absoluteValue = Math.abs(newValue);
    const integerNumberLength = String(Math.round(absoluteValue)).length;
    switch (true) {
      case integerNumberLength > 12:
        abbreviatedValue = Math.round(absoluteValue / 1000000000000);
        abbreviationSymbol = "T";
        break;
      case integerNumberLength > 9:
        abbreviatedValue = Math.round(absoluteValue / 1000000000);
        abbreviationSymbol = "B";
        break;
      case integerNumberLength > 6:
        abbreviatedValue = Math.round(absoluteValue / 1000000);
        abbreviationSymbol = "M";
        break;
      case integerNumberLength > 3:
        abbreviatedValue = Math.round(absoluteValue / 1000);
        abbreviationSymbol = "K";
        break;

      default:
        break;
    }
    if (isNegative) abbreviatedValue = abbreviatedValue * -1;
  }

  const showTrailingZeros = significantDigits > 0 ? true : false;

  const valueToProcess = abbreviatedValue || newValue || Number("0");

  const significantDigitsExponent = 10 ** significantDigits;
  const valueWithSignificantDigits = showTrailingZeros
    ? // If significant digits is 2 then this is e.g. 1.00, 1.10, 1.11
      valueToProcess.toFixed(significantDigits)
    : // If significant digits is 2 then this is e.g. 1, 1.1, 1.11
      `${
        Math.round(
          (valueToProcess + Number.EPSILON) * significantDigitsExponent
        ) / significantDigitsExponent
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

  const valueWithRemovedSymbol = formattedValue.replace("-", "");
  switch (true) {
    case isNegative && !absolute:
      let finalValue;
      switch (negativeSymbol) {
        case "-":
          finalValue = `-${valueWithRemovedSymbol}`;
          break;
        case "()":
          finalValue = `(${valueWithRemovedSymbol})`;
          break;
        default:
          break;
      }

      if (useAbbreviation) return `${finalValue}${abbreviationSymbol}`;
      return finalValue;

    default:
      if (useAbbreviation)
        return `${valueWithRemovedSymbol}${abbreviationSymbol}`;

      return valueWithRemovedSymbol;
  }
};

export default getFormattedNumber;
