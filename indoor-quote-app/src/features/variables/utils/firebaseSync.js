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

// Returns { ok, data, code }. `data` is null when the document doesn't exist
// yet; `ok: false` means the read itself failed (e.g. permission-denied), so
// callers must not treat it as "empty" and overwrite the shared document.
export async function loadSyncedVars() {
  if (!isFirebaseConfigured()) {
    return { ok: false, data: null, code: "sync/not-configured" };
  }
  try {
    const snapshot = await getDoc(getVarsDocRef());
    return { ok: true, data: snapshot.exists() ? snapshot.data() : null };
  } catch (error) {
    return { ok: false, data: null, code: error.code || "sync/unknown" };
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
