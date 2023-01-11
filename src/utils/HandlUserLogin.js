import { Alert } from "react-native";
import {
  auth,
  signInAndPersist,
  signInWithEmailAndPassword,
} from "../api/firebaseConfig";

const handleUserLogin = async ({ email, password }) => {
  try {
    // const userCredential = await auth.signInWithEmailAndPassword(
    // const userCredential = await signInWithEmailAndPassword(email, password);
    const userCredential = await signInAndPersist(email, password);
    const user = userCredential.user;
    return user;
  } catch (error) {
    switch (true) {
      case error.message.includes("network-request-failed"):
        Alert.alert("Account", "Network request failed. Please try again");
        break;
      case error.message.includes("user-not-found"):
        Alert.alert("Account", "Email address is not registered");
        break;
      case error.message.includes("too-many-requests"):
        Alert.alert("Account", "Too many requests. Reset password to continue");
        break;
      case error.message.includes("wrong-password"):
        Alert.alert("Account", "Wrong password");
        break;

      default:
        Alert.alert("Account", error.message.replace("Firebase: ", ""));
        break;
    }
    return Promise.reject(error);
  }
};

export default handleUserLogin;
