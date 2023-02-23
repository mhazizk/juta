import axios from "axios";
import SECRET_KEYS from "../../constants/secretManager";
import getSecretFromCloudFunctions from "../firebase/getSecretFromCloudFunctions";

const filterBadWords = async (text) => {
  const options = {
    method: "GET",
    url: "https://community-purgomalum.p.rapidapi.com/json",
    params: { text },
    headers: {
      "X-RapidAPI-Key": await getSecretFromCloudFunctions(
        SECRET_KEYS.RAPID_API_KEY
      ),
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
