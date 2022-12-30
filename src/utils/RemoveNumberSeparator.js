const removeNumberSeparator = ({ value, currency }) => {
  console.log("value", value);
  let symbol;
  let thousandSeparator;
  let decimalSeparator;
  let significantDigits;
  let regex;
  const showTrailingZeros = true;
  switch (true) {
    case currency === "USD":
      symbol = "$";
      thousandSeparator = ",";
      decimalSeparator = ".";
      significantDigits = 2;
      regex = new RegExp(/[^0-9.]/g);
      break;
    case currency === "IDR":
      symbol = "Rp";
      thousandSeparator = ".";
      significantDigits = 0;
      decimalSeparator = ",";
      regex = new RegExp(/[^0-9,]/g);
      break;
    default:
      symbol = "Rp";
      thousandSeparator = ".";
      significantDigits = 0;
      decimalSeparator = ",";
      regex = new RegExp(/[^0-9,]/g);
      break;
  }
  // Get all the numbers from the value
  const valueWithoutSymbol = value.replace(regex, "");

  // Return the value as a number
  return parseFloat(valueWithoutSymbol);
};

export default removeNumberSeparator;
