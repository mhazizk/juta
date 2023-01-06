import { Alert } from "react-native";
import { auth } from "../api/firebaseConfig";

const handleUserSignUp = async ({ email, password }) => {
  try {
    const userCredential = await auth.createUserWithEmailAndPassword(
      email,
      password
    );
    const user = userCredential.user;
    return user;
  } catch (error) {
    switch (true) {
      case error.message.includes("email-already-in-use"):
        return Alert.alert("Account", "Email address is already registered");

      default:
        return Alert.alert("Account", error.message.replace("Firebase: ", ""));
    }
  }
};

export default handleUserSignUp;
