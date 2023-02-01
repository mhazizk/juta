import { Alert } from "react-native";
// import loginAndPersist from "../api/firebase/login";
import auth from "@react-native-firebase/auth";

const handleUserLogin = async ({ email, password }) => {
  try {
    // const userCredential = await auth.signInWithEmailAndPassword(
    // const userCredential = await signInWithEmailAndPassword(email, password);
    // const userCredential = await loginAndPersist(email, password);
    const userCredential = await auth().signInWithEmailAndPassword(
      email,
      password
    );

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
