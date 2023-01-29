import {
  // DEV
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
  // PROD
  PROD_FIREBASE_API_KEY,
  PROD_FIREBASE_PROJECT_ID,
  PROD_FIREBASE_AUTH_DOMAIN,
  PROD_FIREBASE_STORAGE_BUCKET,
  PROD_FIREBASE_MESSAGING_SENDER_ID,
  PROD_FIREBASE_APP_ID,
  PROD_FIREBASE_MEASUREMENT_ID,
  PROD_LOGSNAG_API_KEY,
  PROD_LOGSNAG_API_URL,
  PROD_SENTRY_DSN
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

export default __DEV__ ? devEnv : prodEnv;
