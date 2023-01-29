import { initializeApp } from "firebase/app";

import env from "../../config/env";

const firebaseConfig = {
  apiKey: env.firebaseConfig.apiKey,
  authDomain: env.firebaseConfig.authDomain,
  projectId: env.firebaseConfig.projectId,
  storageBucket: env.firebaseConfig.projectId,
  messagingSenderId: env.firebaseConfig.messagingSenderId,
  appId: env.firebaseConfig.appId,
  measurementId: env.firebaseConfig.measurementId,
};

const app = initializeApp(firebaseConfig);
export default app;
