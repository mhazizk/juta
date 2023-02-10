import axios from "axios";

const fetchNewRate = async (currency) => {
  const options = {
    method: "GET",
    url: "https://currency-converter-by-api-ninjas.p.rapidapi.com/v1/convertcurrency",
    params: { have: "USD", want: currency, amount: "1" },
    headers: {
      "X-RapidAPI-Key": "e9ee1dd2e7mshd504c4cef4a0be6p1a0dadjsnd2b27b85c6ae",
      "X-RapidAPI-Host": "currency-converter-by-api-ninjas.p.rapidapi.com",
    },
  };

  try {
    const { data } = await axios.request(options);
    const { new_amount } = data;
    return { name: currency, rate: new_amount };
  } catch (error) {
    console.log(error);
  }
};

const getUpdatedCurrency = async (currencyList) => {
  const updatedCurencyList = [];
  await currencyList.reduce(async (prev, curr) => {
    await prev;
    const updatedCurrency = await fetchNewRate(curr.name);
    updatedCurencyList.push(updatedCurrency);
  }, Promise.resolve());
  return updatedCurencyList;
};

// Fetch currency rate from API
const getCurrencyRate = async (currencyList) => {
  return await getUpdatedCurrency(currencyList);
};

export default getCurrencyRate;
