import { Alert } from "react-native";
import createNewUser from "../api/firebase/createNewUser";

const handleUserSignUp = async ({ email, password }) => {
  let count = 0;
  const maxCount = 3;
  while (true) {
    try {
      const userCredential = await createNewUser(email, password);
      const user = userCredential.user;
      return user;
    } catch (error) {
      if (++count == maxCount) {
        switch (true) {
          case error.message.includes("email-already-in-use"):
            Alert.alert("Account", "Email address is already registered");
            break;
          case error.message.includes("network-request-failed"):
            Alert.alert("Account", "Network request failed. Please try again");
            break;

          default:
            Alert.alert("Account", error.message.replace("Firebase: ", ""));
            break;
        }
      }
      return Promise.reject(error);
    }
  }
};

export default handleUserSignUp;
