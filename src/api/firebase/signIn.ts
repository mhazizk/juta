import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getReactNativePersistence,
  setPersistence,
    signInWithEmailAndPassword,
  
} from "firebase/auth/react-native";
import auth from "./auth";

const signInAndPersist = (email, password) =>
  setPersistence(auth, getReactNativePersistence(AsyncStorage)).then(() => {
    return signInWithEmailAndPassword(auth, email, password);
  });

export default signInAndPersist;
