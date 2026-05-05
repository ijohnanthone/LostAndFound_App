import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, getReactNativePersistence, initializeAuth } from "firebase/auth";
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

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

/** @type {import("firebase/auth").Auth} */
let auth;

if (Platform.OS === "web") {
  auth = getAuth(app);
} else {
  try {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch {
    auth = getAuth(app);
  }
}

export const db = getFirestore(app);
export { app, auth };
