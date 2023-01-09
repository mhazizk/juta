import { Alert } from "react-native";
import createNewUser from "../api/firebase/createNewUser";

const handleUserSignUp = async ({ email, password }) => {
  try {
    const userCredential = await createNewUser(email, password);
    const user = userCredential.user;
    return user;
  } catch (error) {
    switch (true) {
      case error.message.includes("email-already-in-use"):
        return Alert.alert("Account", "Email address is already registered");
      case error.message.includes("network-request-failed"):
        return Alert.alert(
          "Account",
          "Network request failed. Please try again"
        );

      default:
        return Alert.alert("Account", error.message.replace("Firebase: ", ""));
    }
  }
};

export default handleUserSignUp;
