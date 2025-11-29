import * as firebaseApp from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDHF1iUJC2KE3Rgftx0doe2PoKcu4eljXg",
  authDomain: "yury-studio.firebaseapp.com",
  projectId: "yury-studio",
  storageBucket: "yury-studio.firebasestorage.app",
  messagingSenderId: "266804326400",
  appId: "1:266804326400:web:9b51d29fb5757314aea8e5"
};

// Initialize Firebase
// Using namespace import for firebase/app to avoid 'no exported member' errors in certain TS environments
// Also using getApps() to prevent multiple initialization during hot reloads
const app = firebaseApp.getApps().length === 0 ? firebaseApp.initializeApp(firebaseConfig) : firebaseApp.getApps()[0];
export const db = getFirestore(app);