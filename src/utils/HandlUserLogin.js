import { Alert } from "react-native";
import { auth } from "../api/firebaseConfig";

const handleUserLogin = async ({ email, password }) => {
  try {
    const userCredential = await auth.signInWithEmailAndPassword(
      email,
      password
    );
    const user = userCredential.user;
    return user;
  } catch (error) {
    switch (true) {
      case error.message.includes("user-not-found"):
        return Alert.alert("Account", "Email address is not registered");
      case error.message.includes("wrong-password"):
        return Alert.alert("Account", "Wrong password");

      default:
        return Alert.alert("Account", error.message.replace("Firebase: ", ""));
    }
  }
};

export default handleUserLogin;
