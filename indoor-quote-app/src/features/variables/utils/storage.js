import { DEFAULT_VARS, normalizeVars } from "./variables";

const STORAGE_KEY = "indoor-quote-app.vars";

export function loadVars() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return DEFAULT_VARS;
    }
    return normalizeVars(JSON.parse(raw));
  } catch (error) {
    return DEFAULT_VARS;
  }
}

export function saveVars(vars) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(vars));
  } catch (error) {
    // Storage can fail (e.g. private browsing) — local persistence is
    // best-effort, Firestore sync is the source of truth when available.
  }
}
