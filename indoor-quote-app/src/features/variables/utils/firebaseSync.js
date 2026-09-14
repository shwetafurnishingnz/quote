import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import {
  getFirebaseApp,
  isFirebaseConfigured,
  VARS_COLLECTION,
  VARS_DOC_ID,
} from "../../auth/utils/firebaseApp";

function getVarsDocRef() {
  const db = getFirestore(getFirebaseApp());
  return doc(db, VARS_COLLECTION, VARS_DOC_ID);
}

export async function loadSyncedVars() {
  if (!isFirebaseConfigured()) {
    return null;
  }
  try {
    const snapshot = await getDoc(getVarsDocRef());
    return snapshot.exists() ? snapshot.data() : null;
  } catch (error) {
    return null;
  }
}

export async function saveSyncedVars(vars) {
  if (!isFirebaseConfigured()) {
    return { ok: false, code: "sync/not-configured" };
  }
  try {
    await setDoc(getVarsDocRef(), vars);
    return { ok: true };
  } catch (error) {
    return { ok: false, code: error.code || "sync/unknown" };
  }
}
