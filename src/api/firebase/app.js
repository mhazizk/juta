import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBa2PQkoyKDmok1qEmGGTPdZPEhy16unPQ",
  authDomain: "cashlog-app.firebaseapp.com",
  projectId: "cashlog-app",
  storageBucket: "cashlog-app.appspot.com",
  messagingSenderId: "535532688013",
  appId: "1:535532688013:web:b664a2a9c41447218608c4",
  measurementId: "G-4F0HF1XHQ9",
};

const app = initializeApp(firebaseConfig);
export default app;
