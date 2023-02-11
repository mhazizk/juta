import axios from "axios";
import env from "../../config/env";

const fetchNewRate = async (currency) => {
  const { name, isoCode } = currency;
  const options = {
    method: "GET",
    url: env.rapidApi.url,
    params: { have: "USD", want: name, amount: "1" },
    headers: {
      "X-RapidAPI-Key": env.rapidApi.apiKey,
      "X-RapidAPI-Host": env.rapidApi.host,
    },
  };

  try {
    const { data } = await axios.request(options);
    const { new_amount } = data;
    return { name, isoCode, rate: new_amount };
  } catch (error) {
    console.log(error);
  }
};

const getUpdatedCurrency = async (currencyList) => {
  const updatedCurencyList = [];
  await currencyList.reduce(async (prev, curr) => {
    await prev;
    const updatedCurrency = await fetchNewRate(curr);
    updatedCurencyList.push(updatedCurrency);
  }, Promise.resolve());
  return updatedCurencyList;
};

// Fetch currency rate from API
const getCurrencyRate = async (currencyList) => {
  return await getUpdatedCurrency(currencyList);
};

export default getCurrencyRate;
