// import {
//   getReactNativePersistence,
//   setPersistence,
//   signInWithEmailAndPassword,
// } from "firebase/auth/react-native";
// import auth from "./auth";
import auth from "@react-native-firebase/auth";

const signInAndPersist = (email, password) => {
  return auth().signInWithEmailAndPassword(email, password);
};
// setPersistence(auth, getReactNativePersistence(AsyncStorage)).then(() => {
//   return signInWithEmailAndPassword(auth, email, password);
// });

export default signInAndPersist;
