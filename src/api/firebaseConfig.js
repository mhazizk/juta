// DEPRECATED

// import {
//   getAuth,
//   onAuthStateChanged,
//   initializeAuth,
//   getReactNativePersistence,
//   signInWithEmailAndPassword,
//   createUserWithEmailAndPassword,
//   setPersistence,
// } from "firebase/auth/react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { initializeApp } from "firebase/app";
// import { getAnalytics, isSupported } from "firebase/analytics";
// import { getFirestore } from "firebase/firestore";
// import env from "../config/env";

// const firebaseConfig = {
//   apiKey: env.firebaseConfig.apiKey,
//   authDomain: env.firebaseConfig.authDomain,
//   projectId: env.firebaseConfig.projectId,
//   storageBucket: env.firebaseConfig.projectId,
//   messagingSenderId: env.firebaseConfig.messagingSenderId,
//   appId: env.firebaseConfig.appId,
//   measurementId: env.firebaseConfig.measurementId,
// };

// const app = initializeApp(firebaseConfig);

// const analytics = isSupported()
//   .then(() => getAnalytics(app))
//   .catch(() => {
//     alert("Analytics is not supported on this device");
//   });

// const auth = getAuth(app);

// const getAuthState = onAuthStateChanged(auth, (user) => {
//   return user;
// });

// // Sign in with email and password
// const signInAndPersist = (email, password) =>
//   setPersistence(auth, getReactNativePersistence(AsyncStorage)).then(() => {
//     return signInWithEmailAndPassword(auth, email, password);
//   });

// // Create a new user
// const createNewUser = (email, password) => {
//   return createUserWithEmailAndPassword(auth, email, password);
// };

// const db = getFirestore(app);

// export {
//   // analytics,
//   // db,
//   // // signInAndPersist,
//   // createNewUser,
//   // setPersistence,
//   // getAuthState,
// };

// // For more information on how to access Firebase in your project,
// // see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
