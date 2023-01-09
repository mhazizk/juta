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
        return Alert.alert("Account", "Network request failed. Please try again");
      case error.message.includes("user-not-found"):
        return Alert.alert("Account", "Email address is not registered");
      case error.message.includes("too-many-requests"):
        return Alert.alert(
          "Account",
          "Too many requests. Reset password to continue"
        );
      case error.message.includes("wrong-password"):
        return Alert.alert("Account", "Wrong password");

      default:
        return Alert.alert("Account", error.message.replace("Firebase: ", ""));
    }
  }
};

export default handleUserLogin;
