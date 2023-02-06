import auth from "./auth";
import { sendPasswordResetEmail } from "firebase/auth/react-native";
import { Alert } from "react-native";

const forgotPassword = async (email) => {
  //   const actionCodeSettings = {
  //     handleCodeInApp: true,
  //   };
  await sendPasswordResetEmail(auth, email)
    .then(() => {
      // Verification email sent.
      alert(`Reset password link sent to ${email}`);
    })
    .catch((error) => {
      // Error occurred. Inspect error.code.
      switch (error.code) {
        case "auth/user-not-found":
          Alert.alert("Error", "User not found");
          break;
        default:
          Alert.alert("Error", error.message.replace("Firebase: ", ""));
          break;
      }
    });
};

export default forgotPassword;
