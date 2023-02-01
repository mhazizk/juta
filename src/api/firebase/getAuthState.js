// import { onAuthStateChanged } from "firebase/auth/react-native";
// import auth from "./auth";
import auth from "@react-native-firebase/auth";
const authStateDidChange = (callback) => {
  return auth().onAuthStateChanged(callback);
  // return onAuthStateChanged(auth, callback);
};

export default authStateDidChange;
