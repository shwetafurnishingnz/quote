import { useEffect, useRef, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import AuthGate from "./features/auth/components/AuthGate";
import {
  loginWithFirebase,
  logoutFromFirebase,
  sendResetEmail,
  subscribeAuthState,
} from "./features/auth/utils/firebaseAuth";
import HomeSection from "./features/home/components/HomeSection";
import Toolbar from "./features/layout/components/Toolbar";
import QuoteSection from "./features/quote/components/QuoteSection";
import { computeQuote } from "./features/quote/utils/quote";
import VarsSection from "./features/variables/components/VarsSection";
import {
  loadSyncedVars,
  saveSyncedVars,
} from "./features/variables/utils/firebaseSync";
import { loadVars, saveVars } from "./features/variables/utils/storage";
import { normalizeVars } from "./features/variables/utils/variables";

export default function App() {
  const navigate = useNavigate();

  const [vars, setVars] = useState(loadVars);
  const [editVars, setEditVars] = useState(loadVars);
  const [syncStatus, setSyncStatus] = useState("checking");
  const [syncStatusMessage, setSyncStatusMessage] = useState("Checking cloud sync...");

  const [blinds, setBlinds] = useState([{ id: 1, length: "", sag: "", brackets: 2 }]);
  const [style, setStyle] = useState("roller");
  const [fabric, setFabric] = useState("blockout");
  const [mount, setMount] = useState("inside");
  const [quoteErrors, setQuoteErrors] = useState({
    global: false,
    blinds: [],
  });
  const [quoteResult, setQuoteResult] = useState(null);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  function showToast(message, tone = "success") {
    clearTimeout(toastTimer.current);
    setToast({ message, tone, id: Date.now() });
    toastTimer.current = setTimeout(() => setToast(null), 4000);
  }

  useEffect(() => {
    let cancelled = false;

    async function bootstrapVarsSync() {
      const remoteVars = await loadSyncedVars();
      if (cancelled) {
        return;
      }

      if (remoteVars) {
        const normalized = normalizeVars(remoteVars);
        setVars(normalized);
        setEditVars(normalized);
        saveVars(normalized);
        setSyncStatus("connected");
        setSyncStatusMessage("Connected");
        return;
      }

      const seedResult = await saveSyncedVars(vars);
      if (cancelled) {
        return;
      }

      if (seedResult.ok) {
        setSyncStatus("connected");
        setSyncStatusMessage("Connected");
      } else {
        setSyncStatus("local");
        setSyncStatusMessage(getSyncErrorMessage(seedResult.code));
      }
    }

    bootstrapVarsSync();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function logout() {
    await logoutFromFirebase();
    navigate("/");
  }

  function stepQuoteField(index, field, delta) {
    setBlinds((prev) =>
      prev.map((blind, blindIndex) => {
        if (blindIndex !== index) {
          return blind;
        }

        const current = parseFloat(blind[field]) || 0;
        const next = Math.round((current + delta) * 100) / 100;
        return {
          ...blind,
          [field]: String(Math.max(next, 0)),
        };
      })
    );
  }

  function updateBlindField(index, field, value) {
    setBlinds((prev) =>
      prev.map((blind, blindIndex) =>
        blindIndex === index ? { ...blind, [field]: value } : blind
      )
    );
  }

  function addBlind() {
    setBlinds((prev) => [
      ...prev,
      { id: Date.now(), length: "", sag: "", brackets: 2 },
    ]);
  }

  function removeBlind(index) {
    setBlinds((prev) => {
      if (prev.length <= 1) {
        return [{ id: Date.now(), length: "", sag: "", brackets: 2 }];
      }
      return prev.filter((_, blindIndex) => blindIndex !== index);
    });
  }

  function clearQuote() {
    setBlinds([{ id: Date.now(), length: "", sag: "", brackets: 2 }]);
    setStyle("roller");
    setFabric("blockout");
    setMount("inside");
    setQuoteErrors({ global: false, blinds: [] });
    setQuoteResult(null);
  }

  function calculateQuote(event) {
    event.preventDefault();

    const blindRows = blinds.map((blind) => ({
      length: parseFloat(blind.length),
      sag: parseFloat(blind.sag),
      brackets: parseInt(blind.brackets, 10) || 2,
    }));

    const blindErrors = blindRows.map((blind) => ({
      length: Number.isNaN(blind.length) || blind.length <= 0,
      sag: Number.isNaN(blind.sag) || blind.sag <= 0,
    }));

    const hasErrors = blindErrors.some((row) => row.length || row.sag);

    setQuoteErrors({
      global: hasErrors,
      blinds: blindErrors,
    });

    if (hasErrors) {
      setQuoteResult(null);
      return;
    }

    setQuoteResult(
      computeQuote(
        {
          blinds: blindRows,
          style,
          fabric,
          mount,
        },
        vars
      )
    );
  }

  function stepEditField(groupKey, fieldKey, delta) {
    setEditVars((prev) => {
      const current = parseFloat(prev[groupKey][fieldKey]) || 0;
      const rounded = Math.round((current + delta) * 100) / 100;
      return {
        ...prev,
        [groupKey]: { ...prev[groupKey], [fieldKey]: rounded },
      };
    });
  }

  function updateEditField(groupKey, fieldKey, value) {
    setEditVars((prev) => ({
      ...prev,
      [groupKey]: { ...prev[groupKey], [fieldKey]: value },
    }));
  }

  async function saveEditVars(event) {
    event.preventDefault();
    const normalized = normalizeVars(editVars);
    setVars(normalized);
    setEditVars(normalized);
    saveVars(normalized);

    const syncResult = await saveSyncedVars(normalized);
    if (syncResult.ok) {
      setSyncStatus("connected");
      setSyncStatusMessage("Connected");
      showToast("Variables saved and synced");
    } else {
      setSyncStatus("local");
      setSyncStatusMessage(getSyncErrorMessage(syncResult.code));
      showToast(`Saved locally. ${getSyncErrorMessage(syncResult.code)}`, "warning");
    }

    navigate("/");
  }

  function cancelEdit() {
    setEditVars(normalizeVars(vars));
  }

  return (
    <>
      <div className="app-shell">
        <Toolbar onLogout={logout} />

        <main className="page-host">
          <Routes>
            <Route path="/" element={<HomeSection onNavigate={navigate} />} />
            <Route
              path="/quote"
              element={
                <QuoteSection
                  blinds={blinds}
                  style={style}
                  fabric={fabric}
                  mount={mount}
                  quoteErrors={quoteErrors}
                  quoteResult={quoteResult}
                  onBlindsChange={updateBlindField}
                  onStyleChange={(event) => setStyle(event.target.value)}
                  onFabricChange={(event) => setFabric(event.target.value)}
                  onMountChange={(event) => setMount(event.target.value)}
                  onStepField={stepQuoteField}
                  onClear={clearQuote}
                  onCalculate={calculateQuote}
                  onAddBlind={addBlind}
                  onRemoveBlind={removeBlind}
                />
              }
            />
            <Route
              path="/variables"
              element={
                <VarsSection
                  editVars={editVars}
                  syncStatus={syncStatus}
                  syncStatusMessage={syncStatusMessage}
                  onStepField={stepEditField}
                  onInputChange={updateEditField}
                  onSave={saveEditVars}
                  onCancel={cancelEdit}
                />
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <footer className="app-footer">&copy; {new Date().getFullYear()} Indoor Blinds Quote</footer>
      </div>

      {toast && (
        <div key={toast.id} className={`toast ${toast.tone}`} role="status">
          <span className="toast-dot" />
          {toast.message}
        </div>
      )}
    </>
  );
}

function getAuthErrorMessage(code) {
  switch (code) {
    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "Invalid email or password.";
    case "auth/invalid-email":
      return "That email format looks invalid.";
    case "auth/too-many-requests":
      return "Too many attempts. Wait a few minutes or use Forgot password.";
    case "auth/not-configured":
      return "Authentication is not configured for this environment.";
    default:
      return "Sign-in failed. Please try again.";
  }
}

function getResetErrorMessage(code) {
  switch (code) {
    case "auth/invalid-email":
      return "Enter a valid email address to reset your password.";
    case "auth/user-not-found":
      return "No account found with that email.";
    case "auth/too-many-requests":
      return "Too many reset requests. Wait a few minutes and try again.";
    case "auth/not-configured":
      return "Password reset is not configured for this environment.";
    default:
      return "Could not send reset email. Please try again.";
  }
}

function getSyncErrorMessage(code) {
  switch (code) {
    case "permission-denied":
      return "Firebase denied access. Check Firestore rules for Indoor_Quote_App/Shared_Variables.";
    case "unauthenticated":
      return "You are not authenticated with Firebase. Log in again and retry.";
    case "sync/not-configured":
      return "Firebase sync is not configured in this deployed environment.";
    default:
      return "Firebase sync is unavailable right now.";
  }
}
