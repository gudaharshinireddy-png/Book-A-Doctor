import {
  FaUserMd,
  FaUsers,
  FaCalendarCheck,
  FaHeartbeat,
} from "react-icons/fa";
import heroImg from "../../assets/hero.png";

const AuthBranding = ({ variant = "login" }) => {
  const trustItems = [
    {
      icon: <FaUserMd />,
      value: "—",
      label: "Verified Doctors",
    },
    {
      icon: <FaUsers />,
      value: "—",
      label: "Registered Patients",
    },
    {
      icon: <FaCalendarCheck />,
      value: "—",
      label: "Appointments Booked",
    },
  ];

  return (
    <div className="auth-brand">
      <div className="auth-brand-inner">
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <FaHeartbeat />
          </div>
          <span className="auth-logo-text">DoctorCare</span>
        </div>

        {variant === "login" ? (
          <>
            <h1>
              Healthcare made <span>simple</span> for everyone
            </h1>
            <p className="auth-brand-desc">
              Connect with certified specialists, manage appointments seamlessly,
              and experience care that puts you first — trusted by hospitals,
              doctors, and patients nationwide.
            </p>
          </>
        ) : (
          <>
            <h1>
              Join India&apos;s trusted <span>healthcare</span> network
            </h1>
            <p className="auth-brand-desc">
              Whether you&apos;re a patient seeking care, a doctor expanding your
              practice, or an administrator — DoctorCare brings everyone together
              on one secure platform.
            </p>
          </>
        )}

        <div className="auth-trust-grid">
          {trustItems.map((item) => (
            <div className="auth-trust-card" key={item.label}>
              <div className="auth-trust-icon">{item.icon}</div>
              <div>
                <div className="auth-trust-value">{item.value}</div>
                <div className="auth-trust-label">{item.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <img
        src={heroImg}
        alt=""
        aria-hidden="true"
        className="auth-illustration"
      />
    </div>
  );
};

export default AuthBranding;
