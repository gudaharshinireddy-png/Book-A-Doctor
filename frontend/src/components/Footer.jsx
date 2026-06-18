import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-col">
          <h3>DoctorCare</h3>
          <p>Making healthcare accessible, simple and secure.</p>
        </div>

        <div className="footer-col">
          <h4>Platform</h4>
          <Link to="/doctors">Find Doctors</Link>
          <Link to="/register">Register</Link>
          <Link to="/login">Login</Link>
        </div>

        <div className="footer-col">
          <h4>Patients</h4>
          <Link to="/appointments">My Appointments</Link>
          <Link to="/notifications">Notifications</Link>
          <Link to="/doctor/apply">Become a Doctor</Link>
        </div>

        <div className="footer-col">
          <h4>Contact</h4>
          <p>support@doctorcare.com</p>
          <p>+91 9876543210</p>
        </div>
      </div>

      <div className="footer-bottom">
        © 2026 DoctorCare. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
