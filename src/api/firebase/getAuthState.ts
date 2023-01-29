import { onAuthStateChanged } from "firebase/auth/react-native";
import auth from "./auth";

const authStateDidChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

export default authStateDidChange;
