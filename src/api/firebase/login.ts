import AsyncStorage from "@react-native-async-storage/async-storage";
import { setPersistence, signInWithEmailAndPassword } from "firebase/auth";
import { getReactNativePersistence } from "firebase/auth/react-native";
import auth from "./auth";

// Sign in with email and password
const loginAndPersist = (email, password) =>
  setPersistence(auth, getReactNativePersistence(AsyncStorage)).then(() => {
    return signInWithEmailAndPassword(auth, email, password);
  });

export default loginAndPersist;
