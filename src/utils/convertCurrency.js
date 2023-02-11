const convertCurrency = ({ amount, from, target, globalCurrencyRates }) => {
  const { data } = globalCurrencyRates;
  const dollarRate = data?.find((c) => c.name === from).rate;
  const targetRate = data?.find((c) => c.name === target).rate;
  const amountInDollar = amount / dollarRate;
  const newAmount = amountInDollar * targetRate;

  return newAmount;
};

export default convertCurrency;
