export default function AuthGate({
  authUsername,
  authPassword,
  authError,
  authErrorMessage,
  authInfoMessage,
  authLoading,
  authSubmitting,
  authResetting,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
  onForgotPassword,
}) {
  return (
    <div className="auth-gate">
      <div className="auth-card">
        <h1 className="auth-title">Sign in</h1>
        <p className="auth-subtitle">Enter your operator email and password.</p>

        {authLoading ? (
          <p className="auth-loading">Checking your session…</p>
        ) : (
          <form onSubmit={onSubmit}>
            {authError && <div className="auth-error">{authErrorMessage}</div>}
            {!authError && authInfoMessage && (
              <div className="auth-info">{authInfoMessage}</div>
            )}

            <div className="auth-field">
              <label htmlFor="auth-email">Email</label>
              <input
                id="auth-email"
                type="email"
                autoComplete="username"
                value={authUsername}
                onChange={onUsernameChange}
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="auth-password">Password</label>
              <input
                id="auth-password"
                type="password"
                autoComplete="current-password"
                value={authPassword}
                onChange={onPasswordChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={authSubmitting}>
              {authSubmitting ? "Signing in…" : "Sign in"}
            </button>

            <button
              type="button"
              className="auth-forgot"
              onClick={onForgotPassword}
              disabled={authResetting}
            >
              {authResetting ? "Sending reset email…" : "Forgot password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
