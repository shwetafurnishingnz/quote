import { NavLink } from "react-router-dom";
import { BlindsIcon } from "./Icons";

const linkClass = ({ isActive }) => `toolbar-link${isActive ? " active" : ""}`;

export default function Toolbar({ onLogout }) {
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

      <button type="button" className="toolbar-logout" onClick={onLogout}>
        Log out
      </button>
    </header>
  );
}
