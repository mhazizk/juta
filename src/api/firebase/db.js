import { getFirestore, initializeFirestore } from "firebase/firestore";
import app from "./app";

// const db = getFirestore(app);
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  //   experimentalAutoDetectLongPolling: true,
});
export default db;
