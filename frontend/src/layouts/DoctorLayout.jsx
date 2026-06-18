import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { FiCalendar, FiMenu, FiUser, FiX, FiHome } from "react-icons/fi";
import useAuth from "../hooks/useAuth";

const DoctorLayout = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const closeSidebar = () => setOpen(false);

  return (
    <div className="doctor-layout">
      <aside className={`doctor-sidebar ${open ? "open" : ""}`}>
        <div className="doctor-sidebar-head">
          <Link to="/doctor/dashboard" className="doctor-logo" onClick={closeSidebar}>
            DoctorCare
          </Link>
          <button
            type="button"
            className="doctor-sidebar-close d-lg-none"
            onClick={closeSidebar}
            aria-label="Close navigation"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="doctor-user-pill">
          <span className="doctor-user-avatar">
            {user?.name?.charAt(0)?.toUpperCase() || "D"}
          </span>
          <div>
            <strong>{user?.name || "Doctor"}</strong>
            <p>Doctor account</p>
          </div>
        </div>

        <nav className="doctor-nav">
          <NavLink to="/doctor/dashboard" onClick={closeSidebar}>
            <FiHome />
            Dashboard
          </NavLink>
          <NavLink to="/doctor/appointments" onClick={closeSidebar}>
            <FiCalendar />
            Appointments
          </NavLink>
          <NavLink to="/doctor/profile" onClick={closeSidebar}>
            <FiUser />
            Profile
          </NavLink>
        </nav>

        <button type="button" className="doctor-logout-btn" onClick={logout}>
          Logout
        </button>
      </aside>

      {open && <button type="button" className="doctor-overlay" onClick={closeSidebar} />}

      <div className="doctor-content">
        <header className="doctor-mobile-head d-lg-none">
          <button
            type="button"
            className="doctor-menu-btn"
            onClick={() => setOpen(true)}
            aria-label="Open navigation"
          >
            <FiMenu size={22} />
          </button>
          <h1>Doctor Portal</h1>
        </header>
        <Outlet />
      </div>
    </div>
  );
};

export default DoctorLayout;
