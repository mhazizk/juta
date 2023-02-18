/**
 *
 * @function convertCurrency
 * @description Convert currency from one currency to another
 *
 * @param amount Amount to convert
 * @param from Currency name to convert from
 * @param target Currency name to convert to
 * @param globalCurrencyRates Global currency rates from global state
 * @returns Converted amount in target currency
 */
const convertCurrency = ({ amount, from, target, globalCurrencyRates }) => {
  const { data } = globalCurrencyRates;
  const dollarRate = data?.find((c) => c.name === from).rate;
  const targetRate = data?.find((c) => c.name === target).rate;
  const amountInDollar = amount / dollarRate;
  const newAmount = amountInDollar * targetRate;

  return newAmount;
};

export default convertCurrency;
