// import { getFirestore, initializeFirestore } from "firebase/firestore";
// import app from "./app";
import firestore from '@react-native-firebase/firestore'

// const db = getFirestore(app);
const db = firestore().app('juta-android')
// const db = initializeFirestore(app, {
//     experimentalForceLongPolling: true,
// })
export default db;
