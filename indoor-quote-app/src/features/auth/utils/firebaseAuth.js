import {
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getFirebaseApp, isFirebaseConfigured } from "./firebaseApp";

let authInstance = null;

function getAuthInstance() {
  if (!isFirebaseConfigured()) {
    return null;
  }
  if (!authInstance) {
    authInstance = getAuth(getFirebaseApp());
  }
  return authInstance;
}

export function subscribeAuthState(callback) {
  const auth = getAuthInstance();
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

export async function loginWithFirebase(email, password) {
  const auth = getAuthInstance();
  if (!auth) {
    return { ok: false, code: "auth/not-configured" };
  }
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return { ok: true };
  } catch (error) {
    return { ok: false, code: error.code };
  }
}

export async function logoutFromFirebase() {
  const auth = getAuthInstance();
  if (!auth) {
    return;
  }
  await signOut(auth);
}

export async function sendResetEmail(email) {
  const auth = getAuthInstance();
  if (!auth) {
    return { ok: false, code: "auth/not-configured" };
  }
  try {
    await sendPasswordResetEmail(auth, email);
    return { ok: true };
  } catch (error) {
    return { ok: false, code: error.code };
  }
}
