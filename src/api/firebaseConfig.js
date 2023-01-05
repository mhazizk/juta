import firebase from "firebase/compat";
// import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBa2PQkoyKDmok1qEmGGTPdZPEhy16unPQ",
  authDomain: "cashlog-app.firebaseapp.com",
  projectId: "cashlog-app",
  storageBucket: "cashlog-app.appspot.com",
  messagingSenderId: "535532688013",
  appId: "1:535532688013:web:b664a2a9c41447218608c4",
  measurementId: "G-4F0HF1XHQ9",
};

// Initialize Firebase
let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

const auth = firebase.auth();
const analytics = getAnalytics(app);

export { auth, analytics };

// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
