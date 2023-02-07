import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  setPersistence,
  signInWithEmailAndPassword,
  getReactNativePersistence,
} from "firebase/auth/react-native";
import auth from "./auth";

// Sign in with email and password
const loginWithPersistOption = async ({ email, password, isPersist = false }) => {
  switch (isPersist) {
    case true:
      return setPersistence(auth, getReactNativePersistence(AsyncStorage)).then(
        () => {
          return signInWithEmailAndPassword(auth, email, password);
        }
      );
    case false:
      return signInWithEmailAndPassword(auth, email, password);
  }
};

export default loginWithPersistOption;
