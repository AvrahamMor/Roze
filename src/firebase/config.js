import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Function to retrieve Firebase config from env or local storage
export function getFirebaseConfig() {
  // Check localStorage first for custom user configuration entered via UI
  try {
    const savedCustomConfig = localStorage.getItem('roze_firebase_config');
    if (savedCustomConfig) {
      const parsed = JSON.parse(savedCustomConfig);
      if (parsed.apiKey && parsed.projectId) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to parse custom Firebase config from localStorage', e);
  }

  // Fallback to Vite environment variables
  const envConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };

  if (envConfig.apiKey && envConfig.projectId && envConfig.apiKey !== 'your_api_key_here') {
    return envConfig;
  }

  return null;
}

let app = null;
let db = null;
let isConfigured = false;

export function initFirebase() {
  const config = getFirebaseConfig();
  if (!config || !config.apiKey || !config.projectId) {
    isConfigured = false;
    db = null;
    app = null;
    return { app: null, db: null, isConfigured: false };
  }

  try {
    app = getApps().length === 0 ? initializeApp(config) : getApp();
    db = getFirestore(app);
    isConfigured = true;
    return { app, db, isConfigured: true };
  } catch (error) {
    console.error('Firebase initialization error:', error);
    isConfigured = false;
    db = null;
    return { app: null, db: null, isConfigured: false, error };
  }
}

// Initial initialization
const initial = initFirebase();
app = initial.app;
db = initial.db;
isConfigured = initial.isConfigured;

export { app, db, isConfigured };
