import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

/**
 * Firebase configuration object
 * Get these values from your Firebase Console: https://console.firebase.google.com
 * Environment variables prefixed with EXPO_PUBLIC_ are available in the app
 */
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};
/**
 * Validate Firebase configuration
 * Logs warnings if required fields are missing
 */
const validateConfig = () => {
  const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket'];
  const missingFields = requiredFields.filter((field) => !firebaseConfig[field]);

  if (missingFields.length > 0) {
    console.warn(
      `Firebase config missing: ${missingFields.join(', ')}. ` +
        'Add them to .env.local file.',
    );
  }
};

validateConfig();

// Initialize Firebase app (reuse existing if available)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

/**
 * Firebase Authentication instance
 * Uses platform-specific persistence:
 * - Native (iOS/Android): AsyncStorage for offline support
 * - Web: Browser's IndexedDB
 */
let auth;

if (Platform.OS === 'web') {
  // Web uses default persistence (IndexedDB)
  auth = getAuth(app);
} else {
  // Native platforms use AsyncStorage for offline persistence
  try {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (error) {
    // Fall back to default auth if persistence is already initialized
    auth = getAuth(app);
  }
}

/**
 * Firestore database instance
 * Used for storing items, users, and other data
 */
const db = getFirestore(app);

/**
 * Firebase Storage instance
 * Used for storing images and files
 */
const storage = getStorage(app);

export { app, auth, db, storage };
