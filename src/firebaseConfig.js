// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyAV-flli_as2Nuv9jpogpKrmxu-5-qvRMo",
  authDomain: "habit-tracker-51198.firebaseapp.com",
  projectId: "habit-tracker-51198",
  storageBucket: "habit-tracker-51198.firebasestorage.app",
  messagingSenderId: "201353518550",
  appId: "1:201353518550:web:e83450e25fb84bdb175877",
  measurementId: "G-76ZSQR39MR"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


// --- THESE ARE REQUIRED EXPORTS ---
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);