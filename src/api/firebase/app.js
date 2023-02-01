// import { initializeApp } from "firebase/app";
import firebase from "@react-native-firebase/app";

import env from "../../config/env";

// const firebaseConfig = {
//   apiKey: env.firebaseConfig.apiKey,
//   authDomain: env.firebaseConfig.authDomain,
//   projectId: env.firebaseConfig.projectId,
//   storageBucket: env.firebaseConfig.projectId,
//   messagingSenderId: env.firebaseConfig.messagingSenderId,
//   appId: env.firebaseConfig.appId,
//   measurementId: env.firebaseConfig.measurementId,
// };

const credentials = {
  clientId:
    "535532688013-5qb9foro1qrgv9ktg2500rqavdgc59pm.apps.googleusercontent.com",
  appId: "1:535532688013:android:5f0c069ea373e49f8608c4",
  apiKey: "AIzaSyAB-aCdjhXKLMcWIqyJ2eWn1SZ7sWR_Xfg",
  databaseURL: "",
  storageBucket: "cashlog-app.appspot.com",
  messagingSenderId: "535532688013",
  projectId: "cashlog-app",
};

const config = {
  name: "juta-android",
};

await firebase.initializeApp(credentials, config);

const apps = firebase.apps;

apps.forEach((app) => {
  console.log("App name: ", app.name);
});
export default apps;
