import {
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth/react-native";
import { getFunctions, httpsCallable } from "firebase/functions";
import { Alert } from "react-native";
import app from "./app";
import auth from "./auth";

/**
 * Wrapper function to call the cloud function to request user data deletion
 *
 * It authenticates the user with their email and password, then calls the cloud function `requestDeletion`
 *
 * @param uid - The uid of the user
 * @param email - The email of the user
 * @param password - The password of the user
 * @returns
 *
 */
const requestUserDataDeletion = async (uid, email, password) => {
  const credential = EmailAuthProvider.credential(email, password);
  return reauthenticateWithCredential(auth.currentUser, credential)
    .then(async (user) => {
      const functions = getFunctions(app);
      const requestDeletion = httpsCallable(functions, "requestDeletion");
      return requestDeletion({ uid, email })
        .then((result) => {
          Alert.alert(
            "Account deletion request",
            "Your account deletion request has been made. Your account will be deleted after 30 days."
          );
          return;
        })
        .catch((error) => {
          console.error(JSON.stringify(error, null, 2));
          return null;
        });
    })
    .catch((error) => {
      Alert.alert("Error", error.message.replace("Firebase: ", ""));
      return Promise.reject(error);
    });
};

export default requestUserDataDeletion;
