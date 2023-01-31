import * as Constants from "expo-constants";
import {
  PROD_FIREBASE_API_KEY,
  PROD_FIREBASE_PROJECT_ID,
  PROD_FIREBASE_AUTH_DOMAIN,
  PROD_FIREBASE_STORAGE_BUCKET,
  PROD_FIREBASE_MESSAGING_SENDER_ID,
  PROD_FIREBASE_APP_ID,
  PROD_FIREBASE_MEASUREMENT_ID,
  PROD_LOGSNAG_API_KEY,
  PROD_LOGSNAG_API_URL,
  PROD_SENTRY_DSN,
  DEV_FIREBASE_API_KEY,
  DEV_FIREBASE_PROJECT_ID,
  DEV_FIREBASE_AUTH_DOMAIN,
  DEV_FIREBASE_STORAGE_BUCKET,
  DEV_FIREBASE_MESSAGING_SENDER_ID,
  DEV_FIREBASE_APP_ID,
  DEV_FIREBASE_MEASUREMENT_ID,
  DEV_LOGSNAG_API_KEY,
  DEV_LOGSNAG_API_URL,
  DEV_SENTRY_DSN,
} from "@env";

const devEnv = {
  firebaseConfig: {
    apiKey: DEV_FIREBASE_API_KEY,
    authDomain: DEV_FIREBASE_AUTH_DOMAIN,
    projectId: DEV_FIREBASE_PROJECT_ID,
    storageBucket: DEV_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: DEV_FIREBASE_MESSAGING_SENDER_ID,
    appId: DEV_FIREBASE_APP_ID,
    measurementId: DEV_FIREBASE_MEASUREMENT_ID,
  },
  sentryConfig: {
    dsn: DEV_SENTRY_DSN,
  },
  logSnagConfig: {
    apiKey: DEV_LOGSNAG_API_KEY,
    apiUrl: DEV_LOGSNAG_API_URL,
  },
};

const prodEnv = {
  firebaseConfig: {
    apiKey: PROD_FIREBASE_API_KEY,
    authDomain: PROD_FIREBASE_AUTH_DOMAIN,
    projectId: PROD_FIREBASE_PROJECT_ID,
    storageBucket: PROD_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: PROD_FIREBASE_MESSAGING_SENDER_ID,
    appId: PROD_FIREBASE_APP_ID,
    measurementId: PROD_FIREBASE_MEASUREMENT_ID,
  },
  sentryConfig: {
    dsn: PROD_SENTRY_DSN,
  },
  logSnagConfig: {
    apiKey: PROD_LOGSNAG_API_KEY,
    apiUrl: PROD_LOGSNAG_API_URL,
  },
};

// const tryEnv = {
//   firebaseConfig: {
//     apiKey: "AIzaSyBa2PQkoyKDmok1qEmGGTPdZPEhy16unPQ",
//     authDomain: "cashlog-app.firebaseapp.com",
//     projectId: "cashlog-app",
//     storageBucket: "cashlog-app.appspot.com",
//     messagingSenderId: "535532688013",
//     appId: "1:535532688013:web:b664a2a9c41447218608c4",
//     measurementId: "G-4F0HF1XHQ9",
//   },
//   sentryConfig: {
//     dsn: "https://2041645fa3e1477a9b5fe533716eacd4@o4504586660478976.ingest.sentry.io/4504586695868416",
//   },
//   logSnagConfig: {
//     apiKey: "b0df022a7c9740a3e0d8f5f908cb33a2",
//     apiUrl: "https://api.logsnag.com/v1/log",
//   },
// };
// alert(`Constants.expoConfig :
//   ${Constants.default.expoConfig.extra.PROD_FIREBASE_API_KEY}\nConstants.manifest2 :
//   ${Constants.default.manifest2.extra.PROD_FIREBASE_API_KEY}\nprocess.env : ${process.env.PROD_FIREBASE_API_KEY}
// `);
// alert(`devFirebaseAPI : ${DEV_FIREBASE_API_KEY}\n\nConstants.expoConfig :
//   ${Constants.default.expoConfig.extra.PROD_FIREBASE_API_KEY}\nConstants.manifest2 :
//   ${Constants.default.manifest2.extra.PROD_FIREBASE_API_KEY}\nprocess.env : ${process.env.PROD_FIREBASE_API_KEY}
// `);
// export default prodEnv;
export default __DEV__ ? devEnv : prodEnv;
