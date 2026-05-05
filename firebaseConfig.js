import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA5eaNDwl0P5rZCCxLxGrZkkeS6UdpB4mA",
  authDomain: "lostandfoundapp-97615.firebaseapp.com",
  projectId: "lostandfoundapp-97615",
  storageBucket: "lostandfoundapp-97615.firebasestorage.app",
  messagingSenderId: "1014926958629",
  appId: "1:1014926958629:web:a63ae8b1ca5eb848659fcc",
  measurementId: "G-8DFZL3SXWP",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
