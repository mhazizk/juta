import auth from "./auth";
import { confirmPasswordReset, sendPasswordResetEmail, verifyPasswordResetCode } from "firebase/auth/react-native";

const resetPassword = async (email) => {
  return await sendPasswordResetEmail(auth, "email");
};


const confirmResetPasswordCode = async (code) => {
    return await verifyPasswordResetCode(auth, code);
}
    
const confirmPassReset = async (code, newPassword) => {
    return await confirmPasswordReset(auth, code, newPassword);
}