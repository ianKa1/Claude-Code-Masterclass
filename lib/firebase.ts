import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "pocket-heist-app",
  appId: "1:555420187372:web:ec9b910405560a86f543c9",
  storageBucket: "pocket-heist-app.firebasestorage.app",
  apiKey: "AIzaSyAUa2ERYA7xnJHuTZrS86bT3DbN_cDi7PY",
  authDomain: "pocket-heist-app.firebaseapp.com",
  messagingSenderId: "555420187372",
};

// Initialize Firebase (prevent multiple instances)
const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
