import { getFunctions, httpsCallable } from "firebase/functions";
import app from "./app";

const functions = getFunctions(app);

/**
 * Function to retrieve a secret from the cloud
 * 
 * @param secretKeyName - The name of the secret key to retrieve from the cloud
 * @returns 
 */
const getSecretFromCloud = async (secretKeyName) => {
  const callGetSecretFunction = httpsCallable(functions, "getSecret");
  return callGetSecretFunction({ secretKeyName }).then((result) => {
    const { data } = result;
    return data;
  });
};

export default getSecretFromCloud;
