import auth from "./auth";
import {
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth/react-native";
import { Alert } from "react-native";

const updateAccountPassword = async (email, oldPassword, newPassword) => {
  const credential = EmailAuthProvider.credential(email, oldPassword);
  return reauthenticateWithCredential(auth.currentUser, credential)
    .then((user) => {
      updatePassword(user.user, newPassword)
        .then(() => {
          alert("Password updated!");
          return Promise.resolve();
        })
        .catch((error) => {
          Alert.alert("Error", error.message.replace("Firebase: ", ""));
          return Promise.reject(error);
        });
    })
    .catch((error) => {
      switch (error.code) {
        case "auth/wrong-password":
          Alert.alert("Error", "Wrong current password");
          break;
        default:
          Alert.alert("Error", error.message.replace("Firebase: ", ""));
          break;
      }

      return Promise.reject(error);
    });
};

export default updateAccountPassword;
