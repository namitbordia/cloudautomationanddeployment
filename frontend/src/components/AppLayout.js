import { NavLink, Outlet } from "react-router-dom";
import { useWellness } from "../state/WellnessContext";

const navItems = [
  { to: "/check-in", label: "Check-In" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/events", label: "Events" },
  { to: "/groups", label: "Groups" },
  { to: "/suggestions", label: "Suggestions" },
];

function AppLayout() {
  const { anonymousId, signOut, error } = useWellness();

  return (
    <main className="appShell">
      <aside className="sidePanel">
        <div className="brandBlock">
          <p className="eyebrow">Student Wellness</p>
          <h1>Mind Harbor</h1>
          <p className="muted">
            Gentle, anonymous check-ins for academic pressure, routine, and reflection.
          </p>
        </div>

        <nav className="navList" aria-label="Primary">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? "navLink active" : "navLink")}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sessionCard">
          <span className="sessionLabel">Anonymous ID</span>
          <code>{anonymousId ? `${anonymousId.slice(0, 8)}...` : "No session"}</code>
          <button type="button" className="secondaryButton" onClick={signOut}>
            Reset session
          </button>
        </div>
      </aside>

      <section className="contentPanel">
        {error && <div className="bannerError">{error}</div>}
        <Outlet />
      </section>
    </main>
  );
}

export default AppLayout;
