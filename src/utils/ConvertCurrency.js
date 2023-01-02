import { useGlobalAppSettings } from "../reducers/GlobalContext";

const convertCurrency = ({ amount, from, target }) => {
  const { appSettings } = useGlobalAppSettings();
  const dollarRate = appSettings.currencyRate.find((c) => c.name === from).rate;
  const targetRate = appSettings.currencyRate.find(
    (c) => c.name === target
  ).rate;
  const amountInDollar = amount / dollarRate;
  const newAmount = amountInDollar * targetRate;

  return newAmount;
};

export default convertCurrency;
