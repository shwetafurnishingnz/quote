import { NavLink } from "react-router-dom";
import { BlindsIcon } from "./Icons";

const linkClass = ({ isActive }) => `toolbar-link${isActive ? " active" : ""}`;

export default function Toolbar({ userEmail, onLogout }) {
  return (
    <header className="toolbar">
      <div className="toolbar-brand">
        <span className="brand-mark">
          <BlindsIcon size={18} />
        </span>
        Indoor Blinds <span>Quote</span>
      </div>

      <nav className="toolbar-nav">
        <NavLink to="/" end className={linkClass}>
          Home
        </NavLink>
        <NavLink to="/quote" className={linkClass}>
          New quote
        </NavLink>
        <NavLink to="/variables" className={linkClass}>
          Variables
        </NavLink>
      </nav>

      <div className="toolbar-user">
        {userEmail && <span className="toolbar-email">{userEmail}</span>}
        <button type="button" className="toolbar-logout" onClick={onLogout}>
          Log out
        </button>
      </div>
    </header>
  );
}
