import { getFunctions, httpsCallable } from "firebase/functions";
import app from "./app";

/**
 * Function to retrieve a secret from the cloud functions
 *
 * @param secretKeyName - The name of the secret key to retrieve from the cloud
 * @returns
 */
const getSecretFromCloudFunctions = async (secretKeyName) => {
  const functions = getFunctions(app);
  const callGetSecretFunction = httpsCallable(functions, "getSecret");
  return callGetSecretFunction({ secretKeyName })
    .then((result) => {
      const { data } = result;
      return data;
    })
    .catch((error) => {
      console.error(JSON.stringify(error, null, 2));
      return null;
    });
};

export default getSecretFromCloudFunctions;
