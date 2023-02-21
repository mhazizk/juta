import { initializeApp } from "firebase/app";

import env from "../../config/env";

const firebaseConfig = {
  apiKey: env.FIREBASE_CONFIG.API_KEY,
  authDomain: env.FIREBASE_CONFIG.AUTH_DOMAIN,
  projectId: env.FIREBASE_CONFIG.PROJECT_ID,
  storageBucket: env.FIREBASE_CONFIG.PROJECT_ID,
  messagingSenderId: env.FIREBASE_CONFIG.MESSAGING_SENDER_ID,
  appId: env.FIREBASE_CONFIG.APP_ID,
  measurementId: env.FIREBASE_CONFIG.MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
export default app;
