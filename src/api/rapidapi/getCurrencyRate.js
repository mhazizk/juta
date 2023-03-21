import axios from "axios";
import env from "../../config/env";
import SECRET_KEYS from "../../constants/secretManager";
import getSecretFromCloudFunctions from "../firebase/getSecretFromCloudFunctions";

const fetchNewRate = async (currency) => {
  const { currencyCode } = currency;
  const options = {
    method: "GET",
    url: env.RAPID_API.URL,
    params: { have: "USD", want: currencyCode, amount: "1" },
    headers: {
      "X-RapidAPI-Key": await getSecretFromCloudFunctions(
        SECRET_KEYS.RAPID_API_KEY
      ),
      "X-RapidAPI-Host": env.RAPID_API.HOST,
    },
  };

  try {
    const { data } = await axios.request(options);
    const { new_amount } = data;
    if (!new_amount) return currency;
    return { ...currency, rate: new_amount };
  } catch (error) {
    console.log(error);
    return currency;
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
