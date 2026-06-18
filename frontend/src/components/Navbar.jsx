import { Link } from "react-router-dom";
import { FiBell } from "react-icons/fi";
import useAuth from "../hooks/useAuth";
import { ROLES } from "../utils/constants";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark site-navbar">
      <div className="container">
        <Link className="navbar-brand" to="/">
          DoctorCare
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/doctors">
                Find Doctors
              </Link>
            </li>

            {user?.role === ROLES.PATIENT && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/patient/dashboard">
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/appointments">
                    My Appointments
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/profile">
                    Profile
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/doctor/apply">
                    Become a Doctor
                  </Link>
                </li>
              </>
            )}

            {user?.role === ROLES.DOCTOR && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/doctor/dashboard">
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/doctor/appointments">
                    Appointments
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/doctor/profile">
                    Profile
                  </Link>
                </li>
              </>
            )}

            {user?.role === ROLES.ADMIN && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin">
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/doctors">
                    Pending Doctors
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/users">
                    Users
                  </Link>
                </li>
              </>
            )}
          </ul>

          <div className="d-flex align-items-center gap-2">
            {user ? (
              <>
                <Link
                  to="/notifications"
                  className="btn btn-outline-light btn-sm nav-icon-btn"
                  title="Notifications"
                >
                  <FiBell size={18} />
                </Link>
                <span className="text-white d-none d-md-inline">
                  Hi, {user.name}
                </span>
                <button
                  type="button"
                  className="btn btn-light btn-sm"
                  onClick={logout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-light btn-sm">
                  Login
                </Link>
                <Link to="/register" className="btn btn-accent btn-sm">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
