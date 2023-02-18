// TAG : Format Currency
const formatCurrency = ({ amount, currency, negativeSymbol }) => {
  // let checkAmount = String(amount).replace(/[^a-zA-Z0-9 ]/g, '');
  // let checkAmount = String(amount).replace(/[^, ]/g, '');

  let cleanAmount = amount;
  let negative;

  // check negative sign
  if (String(cleanAmount).slice(0, 1) === "-") {
    let length = String(amount).length;
    cleanAmount = String(cleanAmount).slice(1, length);
    // console.log(cleanAmount)
    negative = true;
  }
  // let getLeft = String(amount).slice(0, length - 1)
  // console.log({ length })
  // console.log({ getLeft })
  // console.log(checkAmount)
  // console.log(typeof (checkAmount))
  let showFormattedAmount;

  switch (true) {
    case currency === "IDR":
      // showFormattedAmount = parseFloat(amount);
      // console.log({amount})
      showFormattedAmount = Number(cleanAmount)
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, "$&,");
      // console.log(showFormattedAmount)
      break;
    case currency === "USD":
      showFormattedAmount = Number(cleanAmount)
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, "$&,");
      break;

    default:
      break;
  }

  if (negative) {
    switch (negativeSymbol) {
      case "-":
        return `-${String(showFormattedAmount)}`;
      case "()":
        return `(${String(showFormattedAmount)})`;
      default:
        break;
    }
  } else {
    return String(showFormattedAmount);
  }
};

export const locale = ["IDR", "USD"];

export default formatCurrency;
