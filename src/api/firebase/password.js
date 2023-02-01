// import auth from "./auth";
// import {
//   confirmPasswordReset,
//   sendPasswordResetEmail,
//   updatePassword,
//   verifyPasswordResetCode,
//   EmailAuthProvider,
//   reauthenticateWithCredential,
// } from "firebase/auth/react-native";

const resetPassword = async (email) => {
  // return await sendPasswordResetEmail(auth, email);
};

const reauthenticateOldPassword = async (oldPassword) => {
  // const credential = EmailAuthProvider.credential(
  //   auth.currentUser.email,
  //   oldPassword
  // );
  // return await reauthenticateWithCredential(auth.currentUser, credential);
};

const changePassword = async (newPassword) => {
  // return await updatePassword(auth.currentUser, newPassword);
};

const confirmResetPasswordCode = async (code) => {
  // return await verifyPasswordResetCode(auth, code);
};

const confirmPassReset = async (code, newPassword) => {
  // return await confirmPasswordReset(auth, code, newPassword);
};

const password = {
  reauthenticate: reauthenticateOldPassword,
  changePassword,
  resetPassword,
  confirmResetPasswordCode,
  confirmPassReset,
};

export default password;
