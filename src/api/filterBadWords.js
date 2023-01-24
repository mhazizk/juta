import REDUCER_ACTIONS from "../reducers/reducer.action";
import axios from "axios";
import { useGlobalAppSettings } from "../reducers/GlobalContext";

const filterBadWords = async (text) => {
  const options = {
    method: "GET",
    url: "https://community-purgomalum.p.rapidapi.com/json",
    params: { text },
    headers: {
      "X-RapidAPI-Key": "e9ee1dd2e7mshd504c4cef4a0be6p1a0dadjsnd2b27b85c6ae",
      "X-RapidAPI-Host": "community-purgomalum.p.rapidapi.com",
    },
  };

  try {
    const { data } = await axios.request(options);
    const { result } = data;
    return result;
  } catch (error) {
    console.log(error);
  }
};

export default filterBadWords;
