import { NavLink } from "react-router-dom";

export default function Toolbar({ onLogout }) {
  return (
    <header className="toolbar">
      <div className="toolbar-brand">
        Indoor Blinds <span>Quote Tool</span>
      </div>

      <nav className="toolbar-nav">
        <NavLink
          to="/"
          end
          className={({ isActive }) => `toolbar-link${isActive ? " active" : ""}`}
        >
          Home
        </NavLink>
        <NavLink
          to="/quote"
          className={({ isActive }) => `toolbar-link${isActive ? " active" : ""}`}
        >
          New quote
        </NavLink>
        <NavLink
          to="/variables"
          className={({ isActive }) => `toolbar-link${isActive ? " active" : ""}`}
        >
          Variables
        </NavLink>
      </nav>

      <button type="button" className="toolbar-logout" onClick={onLogout}>
        Log out
      </button>
    </header>
  );
}
