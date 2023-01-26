import {
  getAuth,
  onAuthStateChanged,
  initializeAuth,
  getReactNativePersistence,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  setPersistence,
} from "firebase/auth/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import {
  FIREBASE_API_KEY,
  FIREBASE_PROJECT_ID,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
  FIREBASE_MEASUREMENT_ID,
} from "react-native-dotenv";

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
  measurementId: FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

const analytics = isSupported()
  .then(() => getAnalytics(app))
  .catch(() => {
    alert("Analytics is not supported on this device");
  });

const auth = getAuth(app);

const getAuthState = onAuthStateChanged(auth, (user) => {
  return user;
});

// Sign in with email and password
const signInAndPersist = (email, password) =>
  setPersistence(auth, getReactNativePersistence(AsyncStorage)).then(() => {
    return signInWithEmailAndPassword(auth, email, password);
  });

// Create a new user
const createNewUser = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

const db = getFirestore(app);

export {
  analytics,
  db,
  signInAndPersist,
  createNewUser,
  setPersistence,
  getAuthState,
};

// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
