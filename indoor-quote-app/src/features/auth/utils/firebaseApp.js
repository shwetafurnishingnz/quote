import { getApps, initializeApp } from "firebase/app";

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

export const VARS_COLLECTION =
  import.meta.env.VITE_FIREBASE_VARS_COLLECTION || "Indoor_Quote_App";
export const VARS_DOC_ID =
  import.meta.env.VITE_FIREBASE_VARS_DOC_ID || "Shared_Variables";

export function isFirebaseConfigured() {
  return Boolean(config.apiKey && config.projectId && config.appId);
}

let appInstance = null;

export function getFirebaseApp() {
  if (!isFirebaseConfigured()) {
    throw new Error("Firebase is not configured for this environment.");
  }
  if (!appInstance) {
    appInstance = getApps().length ? getApps()[0] : initializeApp(config);
  }
  return appInstance;
}
