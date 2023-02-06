import auth from "./auth";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updateEmail,
} from "firebase/auth/react-native";
import { Alert } from "react-native";

const changeEmail = async (oldEmail, newEmail, password) => {
  const credential = EmailAuthProvider.credential(oldEmail, password);
  return reauthenticateWithCredential(auth.currentUser, credential)
    .then((user) => {
      updateEmail(user.user, newEmail)
        .then(() => {
          // Verification email sent.
          alert("Email updated");
          return Promise.resolve();
        })
        .catch((error) => {
          // Error occurred. Inspect error.code.
          switch (error.code) {
            case "auth/email-already-in-use":
              Alert.alert("Error", "Email already in use");
              break;

            default:
              Alert.alert("Error", error.message.replace("Firebase: ", ""));
              break;
          }
          return Promise.reject(error);
        });
    })
    .catch((error) => {
      Alert.alert("Error", error.message.replace("Firebase: ", ""));
      return Promise.reject(error);
    });

};

export default changeEmail;
